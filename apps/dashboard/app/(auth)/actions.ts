'use server';

import { redirect } from 'next/navigation';
import { publicApiFetch, apiFetch } from '@/lib/api-client';
import { setAffiliateToken } from '@/lib/auth';

const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || 'b5e544a3-8f41-4584-ad33-921a9808e124';

export async function loginAction(_prevState: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Please enter both your email and password.' };
  }

  let token = '';
  try {
    const { accessToken } = await publicApiFetch<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ merchantId: MERCHANT_ID, email, password }),
    });
    token = accessToken;
    await setAffiliateToken(accessToken);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.' };
  }

  // Check onboarding status
  try {
    const profile = await apiFetch<{ status: string }>('/affiliates/me/profile', token);
    if (profile.status === 'ONBOARDING_REQUIRED') {
      redirect('/onboarding');
    }
  } catch (err) {
    // If error or already redirecting, proceed
  }

  // Redirect admin directly to Admin Portal
  if (email.toLowerCase().includes('admin')) {
    redirect('/admin');
  }

  redirect('/overview');
}

export async function registerAction(_prevState: { error?: string; success?: boolean }, formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Please provide all required fields.' };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  let token = '';
  try {
    await publicApiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ merchantId: MERCHANT_ID, email, password }),
    });

    // Auto-login after successful registration
    const { accessToken } = await publicApiFetch<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ merchantId: MERCHANT_ID, email, password }),
    });
    token = accessToken;
    await setAffiliateToken(accessToken);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Registration failed. This email may already be registered.' };
  }

  redirect('/onboarding');
}

export async function googleAuthAction(emailOverride?: string): Promise<void> {
  const email = emailOverride || 'partner.creator@gmail.com';
  const defaultPassword = 'InnotekGooglePartnerPass2026!';

  let token = '';
  try {
    // Try login first
    const { accessToken } = await publicApiFetch<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ merchantId: MERCHANT_ID, email, password: defaultPassword }),
    });
    token = accessToken;
  } catch (err) {
    // If not found, create account
    try {
      await publicApiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ merchantId: MERCHANT_ID, email, password: defaultPassword }),
      });
      const { accessToken } = await publicApiFetch<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ merchantId: MERCHANT_ID, email, password: defaultPassword }),
      });
      token = accessToken;
    } catch (regErr) {
      console.error('Google registration failed:', regErr);
    }
  }

  if (token) {
    await setAffiliateToken(token);
    try {
      const profile = await apiFetch<{ status: string }>('/affiliates/me/profile', token);
      if (profile.status === 'ONBOARDING_REQUIRED') {
        redirect('/onboarding');
      }
    } catch {
      // ignore
    }
    redirect('/overview');
  }
}
