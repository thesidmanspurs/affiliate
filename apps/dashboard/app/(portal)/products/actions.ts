'use server';

import { requireAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';

export async function enrollProgramAction(productId: string, strategyNotes?: string) {
  const token = await requireAuth();

  try {
    const res = await apiFetch<any>(`/affiliates/me/programs/${productId}/apply`, token, {
      method: 'POST',
      body: JSON.stringify({ strategyNotes }),
    });

    revalidatePath('/products');
    revalidatePath('/overview');
    revalidatePath('/commissions');
    return { ok: true, data: res };
  } catch (err: any) {
    console.error('Failed to enroll program:', err);
    return {
      ok: false,
      error: err.message || 'Failed to submit program enrollment',
    };
  }
}
