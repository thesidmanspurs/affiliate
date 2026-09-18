// Ví dụ MINH HOẠ cách 1 sản phẩm (vd MoodScanr backend - Express/Prisma) gọi
// vào affiliate-core. Đây chính là phần sẽ đóng gói thành @yourorg/affiliate-sdk
// khi có sản phẩm thứ 2 tích hợp - hiện để dạng ví dụ cho dễ đọc.

import { randomUUID } from 'crypto';

const AFFILIATE_API_URL = process.env.AFFILIATE_API_URL!; // http://localhost:4100/api
const AFFILIATE_API_KEY = process.env.AFFILIATE_API_KEY!; // cấp khi tạo Merchant

// 1) Route redirect: GET /r/:code trên chính domain sản phẩm (vd moodscanr.ai)
//    - set cookie first-party TRƯỚC KHI redirect, để không phụ thuộc cross-domain.
export async function handleReferralRedirect(req: any, res: any) {
  const code = req.params.code;
  const clickId = randomUUID();

  await fetch(`${AFFILIATE_API_URL}/clicks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-merchant-api-key': AFFILIATE_API_KEY },
    body: JSON.stringify({ clickId, affiliateCode: code }),
  }).catch((err) => console.error('[affiliate] track click failed', err)); // không chặn redirect nếu lỗi

  res.cookie('aff_click_id', clickId, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: false });
  res.redirect('/');
}

// 2) Outbox writer: gọi trong CÙNG transaction lúc xử lý Stripe webhook thành
//    công, KHÔNG gọi affiliate-core trực tiếp ở đây - chỉ ghi 1 row nội bộ.
export async function writeConversionOutboxEvent(tx: any, params: {
  stripeEventId: string;
  clickIdFromCookie?: string;
  externalUserId: string;
  orderId: string;
  amountCents: number;
  currency: string;
  type: 'NEW_PURCHASE' | 'RENEWAL';
}) {
  await tx.outboxEvent.create({
    data: {
      eventType: 'affiliate.conversion',
      payload: params,
      status: 'PENDING',
    },
  });
}

// 3) Worker nền (chạy định kỳ, hoặc trigger sau mỗi write) đọc outbox và gọi
//    affiliate-core - có retry, dùng eventId làm idempotency key nên gọi lại
//    bao nhiêu lần cũng an toàn.
export async function processOutboxEvent(event: { payload: any }) {
  const p = event.payload;
  await fetch(`${AFFILIATE_API_URL}/conversions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-merchant-api-key': AFFILIATE_API_KEY },
    body: JSON.stringify({
      eventId: p.stripeEventId,
      clickId: p.clickIdFromCookie,
      externalUserId: p.externalUserId,
      orderId: p.orderId,
      amount: p.amountCents,
      currency: p.currency,
      type: p.type,
    }),
  });
  // Nhớ đánh dấu event 'SENT' sau khi response 2xx, và retry có backoff nếu lỗi.
}
