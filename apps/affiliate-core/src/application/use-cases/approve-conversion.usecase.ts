import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  CONVERSION_REPOSITORY,
  ConversionRepository,
  AFFILIATE_REPOSITORY,
  AffiliateRepository,
  LEDGER_REPOSITORY,
  LedgerRepository,
} from '../../domain/ports';
import { isApprovable } from '../../domain/entities';
import { calculateCommission } from '../../domain/services/commission-calculator';

/**
 * Gọi bởi: (a) admin bấm duyệt tay, hoặc (b) 1 cron job chạy mỗi ngày quét
 * các conversion đã qua buffer window (xem ConversionRepository.findApprovableBefore).
 * Ghi thêm 1 dòng ledger append-only - KHÔNG update số dư ở đâu khác.
 */
@Injectable()
export class ApproveConversionUseCase {
  constructor(
    @Inject(CONVERSION_REPOSITORY) private readonly conversions: ConversionRepository,
    @Inject(AFFILIATE_REPOSITORY) private readonly affiliates: AffiliateRepository,
    @Inject(LEDGER_REPOSITORY) private readonly ledger: LedgerRepository,
  ) {}

  async execute(conversionId: string): Promise<void> {
    const all = await this.conversions.findApprovableBefore(new Date());
    const conversion = all.find((c) => c.id === conversionId);
    if (!conversion) throw new BadRequestException('Conversion does not exist or has not passed clearance buffer window.');
    if (!conversion.affiliateId) throw new BadRequestException('Conversion is not associated with any affiliate partner.');
    if (!isApprovable(conversion)) throw new BadRequestException('Conversion clearance buffer period is still active.');

    const affiliate = await this.affiliates.findById(conversion.affiliateId);
    if (!affiliate) throw new BadRequestException('Affiliate partner not found.');

    const approved = await this.conversions.markApproved(conversion.id, new Date());
    const commissionAmount = calculateCommission(approved.amount, affiliate.commissionRate);

    await this.ledger.appendEntry({
      affiliateId: affiliate.id,
      conversionId: approved.id,
      amount: commissionAmount,
      currency: approved.currency,
      status: 'APPROVED',
    });
  }
}
