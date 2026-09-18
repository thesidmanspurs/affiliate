# API Reference — affiliate-core

Base URL mặc định: `http://localhost:4100/api`
Swagger UI (đầy đủ schema, thử trực tiếp): `http://localhost:4100/api/docs`

Có 2 kiểu xác thực, dùng cho 2 nhóm gọi khác nhau — **không trộn lẫn**:

| Kiểu | Header | Ai dùng | Endpoint áp dụng |
|---|---|---|---|
| `affiliate-jwt` | `Authorization: Bearer <token>` | Affiliate tự phục vụ (dashboard Next.js) | `/affiliates/me/*`, `/payouts/*` |
| `merchant-api-key` | `x-merchant-api-key: <key>` | Product backend (MoodScanr, sản phẩm B...) gọi server-to-server | `/clicks`, `/conversions` |

`auth/register` và `auth/login` là public, không cần header xác thực.

---

## Auth

### `POST /auth/register`
Affiliate tự đăng ký. Trạng thái mặc định `PENDING_REVIEW` (đổi trong `RegisterAffiliateUseCase` nếu muốn auto-approve).

```json
// Request
{ "merchantId": "uuid-cua-merchant", "email": "a@b.com", "password": "min 8 ký tự" }

// Response 201
{ "id": "...", "code": "K7QX2MP", "status": "PENDING_REVIEW", ... }
```

### `POST /auth/login`
```json
// Request
{ "merchantId": "uuid-cua-merchant", "email": "a@b.com", "password": "..." }

// Response 200
{ "accessToken": "eyJhbGciOi..." }
```

---

## Affiliates (self-service, cần `affiliate-jwt`)

| Method | Path | Mô tả |
|---|---|---|
| GET | `/affiliates/me/stats` | `{ totalConversions, pendingCommission, approvedCommission, paidCommission }` |
| GET | `/affiliates/me/conversions` | Danh sách conversion của affiliate hiện tại |
| PATCH | `/affiliates/me/payout-method` | Body: `{ "type": "bank" \| "momo", "details": {...} }` |

---

## Clicks (cần `merchant-api-key`)

### `POST /clicks`
Ghi nhận 1 lượt click — **idempotent theo `clickId`**, gọi lại nhiều lần (retry mạng) không tạo trùng row.

```json
// Request
{ "clickId": "uuid-sinh-luc-redirect", "affiliateCode": "K7QX2MP", "ipHash": "...", "userAgent": "..." }
```

---

## Conversions (cần `merchant-api-key`)

### `POST /conversions`
Ghi nhận 1 giao dịch — **idempotent theo `eventId`** (dùng `stripeEventId`/`invoiceId` phía product). Nên gọi từ outbox worker, không gọi đồng bộ trong webhook handler (xem `examples/product-integration.ts`).

```json
// Request
{
  "eventId": "evt_stripe_xxx",
  "clickId": "uuid-tu-cookie",       // optional - không có thì conversion không gắn affiliate
  "externalUserId": "user-id-ben-product",
  "orderId": "order-id-ben-product",
  "amount": 990000,                   // đơn vị cent/xu
  "currency": "VND",
  "type": "NEW_PURCHASE"              // hoặc "RENEWAL"
}
```

Conversion luôn vào `PENDING`. Việc chuyển sang `APPROVED` (và ghi ledger) hiện làm qua use-case `ApproveConversionUseCase` — **chưa có controller/cron gọi nó**, xem mục "chưa làm" trong README gốc.

---

## Payouts (cần `affiliate-jwt`)

| Method | Path | Mô tả |
|---|---|---|
| POST | `/payouts/request` | Gom toàn bộ ledger `APPROVED` chưa trả → tạo 1 `Payout` status `REQUESTED`. Admin xử lý tay theo rail phù hợp rồi mới thật sự chuyển tiền. |
| GET | `/payouts` | Lịch sử payout của affiliate hiện tại |

---

## Mã lỗi thường gặp

| HTTP | Khi nào |
|---|---|
| 401 | Thiếu/sai `Authorization` hoặc `x-merchant-api-key` |
| 400 | Validate DTO thất bại, hoặc nghiệp vụ chặn (vd rút tiền khi số dư = 0, duyệt conversion chưa đủ buffer window) |
| 409 | Đăng ký affiliate trùng email trong cùng merchant |
