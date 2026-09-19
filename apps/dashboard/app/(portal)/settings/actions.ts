'use server';

import { requireAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';

export async function updateTaxDeclarationAction(data: {
  formType: string;
  taxClassification: string;
  legalName: string;
  businessType: string;
  taxId: string;
  taxResidenceCountry: string;
  vatRegistered?: boolean;
  vatNumber?: string;
  companiesHouseCrn?: string;
  street: string;
  city: string;
  stateProv: string;
  postalCode: string;
  dateOfBirth?: string;
  signerCapacity?: string;
  electronicSignature: string;
}) {
  const token = await requireAuth();

  const payload = {
    tax: {
      formType: data.formType,
      taxForm: data.formType,
      taxClassification: data.taxClassification,
      legalName: data.legalName,
      signedName: data.electronicSignature,
      businessType: data.businessType,
      taxId: data.taxId,
      utrOrNino: data.taxId,
      taxResidenceCountry: data.taxResidenceCountry,
      taxCountry: data.taxResidenceCountry,
      vatRegistered: Boolean(data.vatRegistered),
      vatNumber: data.vatNumber || undefined,
      companiesHouseCrn: data.companiesHouseCrn || undefined,
      address: {
        street: data.street,
        city: data.city,
        state: data.stateProv,
        zip: data.postalCode,
        postalCode: data.postalCode,
        country: data.taxResidenceCountry,
      },
      dateOfBirth: data.dateOfBirth || undefined,
      signerCapacity: data.signerCapacity || 'Individual Beneficial Owner',
      treatyBenefits: data.taxClassification === 'INTERNATIONAL',
      treatyCountry: data.taxClassification === 'INTERNATIONAL' ? data.taxResidenceCountry : undefined,
      treatyArticle: data.taxClassification === 'INTERNATIONAL' ? 'Article 12 (Royalties / Independent Personal Services)' : undefined,
      treatyWithholdingRate: '0%',
      electronicSignature: data.electronicSignature,
      signedAt: new Date().toISOString(),
      certificationAccepted: true,
      certifiedUnderPerjury: true,
    },
  };

  await apiFetch('/affiliates/me/profile', token, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  revalidatePath('/settings');
  revalidatePath('/commissions');
  return { ok: true };
}

export async function updatePayoutRailAction(data: {
  method: 'bank_account' | 'debit_card';
  beneficiaryName: string;
  bankName?: string;
  accountNumberOrIban?: string;
  sortCode?: string;
  swiftBic?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardBrand?: string;
  currency: string;
}) {
  const token = await requireAuth();

  const details: Record<string, string> = {
    beneficiaryName: data.beneficiaryName,
    accountName: data.beneficiaryName,
    bankName: data.bankName || '',
    accountNumber: data.accountNumberOrIban || '',
    sortCode: data.sortCode || '',
    swiftBic: data.swiftBic || '',
    currency: data.currency || 'USD',
    cardNumberLast4: data.cardNumber ? data.cardNumber.replace(/\s+/g, '').slice(-4) : '',
    cardBrand: data.cardBrand || '',
    cardExpiry: data.cardExpiry || '',
  };

  const payoutPayload = {
    payout: {
      method: data.method,
      stripeRail: data.method === 'bank_account' ? 'stripe_payouts_bank' : 'stripe_instant_payouts_card',
      beneficiaryName: data.beneficiaryName,
      accountName: data.beneficiaryName,
      bankName: data.bankName || undefined,
      accountNumberOrIban: data.accountNumberOrIban || undefined,
      accountNumber: data.accountNumberOrIban || undefined,
      sortCode: data.sortCode || undefined,
      routingOrSortCode: data.sortCode || undefined,
      swiftBic: data.swiftBic || undefined,
      routingOrSwift: data.swiftBic || undefined,
      cardNumberLast4: data.cardNumber ? data.cardNumber.replace(/\s+/g, '').slice(-4) : undefined,
      cardBrand: data.cardBrand || undefined,
      cardExpiry: data.cardExpiry || undefined,
      currency: data.currency || 'USD',
    },
  };

  await Promise.all([
    apiFetch('/affiliates/me/payout-method', token, {
      method: 'PATCH',
      body: JSON.stringify({ type: data.method, details }),
    }),
    apiFetch('/affiliates/me/profile', token, {
      method: 'PATCH',
      body: JSON.stringify(payoutPayload),
    }),
  ]);

  revalidatePath('/settings');
  revalidatePath('/commissions');
  return { ok: true };
}

export async function updatePartnerProfileAction(data: {
  companyName: string;
  companyLogoUrl?: string;
  primaryUrl: string;
  niche?: string;
  promotionalStrategy?: string;
}) {
  const token = await requireAuth();

  await apiFetch('/affiliates/me/profile', token, {
    method: 'PATCH',
    body: JSON.stringify({
      promotional: {
        companyName: data.companyName,
        companyLogoUrl: data.companyLogoUrl,
        primaryUrl: data.primaryUrl,
        channelUrl: data.primaryUrl,
        niche: data.niche,
        promotionalStrategy: data.promotionalStrategy,
      },
    }),
  });

  revalidatePath('/settings');
  return { ok: true };
}
