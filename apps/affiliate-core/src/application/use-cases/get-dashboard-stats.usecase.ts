import { Inject, Injectable } from '@nestjs/common';
import {
  CLICK_REPOSITORY,
  ClickRepository,
  CONVERSION_REPOSITORY,
  ConversionRepository,
  LEDGER_REPOSITORY,
  LedgerRepository,
  AFFILIATE_REPOSITORY,
  AffiliateRepository,
} from '../../domain/ports';

export interface DashboardStats {
  totalClicks: number;
  totalConversions: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  sourcedRevenue: number;
}

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject(CLICK_REPOSITORY) private readonly clicks: ClickRepository,
    @Inject(CONVERSION_REPOSITORY) private readonly conversions: ConversionRepository,
    @Inject(LEDGER_REPOSITORY) private readonly ledger: LedgerRepository,
    @Inject(AFFILIATE_REPOSITORY) private readonly affiliates: AffiliateRepository,
  ) {}

  async execute(affiliateId: string): Promise<DashboardStats> {
    const [affiliate, list, approved, paid, clicksCount] = await Promise.all([
      this.affiliates.findById(affiliateId),
      this.conversions.listByAffiliate(affiliateId),
      this.ledger.getBalance(affiliateId, 'APPROVED'),
      this.ledger.getBalance(affiliateId, 'PAID'),
      this.clicks.countByAffiliate(affiliateId),
    ]);

    const rate = affiliate?.commissionRate ?? 0.20;
    const sourcedRevenue = list.reduce((sum, c) => sum + c.amount, 0);
    const pendingCommission = list
      .filter((c) => c.status === 'PENDING')
      .reduce((sum, c) => sum + Math.round(c.amount * rate), 0);

    return {
      totalClicks: clicksCount,
      totalConversions: list.length,
      pendingCommission,
      approvedCommission: approved,
      paidCommission: paid,
      sourcedRevenue,
    };
  }
}
