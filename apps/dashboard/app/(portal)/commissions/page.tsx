import { requireAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api-client';
import { CommissionsClient, FinancialSummary, AffiliateProfile } from './client';

export default async function CommissionsPage() {
  const token = await requireAuth();

  let summary: FinancialSummary = {
    availableBalance: 0,
    pendingBuffer: 0,
    totalSettled: 0,
  };

  let profile: AffiliateProfile = {
    id: '',
    email: 'affiliate@innotek.global',
    code: 'INNOTEK',
    status: 'ACTIVE',
    commissionRate: 0.20,
    onboardingData: null,
  };

  let programs: any[] = [];

  try {
    const [fetchedStats, fetchedProfile, fetchedPrograms] = await Promise.all([
      apiFetch<any>('/affiliates/me/stats', token).catch(() => null),
      apiFetch<AffiliateProfile>('/affiliates/me/profile', token).catch(() => null),
      apiFetch<any[]>('/affiliates/me/programs', token).catch(() => []),
    ]);
    if (fetchedStats) {
      summary = {
        availableBalance: fetchedStats.approvedCommission || 0,
        pendingBuffer: fetchedStats.pendingCommission || 0,
        totalSettled: fetchedStats.paidCommission || 0,
      };
    }
    if (fetchedProfile) profile = fetchedProfile;
    if (fetchedPrograms && Array.isArray(fetchedPrograms)) programs = fetchedPrograms;
  } catch (err) {
    console.error('Failed to load commissions data:', err);
  }

  return (
    <CommissionsClient
      initialSummary={summary}
      profile={profile}
      initialCommissions={[]}
      initialPrograms={programs}
    />
  );
}
