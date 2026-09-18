// Lớp "adapter" duy nhất biết Prisma tồn tại. Toàn bộ phần còn lại của app
// (domain + application + controllers) chỉ nói chuyện qua các interface
// trong domain/ports.ts. Đổi ORM/DB khác thì chỉ sửa file này.

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import {
  AffiliateRepository,
  ClickRepository,
  ConversionRepository,
  LedgerRepository,
  MerchantRepository,
  PayoutRepository,
} from '../../domain/ports';
import {
  Affiliate,
  CommissionLedgerEntry,
  Conversion,
  Merchant,
  Payout,
  ReferralClick,
} from '../../domain/entities';

/** Postgres báo lỗi unique constraint bằng code P2002 - dùng để bắt các
 * trường hợp idempotency (clickId/eventId trùng do retry) một cách gọn gàng. */
function isUniqueConstraintError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
}

@Injectable()
export class PrismaMerchantRepository implements MerchantRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByApiKeyHash(apiKeyHash: string): Promise<Merchant | null> {
    return this.prisma.merchant.findFirst({ where: { apiKeyHash, isActive: true } });
  }

  findByProductId(productId: string): Promise<Merchant | null> {
    return this.prisma.merchant.findUnique({ where: { productId } });
  }
}

@Injectable()
export class PrismaAffiliateRepository implements AffiliateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Affiliate, 'id'>): Promise<Affiliate> {
    const res = await this.prisma.affiliate.create({ data: data as Prisma.AffiliateUncheckedCreateInput });
    return res as unknown as Affiliate;
  }
  async findById(id: string): Promise<Affiliate | null> {
    const res = await this.prisma.affiliate.findUnique({ where: { id } });
    return res ? (res as unknown as Affiliate) : null;
  }
  async findByEmail(merchantId: string, email: string): Promise<Affiliate | null> {
    const res = await this.prisma.affiliate.findUnique({ where: { merchantId_email: { merchantId, email } } });
    return res ? (res as unknown as Affiliate) : null;
  }
  async findByCode(code: string): Promise<Affiliate | null> {
    const res = await this.prisma.affiliate.findUnique({ where: { code } });
    return res ? (res as unknown as Affiliate) : null;
  }
  async updatePayoutMethod(id: string, payoutMethod: Affiliate['payoutMethod']): Promise<void> {
    await this.prisma.affiliate.update({ where: { id }, data: { payoutMethod: payoutMethod as Prisma.InputJsonValue } });
  }
  async submitOnboarding(id: string, data: NonNullable<Affiliate['onboardingData']>): Promise<Affiliate> {
    const res = await this.prisma.affiliate.update({
      where: { id },
      data: {
        onboardingData: data as Prisma.InputJsonValue,
        payoutMethod: (data.payout ? data.payout : undefined) as Prisma.InputJsonValue | undefined,
        status: 'PENDING_REVIEW',
        submittedAt: new Date(),
        rejectionReason: null,
      },
    });
    return res as unknown as Affiliate;
  }
  async reviewAffiliate(id: string, status: Affiliate['status'], rejectionReason?: string, reapplyAfter?: Date): Promise<Affiliate> {
    const res = await this.prisma.affiliate.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
        rejectionReason: rejectionReason ?? null,
        reapplyAfter: reapplyAfter ?? null,
      },
    });
    return res as unknown as Affiliate;
  }
  async reapply(id: string): Promise<Affiliate> {
    const res = await this.prisma.affiliate.update({
      where: { id },
      data: {
        status: 'ONBOARDING_REQUIRED',
        reapplyAfter: null,
      },
    });
    return res as unknown as Affiliate;
  }
  async updateProfile(id: string, data: { tax?: any; promotional?: any; payout?: any; payoutMethod?: any }): Promise<Affiliate> {
    const existing = await this.prisma.affiliate.findUnique({ where: { id } });
    const existingOnboarding = (existing?.onboardingData as any) || {};
    const updatedOnboarding = {
      ...existingOnboarding,
      ...(data.tax ? { tax: { ...(existingOnboarding.tax || {}), ...data.tax } } : {}),
      ...(data.promotional ? { promotional: { ...(existingOnboarding.promotional || {}), ...data.promotional } } : {}),
      ...(data.payout ? { payout: { ...(existingOnboarding.payout || {}), ...data.payout } } : {}),
    };
    const res = await this.prisma.affiliate.update({
      where: { id },
      data: {
        onboardingData: updatedOnboarding as Prisma.InputJsonValue,
        ...(data.payoutMethod ? { payoutMethod: data.payoutMethod as Prisma.InputJsonValue } : {}),
      },
    });
    return res as unknown as Affiliate;
  }

  async enrollProgram(affiliateId: string, productId: string, strategyNotes?: string): Promise<Affiliate> {
    const existing = await this.prisma.affiliate.findUnique({ where: { id: affiliateId } });
    const existingOnboarding = (existing?.onboardingData as any) || {};
    const existingPrograms = existingOnboarding.programs || {};

    const tax = existingOnboarding.tax || {};
    const promotional = existingOnboarding.promotional || {};

    const programEntry = {
      productId,
      status: 'ACTIVE',
      enrolledAt: new Date().toISOString(),
      strategyNotes: strategyNotes || promotional.promotionalStrategy || promotional.strategyNotes || '',
      linkedTaxForm: tax.formType || tax.taxForm || 'W-8BEN',
      linkedLegalName: tax.legalName || tax.signedName || '',
      linkedTaxId: tax.taxId ? (tax.taxId.length > 4 ? `***${tax.taxId.slice(-4)}` : tax.taxId) : 'CERTIFIED',
      linkedTaxCountry: tax.taxCountry || tax.taxResidenceCountry || tax.country || 'GB',
      linkedChannels: promotional.channelTypes || promotional.channels || ['Direct Referral / Website'],
      linkedPrimaryUrl: promotional.primaryUrl || promotional.channelUrl || '',
    };

    const updatedOnboarding = {
      ...existingOnboarding,
      programs: {
        ...existingPrograms,
        [productId]: programEntry,
      },
    };

    const res = await this.prisma.affiliate.update({
      where: { id: affiliateId },
      data: {
        onboardingData: updatedOnboarding as Prisma.InputJsonValue,
      },
    });
    return res as unknown as Affiliate;
  }
}

