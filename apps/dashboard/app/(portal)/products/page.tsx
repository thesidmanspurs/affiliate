import { requireAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api-client';
import { ProductsMarketplaceClient } from './client';

export default async function ProductsMarketplacePage() {
  const token = await requireAuth();
  
  let profile = {
    code: 'INNOTEK',
    commissionRate: 0.20,
    status: 'ACTIVE' as const,
    onboardingData: null as any,
  };

  let programs: any[] = [];

  try {
    const [fetchedProfile, fetchedPrograms] = await Promise.all([
      apiFetch<any>('/affiliates/me/profile', token).catch(() => null),
      apiFetch<any[]>('/affiliates/me/programs', token).catch(() => []),
    ]);
    if (fetchedProfile) profile = fetchedProfile;
    if (fetchedPrograms && Array.isArray(fetchedPrograms)) programs = fetchedPrograms;
  } catch (err) {
    console.error('Failed to load profile for products:', err);
  }

  return <ProductsMarketplaceClient profile={profile} initialPrograms={programs} />;
}
