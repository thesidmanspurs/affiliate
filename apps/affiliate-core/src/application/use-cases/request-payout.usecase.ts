import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { LEDGER_REPOSITORY, LedgerRepository, PAYOUT_REPOSITORY, PayoutRepository, AFFILIATE_REPOSITORY, AffiliateRepository } from '../../domain/ports';
import { Payout } from '../../domain/entities';

/**
 * Chỉ TẠO yêu cầu payout, không tự động chuyển tiền - việc chi trả thật sự
 * do 1 PayoutExecutor riêng xử lý theo rail phù hợp (bank thủ công, Momo,
 * Stripe Transfer...) tuỳ nước affiliate đang ở, admin xác nhận rồi mới
 * gọi ledger.markPaid(). Tách bước này ra để không phụ thuộc cứng 1 rail.
 */
@Injectable()
export class RequestPayoutUseCase {
  constructor(
    @Inject(LEDGER_REPOSITORY) private readonly ledger: LedgerRepository,
    @Inject(PAYOUT_REPOSITORY) private readonly payouts: PayoutRepository,
    @Inject(AFFILIATE_REPOSITORY) private readonly affiliates: AffiliateRepository,
  ) {}

  async execute(affiliateId: string): Promise<Payout> {
    const affiliate = await this.affiliates.findById(affiliateId);
    if (!affiliate) throw new BadRequestException('Affiliate partner not found.');
    if (!affiliate.payoutMethod) throw new BadRequestException('No payout beneficiary rail configured.');

    const unpaid = await this.ledger.listUnpaidApproved(affiliateId);
    const total = unpaid.reduce((sum, e) => sum + e.amount, 0);
    if (total <= 0) throw new BadRequestException('No approved commissions are currently available for withdrawal.');

    const payoutMethodObj = affiliate.payoutMethod as any;
    const methodStr = payoutMethodObj?.method || payoutMethodObj?.type || 'bank_manual';
    const method = methodStr === 'bank' || methodStr === 'bank_wire' ? 'bank_manual' : methodStr;

    const payout = await this.payouts.create({
      affiliateId,
      amount: total,
      currency: unpaid[0].currency,
      method,
      status: 'REQUESTED',
    });

    await this.ledger.markPaid(unpaid.map((e) => e.id), payout.id);
    return payout;
  }
}
