import { Inject, Injectable } from '@nestjs/common';
import {
  CONVERSION_REPOSITORY,
  ConversionRepository,
  CLICK_REPOSITORY,
  ClickRepository,
} from '../../domain/ports';
import { Conversion, ConversionType } from '../../domain/entities';

export interface RecordConversionInput {
  eventId: string; // idempotency key = stripeEventId / invoiceId phía product
  merchantId: string;
  clickId?: string; // clickId đọc từ cookie phía product backend
  externalUserId: string;
  orderId: string;
  amount: number; // cent/xu
  currency: string;
  type: ConversionType;
}

/**
 * Được worker đọc từ outbox của product backend gọi vào (xem ghi chú outbox
 * ở README) - KHÔNG được gọi trực tiếp trong luồng xử lý webhook Stripe đồng bộ,
 * để affiliate-core down cũng không làm rớt webhook thanh toán chính.
 */
@Injectable()
export class RecordConversionUseCase {
  constructor(
    @Inject(CONVERSION_REPOSITORY) private readonly conversions: ConversionRepository,
    @Inject(CLICK_REPOSITORY) private readonly clicks: ClickRepository,
  ) {}

  async execute(input: RecordConversionInput): Promise<Conversion> {
    const existing = await this.conversions.findByEventId(input.eventId);
    if (existing) return existing; // idempotent - webhook gửi trùng vẫn an toàn

    const click = input.clickId ? await this.clicks.findByClickId(input.clickId) : null;

    return this.conversions.recordConversion({
      eventId: input.eventId,
      merchantId: input.merchantId,
      clickId: click?.id,
      affiliateId: click?.affiliateId,
      externalUserId: input.externalUserId,
      orderId: input.orderId,
      amount: input.amount,
      currency: input.currency,
      type: input.type,
      status: 'PENDING', // luôn vào pending, chờ buffer window mới approve
    });
  }
}
