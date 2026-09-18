'use server';

import { requireAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api-client';
import { redirect } from 'next/navigation';

export async function reapplyAction(): Promise<void> {
  const token = await requireAuth();
  try {
    await apiFetch('/affiliates/me/reapply', token, {
      method: 'POST',
    });
  } catch (err) {
    console.error('Re-apply failed:', err);
  }
  redirect('/onboarding');
}
