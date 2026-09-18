import { requireAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api-client';
import { ProductsMarketplaceClient } from './client';

export default async function ProductsMarketplacePage() {
  const token = await requireAuth();
  
  let profile = {
    code: 'INNOTEK',
    commissionRate: 0.20,
    status: 'ACTIVE' as const,
  };

  try {
    const fetched = await apiFetch<any>('/affiliates/me/profile', token);
    if (fetched) profile = fetched;
  } catch (err) {
    console.error('Failed to load profile for products:', err);
  }

  return <ProductsMarketplaceClient profile={profile} />;
}
