import { requireAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api-client';
import { SettingsClient, AffiliateProfile } from './client';

export default async function SettingsPage() {
  const token = await requireAuth();

  let profile: AffiliateProfile = {
    id: '',
    email: 'affiliate@innotek.global',
    code: 'INNOTEK',
    status: 'ACTIVE',
    commissionRate: 0.20,
    payoutMethod: null,
    onboardingData: null,
  };

  try {
    const fetched = await apiFetch<AffiliateProfile>('/affiliates/me/profile', token);
    if (fetched) profile = fetched;
  } catch (err) {
    console.error('Failed to load profile in settings:', err);
  }

  return <SettingsClient profile={profile} />;
}
