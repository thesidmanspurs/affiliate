// "Ports" theo kiến trúc hexagonal: application layer chỉ phụ thuộc các
// interface này, không biết Prisma/Postgres tồn tại. Infrastructure layer
// implement chúng (xem infrastructure/persistence/prisma-repositories.ts).
//
// Khi mang module sang dự án khác dùng MySQL/Mongo, chỉ cần viết 1 bộ
// implementation mới cho các interface bên dưới - domain/application giữ nguyên.

import {
  Affiliate,
  CommissionLedgerEntry,
  Conversion,
  Merchant,
  Payout,
  ReferralClick,
} from './entities';

export const MERCHANT_REPOSITORY = 'MERCHANT_REPOSITORY';
export const AFFILIATE_REPOSITORY = 'AFFILIATE_REPOSITORY';
export const CLICK_REPOSITORY = 'CLICK_REPOSITORY';
export const CONVERSION_REPOSITORY = 'CONVERSION_REPOSITORY';
export const LEDGER_REPOSITORY = 'LEDGER_REPOSITORY';
export const PAYOUT_REPOSITORY = 'PAYOUT_REPOSITORY';

export interface MerchantRepository {
  findByApiKeyHash(apiKeyHash: string): Promise<Merchant | null>;
  findByProductId(productId: string): Promise<Merchant | null>;
}

export interface AffiliateRepository {
  create(data: Omit<Affiliate, 'id'>): Promise<Affiliate>;
  findById(id: string): Promise<Affiliate | null>;
  findByEmail(merchantId: string, email: string): Promise<Affiliate | null>;
  findByCode(code: string): Promise<Affiliate | null>;
  updatePayoutMethod(id: string, payoutMethod: Affiliate['payoutMethod']): Promise<void>;
  submitOnboarding(id: string, data: NonNullable<Affiliate['onboardingData']>): Promise<Affiliate>;
  reviewAffiliate(id: string, status: Affiliate['status'], rejectionReason?: string, reapplyAfter?: Date): Promise<Affiliate>;
  reapply(id: string): Promise<Affiliate>;
}

export interface ClickRepository {
  /** Phải idempotent theo clickId - gọi lại nhiều lần không tạo trùng row. */
  recordClick(click: Omit<ReferralClick, 'id' | 'createdAt'>): Promise<ReferralClick>;
  findByClickId(clickId: string): Promise<ReferralClick | null>;
  countByAffiliate(affiliateId: string): Promise<number>;
}

export interface ConversionRepository {
  /** Phải idempotent theo eventId. */
  recordConversion(conversion: Omit<Conversion, 'id' | 'createdAt'>): Promise<Conversion>;
  findByEventId(eventId: string): Promise<Conversion | null>;
  findApprovableBefore(cutoff: Date): Promise<Conversion[]>;
  markApproved(id: string, approvedAt: Date): Promise<Conversion>;
  listByAffiliate(affiliateId: string): Promise<Conversion[]>;
}

export interface LedgerRepository {
  /** Append-only - KHÔNG được có hàm update amount của 1 entry đã tồn tại. */
  appendEntry(entry: Omit<CommissionLedgerEntry, 'id' | 'createdAt'>): Promise<CommissionLedgerEntry>;
  getBalance(affiliateId: string, status: CommissionLedgerEntry['status']): Promise<number>;
  listUnpaidApproved(affiliateId: string): Promise<CommissionLedgerEntry[]>;
  markPaid(entryIds: string[], payoutId: string): Promise<void>;
}

export interface PayoutRepository {
  create(payout: Omit<Payout, 'id'>): Promise<Payout>;
  listByAffiliate(affiliateId: string): Promise<Payout[]>;
}
