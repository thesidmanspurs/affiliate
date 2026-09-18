'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { clearAffiliateToken, requireAuth } from '@/lib/auth';

export async function logoutAction() {
  await clearAffiliateToken();
  redirect('/login');
}

export async function requestPayoutAction(_formData?: FormData): Promise<void> {
  const token = await requireAuth();
  try {
    await apiFetch('/payouts/request', token, { method: 'POST' });
  } catch (err) {
    console.error('Payout request failed:', err);
  }
  revalidatePath('/payouts');
}
