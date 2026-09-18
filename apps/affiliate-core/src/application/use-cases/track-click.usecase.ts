import { Inject, Injectable } from '@nestjs/common';
import { CLICK_REPOSITORY, ClickRepository, AFFILIATE_REPOSITORY, AffiliateRepository } from '../../domain/ports';
import { ReferralClick } from '../../domain/entities';

export interface TrackClickInput {
  clickId: string; // idempotency key - sinh 1 lần lúc redirect ở product backend
  merchantId: string;
  affiliateCode: string;
  ipHash?: string;
  userAgent?: string;
}

@Injectable()
export class TrackClickUseCase {
  constructor(
    @Inject(CLICK_REPOSITORY) private readonly clicks: ClickRepository,
    @Inject(AFFILIATE_REPOSITORY) private readonly affiliates: AffiliateRepository,
  ) {}

  async execute(input: TrackClickInput): Promise<ReferralClick> {
    // Idempotent: gọi lại với cùng clickId (network retry) phải trả về đúng row cũ.
    const existing = await this.clicks.findByClickId(input.clickId);
    if (existing) return existing;

    const affiliate = await this.affiliates.findByCode(input.affiliateCode);

    return this.clicks.recordClick({
      clickId: input.clickId,
      merchantId: input.merchantId,
      affiliateCode: input.affiliateCode,
      affiliateId: affiliate?.id,
    });
  }
}
