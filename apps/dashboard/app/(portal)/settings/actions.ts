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
  electronicSignature: string;
}) {
  const token = await requireAuth();

  const payload = {
    tax: {
      formType: data.formType,
      taxClassification: data.taxClassification,
      legalName: data.legalName,
      businessType: data.businessType,
      taxId: data.taxId,
      utrOrNino: data.taxId,
      taxResidenceCountry: data.taxResidenceCountry,
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
  type: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode?: string;
  currency?: string;
}) {
  const token = await requireAuth();

  const details = {
    bankName: data.bankName,
    accountName: data.accountName,
    accountNumber: data.accountNumber,
    sortCode: data.sortCode || '',
    currency: data.currency || 'USD',
  };

  await Promise.all([
    apiFetch('/affiliates/me/payout-method', token, {
      method: 'PATCH',
      body: JSON.stringify({ type: data.type, details }),
    }),
    apiFetch('/affiliates/me/profile', token, {
      method: 'PATCH',
      body: JSON.stringify({
        payout: {
          method: data.type,
          beneficiaryName: data.accountName,
          bankName: data.bankName,
          accountNumberOrIban: data.accountNumber,
          sortCode: data.sortCode,
          currency: data.currency || 'USD',
        },
      }),
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