@Injectable()
export class PrismaClickRepository implements ClickRepository {
  constructor(private readonly prisma: PrismaService) {}

  async recordClick(click: Omit<ReferralClick, 'id' | 'createdAt'>): Promise<ReferralClick> {
    try {
      return await this.prisma.referralClick.create({ data: click });
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        // Race: 2 request cùng clickId gần như đồng thời - lấy row đã tồn tại.
        const existing = await this.findByClickId(click.clickId);
        if (existing) return existing;
      }
      throw err;
    }
  }

  findByClickId(clickId: string): Promise<ReferralClick | null> {
    return this.prisma.referralClick.findUnique({ where: { clickId } });
  }

  countByAffiliate(affiliateId: string): Promise<number> {
    return this.prisma.referralClick.count({ where: { affiliateId } });
  }
}

@Injectable()
export class PrismaConversionRepository implements ConversionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async recordConversion(conversion: Omit<Conversion, 'id' | 'createdAt'>): Promise<Conversion> {
    try {
      return await this.prisma.conversion.create({ data: conversion as Prisma.ConversionUncheckedCreateInput });
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        const existing = await this.findByEventId(conversion.eventId);
        if (existing) return existing;
      }
      throw err;
    }
  }

  findByEventId(eventId: string): Promise<Conversion | null> {
    return this.prisma.conversion.findUnique({ where: { eventId } });
  }

  findApprovableBefore(cutoff: Date): Promise<Conversion[]> {
    return this.prisma.conversion.findMany({ where: { status: 'PENDING', createdAt: { lte: cutoff } } });
  }

  markApproved(id: string, approvedAt: Date): Promise<Conversion> {
    return this.prisma.conversion.update({ where: { id }, data: { status: 'APPROVED', approvedAt } });
  }

  async listByAffiliate(affiliateId: string): Promise<Conversion[]> {
    const res = await this.prisma.conversion.findMany({
      where: { affiliateId },
      include: {
        merchant: {
          select: { id: true, productId: true, name: true, defaultCommissionRate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res as unknown as Conversion[];
  }
}

@Injectable()
export class PrismaLedgerRepository implements LedgerRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Append-only theo thiết kế: không có hàm update() nào ở repository này.
  appendEntry(entry: Omit<CommissionLedgerEntry, 'id' | 'createdAt'>): Promise<CommissionLedgerEntry> {
    return this.prisma.commissionLedger.create({ data: entry as Prisma.CommissionLedgerUncheckedCreateInput });
  }

  async getBalance(affiliateId: string, status: CommissionLedgerEntry['status']): Promise<number> {
    const result = await this.prisma.commissionLedger.aggregate({
      where: { affiliateId, status },
      _sum: { amount: true },
    });
    return result._sum.amount ?? 0;
  }

  listUnpaidApproved(affiliateId: string): Promise<CommissionLedgerEntry[]> {
    return this.prisma.commissionLedger.findMany({ where: { affiliateId, status: 'APPROVED' } });
  }

  async markPaid(entryIds: string[], payoutId: string): Promise<void> {
    await this.prisma.commissionLedger.updateMany({
      where: { id: { in: entryIds } },
      data: { status: 'PAID', payoutId },
    });
  }
}

@Injectable()
export class PrismaPayoutRepository implements PayoutRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(payout: Omit<Payout, 'id'>): Promise<Payout> {
    return this.prisma.payout.create({ data: payout as Prisma.PayoutUncheckedCreateInput });
  }

  listByAffiliate(affiliateId: string): Promise<Payout[]> {
    return this.prisma.payout.findMany({ where: { affiliateId }, orderBy: { createdAt: 'desc' } });
  }
}
