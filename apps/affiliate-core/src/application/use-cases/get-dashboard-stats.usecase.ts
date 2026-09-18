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

export interface ProductStat {
  productId: string;
  productName: string;
  conversionsCount: number;
  sourcedRevenue: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  totalCommission: number;
  status: 'ACTIVE' | 'PENDING_REVIEW' | 'AVAILABLE';
  enrolledAt?: string;
  strategyNotes?: string;
}

export interface DashboardStats {
  totalClicks: number;
  totalConversions: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  sourcedRevenue: number;
  byProduct: Record<string, ProductStat>;
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

    const defaultRate = affiliate?.commissionRate ?? 0.20;
    const programs = (affiliate?.onboardingData as any)?.programs || {};

    const byProduct: Record<string, ProductStat> = {};

    // Group conversions by product
    for (const c of list) {
      const prodId = c.merchant?.productId || 'moodscanr';
      const prodName = c.merchant?.name || prodId;
      const rate = c.merchant?.defaultCommissionRate ?? defaultRate;
      const commission = Math.round(c.amount * rate);

      if (!byProduct[prodId]) {
        const progEnrollment = programs[prodId];
        byProduct[prodId] = {
          productId: prodId,
          productName: prodName,
          conversionsCount: 0,
          sourcedRevenue: 0,
          pendingCommission: 0,
          approvedCommission: 0,
          paidCommission: 0,
          totalCommission: 0,
          status: progEnrollment?.status || (affiliate?.status === 'ACTIVE' ? 'ACTIVE' : 'AVAILABLE'),
          enrolledAt: progEnrollment?.enrolledAt,
          strategyNotes: progEnrollment?.strategyNotes,
        };
      }

      byProduct[prodId].conversionsCount += 1;
      byProduct[prodId].sourcedRevenue += c.amount;
      if (c.status === 'PENDING') {
        byProduct[prodId].pendingCommission += commission;
      } else if (c.status === 'APPROVED') {
        byProduct[prodId].approvedCommission += commission;
      }
      byProduct[prodId].totalCommission += commission;
    }

    // Ensure all enrolled programs from onboardingData are also represented in byProduct
    for (const [prodId, prog] of Object.entries<any>(programs)) {
      if (!byProduct[prodId]) {
        byProduct[prodId] = {
          productId: prodId,
          productName: prodId,
          conversionsCount: 0,
          sourcedRevenue: 0,
          pendingCommission: 0,
          approvedCommission: 0,
          paidCommission: 0,
          totalCommission: 0,
          status: prog.status || 'ACTIVE',
          enrolledAt: prog.enrolledAt,
          strategyNotes: prog.strategyNotes,
        };
      }
    }

    const sourcedRevenue = list.reduce((sum, c) => sum + c.amount, 0);
    const pendingCommission = list
      .filter((c) => c.status === 'PENDING')
      .reduce((sum, c) => {
        const rate = c.merchant?.defaultCommissionRate ?? defaultRate;
        return sum + Math.round(c.amount * rate);
      }, 0);

    return {
      totalClicks: clicksCount,
      totalConversions: list.length,
      pendingCommission,
      approvedCommission: approved,
      paidCommission: paid,
      sourcedRevenue,
      byProduct,
    };
  }
}
