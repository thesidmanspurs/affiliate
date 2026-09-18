# Kế hoạch xây dựng Affiliate Platform

**Phạm vi:** nền tảng affiliate dùng chung cho nhiều sản phẩm của công ty (bắt đầu từ MoodScanr), tách domain riêng (`affiliate.congty.com`), tài khoản affiliate độc lập với tài khoản người dùng sản phẩm, tích hợp qua SDK.

---

## 1. Mục tiêu & nguyên tắc thiết kế

- **Reuse tối đa**: mỗi sản phẩm mới tích hợp trong vài ngày, không viết lại logic affiliate.
- **Tách domain quyết định**: product backend giữ quyền quyết định "ai referred ai" (vì giữ cookie); affiliate-core giữ quyền quyết định "đã trả tiền chưa" (vì giữ ledger). Hai bên không tranh quyền của nhau.
- **Không mất tiền, không đúp tiền**: mọi giao tiếp giữa 2 hệ thống đều có idempotency key + outbox, ledger append-only.
- **Không phụ thuộc cứng 1 payment/payout rail**: vì Việt Nam chưa được Stripe Connect hỗ trợ payout tự phục vụ, payout phải là 1 lớp adapter thay được (bank chuyển khoản thủ công, Momo/VNPay, Stripe Transfer khi khả dụng).

---

## 2. Tính năng theo vai trò

### 2.1 Affiliate (người giới thiệu)
- Đăng ký tài khoản affiliate riêng (không dùng chung login với sản phẩm) — email/password hoặc magic link.
- Chọn sản phẩm muốn quảng bá (nếu công ty có nhiều sản phẩm), lấy mã/link giới thiệu riêng cho từng sản phẩm.
- Dashboard xem: số click, số conversion, hoa hồng đang chờ duyệt (pending), đã duyệt (approved), đã trả (paid).
- Khai báo phương thức nhận tiền (số tài khoản ngân hàng / Momo).
- Lịch sử payout, tải hoá đơn/biên nhận (nếu cần cho thuế).
- Thông báo qua email khi có conversion mới hoặc payout hoàn tất.

### 2.2 Admin (nội bộ công ty)
- Duyệt/từ chối affiliate đăng ký mới (chống spam/fraud).
- Xem toàn bộ conversion theo sản phẩm, theo affiliate.
- Duyệt payout hàng loạt (batch), export báo cáo.
- Cấu hình tỉ lệ hoa hồng theo sản phẩm / theo tier affiliate.
- Đánh dấu conversion gian lận (revoke commission), xem log đối soát (reconciliation).
- Quản lý danh sách sản phẩm (merchant) đã tích hợp: API key, trạng thái, webhook health.

### 2.3 Sản phẩm tích hợp (merchant, vd MoodScanr)
- Cài `@yourorg/affiliate-sdk`, cấu hình `productId` + `apiKey`.
- Route `/r/:code` tự động redirect + set cookie first-party.
- Gọi 1 hàm duy nhất khi có thanh toán thành công: `recordConversion(...)`.
- Không cần biết logic tính hoa hồng, không cần biết payout rail.

---

## 3. Kiến trúc tổng thể

```
                         ┌───────────────────────────────────────┐
                         │        Affiliate platform              │
                         │        affiliate.congty.com            │
                         │                                         │
  Products ─(SDK, API   │  ┌─────────────────┐                   │
  key, idempotent       │  │ Auth & dashboard │  (login riêng)    │
  events)───────────────┼─▶│ Core API + ledger│                   │
                         │  │ Payout worker    │───▶ Payout rail   │
                         │  └─────────────────┘   (bank/Momo/     │
                         │                          Stripe...)     │
                         └───────────────────────────────────────┘
```

**Các thành phần:**

| Thành phần | Vai trò | Ghi chú |
|---|---|---|
| Product backend (MoodScanr, sp B, C...) | Set cookie, redirect click, phát sinh outbox event khi thanh toán thành công | Không lưu trạng thái affiliate, chỉ "báo tin" |
| `@yourorg/affiliate-sdk` | Thư viện dùng chung: route redirect, outbox writer, webhook translator, gọi Core API kèm idempotency key | Cài đặt 1 lần, version hoá bằng semver |
| Affiliate Core API | Nhận click/conversion, tính & ghi ledger, expose API cho dashboard | Stateless, idempotent, multi-tenant theo `productId` |
| Affiliate Auth & Dashboard | Login riêng cho affiliate, không dùng chung với User của sản phẩm | JWT scope riêng cho affiliate platform |
| Payout worker | Đọc ledger, thực hiện chi trả qua rail phù hợp | Chạy định kỳ hoặc theo admin trigger, không nằm trong luồng thanh toán chính |
| Admin panel | Duyệt affiliate, duyệt payout, cấu hình hoa hồng | Role riêng, tách khỏi admin của từng sản phẩm |

