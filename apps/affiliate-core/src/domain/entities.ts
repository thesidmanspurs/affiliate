// Domain layer: chỉ chứa kiểu dữ liệu + quy tắc nghiệp vụ thuần.
// KHÔNG import bất cứ thứ gì từ NestJS, Prisma, Express ở đây - đây là phần
// sẽ được mang nguyên sang dự án khác mà không phải sửa gì cả.

export type AffiliateStatus = 'ONBOARDING_REQUIRED' | 'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
export type ConversionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ConversionType = 'NEW_PURCHASE' | 'RENEWAL';
export type LedgerStatus = 'PENDING' | 'APPROVED' | 'PAID';
export type PayoutStatus = 'REQUESTED' | 'PROCESSING' | 'PAID' | 'FAILED';

export interface PromotionalData {
  channelTypes: string[];
  primaryUrl: string;
  monthlyReach: string;
  targetRegions: string[];
  niche: string;
  promotionalStrategy: string;
  ftcComplianceAccepted: boolean;
  antiSpamAccepted: boolean;
  termsAccepted: boolean;
}

export interface TaxData {
  taxClassification: 'US_PERSON' | 'NON_US_INDIVIDUAL' | 'NON_US_ENTITY';
  taxForm: 'W-9' | 'W-8BEN' | 'W-8BEN-E';
  legalName: string;
  businessType: string;
  taxId: string; // SSN / EIN / Foreign TIN
  taxResidenceCountry: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  treatyBenefits: boolean;
  treatyCountry?: string;
  certificationAccepted: boolean;
  electronicSignature: string;
  signedAt: string;
}

export interface PayoutData {
  method: 'bank_wire' | 'paypal' | 'wise_payoneer' | 'crypto_usdt';
  beneficiaryName: string;
  bankName?: string;
  accountNumberOrIban?: string;
  swiftBic?: string;
  routingOrSortCode?: string;
  paypalEmail?: string;
  wiseEmailOrPayoneerId?: string;
  cryptoWalletAddress?: string;
  cryptoNetwork?: string;
  currency: string;
}

export interface OnboardingData {
  promotional?: PromotionalData;
  tax?: TaxData;
  payout?: PayoutData;
}

export interface Merchant {
  id: string;
  productId: string;
  name: string;
  apiKeyHash: string;
  isActive: boolean;
}

export interface Affiliate {
  id: string;
  merchantId: string;
  email: string;
  passwordHash: string;
  code: string;
  status: AffiliateStatus;
  commissionRate: number; // 0.2 = 20%
  payoutMethod?: PayoutData | { type: string; details: Record<string, string> } | null;
  onboardingData?: OnboardingData | null;
  submittedAt?: Date | null;
  reviewedAt?: Date | null;
  rejectionReason?: string | null;
  reapplyAfter?: Date | null;
  createdAt?: Date;
}

export interface ReferralClick {
  id: string;
  clickId: string;
  merchantId: string;
  affiliateCode: string;
  affiliateId?: string | null;
  createdAt: Date;
}

export interface Conversion {
  id: string;
  eventId: string;
  merchantId: string;
  clickId?: string | null;
  affiliateId?: string | null;
  externalUserId: string;
  orderId: string;
  amount: number; // cent/xu
  currency: string;
  type: ConversionType;
  status: ConversionStatus;
  approvedAt?: Date | null;
  createdAt: Date;
}

export interface CommissionLedgerEntry {
  id: string;
  affiliateId: string;
  conversionId: string;
  amount: number;
  currency: string;
  status: LedgerStatus;
  payoutId?: string | null;
  createdAt: Date;
}

export interface Payout {
  id: string;
  affiliateId: string;
  amount: number;
  currency: string;
  method: string;
  status: PayoutStatus;
}

/** Số ngày giữ conversion ở trạng thái PENDING trước khi có thể duyệt,
 * để trừ hao refund/chargeback. Đặt ở domain vì đây là quy tắc nghiệp vụ,
 * không phải chi tiết kỹ thuật. */
export const APPROVAL_BUFFER_DAYS = 14;

export function isApprovable(conversion: Conversion, now: Date = new Date()): boolean {
  if (conversion.status !== 'PENDING') return false;
  const bufferMs = APPROVAL_BUFFER_DAYS * 24 * 60 * 60 * 1000;
  return now.getTime() - conversion.createdAt.getTime() >= bufferMs;
}