### 3.1 Data model (rút gọn)

```
Merchant        (id, productId, name, apiKeyHash, webhookSecret, status)
Affiliate       (id, merchantId, externalEmail, code, status, payoutMethod, tier)
ReferralClick   (id, clickId [idempotency], merchantId, affiliateCode, ip_hash, ua, createdAt)
Conversion      (id, eventId [idempotency], merchantId, clickId, externalUserId,
                 orderId, amount, currency, type[new|renewal], status[pending|approved|rejected])
CommissionLedger(id, affiliateId, conversionId, amount, status[pending|approved|paid], createdAt)  -- append-only
Payout          (id, affiliateId, amount, method, externalRef, status, period)
```

- Không FK cứng sang bảng `User` của từng sản phẩm — chỉ lưu `externalUserId` + snapshot email.
- Mọi bảng đều có `merchantId` → sẵn sàng multi-tenant từ ngày đầu.

---

## 4. Workflows chi tiết

### 4.1 Auth & Dashboard cho affiliate
1. Affiliate đăng ký tại `affiliate.congty.com/register` (email/password hoặc magic link) — **không** liên quan gì tới tài khoản trên MoodScanr.
2. Trạng thái mặc định `pending_review` (nếu công ty muốn duyệt thủ công để chống spam) hoặc `active` ngay (nếu chấp nhận rủi ro để tăng trưởng nhanh).
3. Chọn sản phẩm muốn quảng bá → hệ thống sinh `code` riêng theo từng `merchantId`.
4. JWT phát hành riêng cho affiliate platform, **không** dùng chung secret/issuer với JWT của MoodScanr hay sản phẩm khác — tránh 1 token vô tình dùng được ở 2 hệ thống.
5. Session ngắn hơn user thường (vd 7 ngày, có refresh) vì đây là tài khoản gắn với tiền.

### 4.2 Click tracking & attribution
1. User bấm `affiliate.congty.com/go/CODE` → redirect sang `moodscanr.ai/?ref=CODE&clickId=UUID`.
2. Backend MoodScanr set cookie first-party chứa `clickId` (không chỉ `code`), đồng thời gọi `POST /clicks` lên Core API (idempotent theo `clickId`).
3. Khi user đăng ký/nâng cấp, MoodScanr đọc `clickId` từ cookie server-side để xác định attribution — không dựa localStorage/extension storage.

### 4.3 Ghi nhận conversion (chống race, chống mất event)
1. Stripe webhook báo thanh toán thành công → trong **cùng transaction** với update subscription, MoodScanr ghi 1 row vào `outbox_events` nội bộ.
2. Worker nền đọc outbox, gọi `POST /conversions` lên Core API với `eventId` (idempotency key = `stripeEventId`/`invoiceId`), retry có backoff nếu lỗi.
3. Core API `INSERT ... ON CONFLICT (eventId) DO NOTHING` — trùng lặp bao nhiêu lần cũng chỉ 1 bản ghi.
4. Conversion mặc định vào `pending`, có buffer 14 ngày trước khi tự động chuyển `approved` (trừ hao trường hợp refund/chargeback).

### 4.4 Duyệt & tính hoa hồng
1. Admin (hoặc job tự động sau buffer window) duyệt `Conversion.status = approved`.
2. Tạo 1 row mới trong `CommissionLedger` (append-only, không update số dư trực tiếp).
3. Số dư khả dụng = `SUM(CommissionLedger.amount) WHERE status='approved' AND affiliateId=X`.

### 4.5 Payout
1. Affiliate yêu cầu rút hoặc admin chạy batch payout định kỳ (vd đầu tháng).
2. Payout worker đọc ledger `approved` chưa `paid`, gom theo affiliate, gọi `PayoutExecutor` phù hợp (bank thủ công cần admin xác nhận thủ công, Momo/VNPay qua API nếu có, Stripe Transfer nếu affiliate ở nước được hỗ trợ).
3. Đánh dấu ledger rows tương ứng `paid`, ghi `Payout.externalRef`.

### 4.6 Reconciliation (lưới an toàn)
- Cron job đêm: so sánh tổng subscription active có `ref` cookie trên từng sản phẩm vs tổng conversion đã ghi trong Core API → lệch thì cảnh báo, không tự sửa.

### 4.7 Tích hợp sản phẩm mới (product B, C...)
1. Admin tạo `Merchant` mới trong affiliate platform → nhận `apiKey`/`webhookSecret`.
2. Team sản phẩm B cài `@yourorg/affiliate-sdk`, cấu hình `productId` + key.
3. Viết 1 dòng gọi `recordConversion()` ở nơi xử lý thanh toán thành công.
4. Xong — không cần đụng vào Core API, ledger, dashboard, payout.

---

## 5. Roadmap triển khai theo giai đoạn

> Ước lượng thời gian giả định 1 backend dev + 1 frontend dev làm song song, part-time trên nền dự án hiện có. Điều chỉnh theo nguồn lực thực tế.

### Giai đoạn 0 — Chuẩn bị nền tảng (1 tuần)
- Chốt data model, viết Prisma schema (schema riêng `affiliate.*`).
- Dựng khung `affiliate-core` theo ports & adapters (domain / usecases / adapters).
- Setup repo/package riêng cho `@yourorg/affiliate-sdk`.

### Giai đoạn 1 — MVP gắn trong MoodScanr (3-4 tuần)
- Chưa tách domain riêng, chạy chung Cloud Run hiện có, mount như 1 router.
- Tính năng: đăng ký affiliate (dùng chung login MoodScanr tạm thời), sinh code, tracking click, ghi conversion thủ công qua webhook Stripe (chưa cần outbox hoàn chỉnh, có thể làm đồng bộ trước).
- Ledger cơ bản, admin xem danh sách + duyệt thủ công.
- Payout: hoàn toàn thủ công (admin xem ledger, chuyển khoản tay, đánh dấu paid).
- **Mục tiêu:** kiểm chứng model kinh doanh, chưa tối ưu kỹ thuật.

### Giai đoạn 2 — Tách auth/dashboard affiliate riêng (2-3 tuần)
- Xây login riêng cho affiliate (JWT scope riêng), tách khỏi User model MoodScanr.
- Dashboard affiliate hoàn chỉnh: thống kê click/conversion/hoa hồng, khai báo payout method.
- Thêm buffer window 14 ngày trước khi approve conversion.
- Vẫn deploy chung hạ tầng, nhưng subdomain riêng `affiliate.moodscanr.ai`.

### Giai đoạn 3 — Idempotency, outbox, đa nền tảng hoá (3-4 tuần)
- Thêm `merchantId`/`productId` vào toàn bộ bảng (multi-tenant từ trong ra).
- Implement outbox pattern thật sự ở phía MoodScanr (transaction cùng lúc update subscription).
- Idempotency key đầy đủ cho click + conversion.
- Reconciliation job chạy đêm.
- Đóng gói `@yourorg/affiliate-sdk` version 1.0, publish nội bộ.

### Giai đoạn 4 — Tách hạ tầng, ra domain công ty, onboard sản phẩm thứ 2 (4 tuần)
- Deploy affiliate platform thành service riêng (Cloud Run riêng, DB riêng).
- Chuyển domain sang `affiliate.congty.com`.
- Admin panel: quản lý nhiều merchant, cấu hình hoa hồng theo từng sản phẩm.
- Onboard sản phẩm B bằng SDK — đo thời gian tích hợp thực tế để tối ưu docs/SDK.

### Giai đoạn 5 — Mở rộng & tối ưu (liên tục)
- Payout tự động qua Momo/VNPay hoặc Stripe Transfer (với affiliate ở nước được hỗ trợ).
- Tier hoa hồng theo hiệu suất, hoa hồng lặp lại theo renewal.
- Fraud detection (chặn tự giới thiệu, click bất thường).
- Báo cáo/analytics nâng cao cho cả affiliate và admin.

---

## 6. Rủi ro cần theo dõi

| Rủi ro | Cách giảm thiểu |
|---|---|
| Affiliate tự giới thiệu chính mình | So khớp `externalUserId` người mua với chủ affiliate code |
| Payout VN không tự động hoá được qua Stripe | Thiết kế `PayoutExecutor` là adapter thay được, mặc định thủ công |
| Mất event khi affiliate-core down | Outbox pattern bắt buộc ở product backend |
| Tính đúp hoa hồng khi webhook trùng | Idempotency key theo `eventId`/`clickId`, ledger append-only |
| Refund/chargeback sau khi đã duyệt hoa hồng | Buffer window trước approve + cơ chế revoke ledger |
