import { requireAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api-client';
import { AffiliateNav } from '@/components/affiliate-nav';
import { redirect } from 'next/navigation';

export interface AffiliateNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  unread: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface AffiliateProfile {
  id: string;
  email: string;
  code: string;
  status: string;
  commissionRate: number;
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await requireAuth();
  let profile: AffiliateProfile = {
    id: '',
    email: 'affiliate@innotek.global',
    code: 'INNOTEK',
    status: 'ACTIVE',
    commissionRate: 0.20,
  };
  let notifications: AffiliateNotification[] = [];

  try {
    const [fetchedProfile, fetchedNotifs] = await Promise.all([
      apiFetch<AffiliateProfile>('/affiliates/me/profile', token).catch(() => null),
      apiFetch<AffiliateNotification[]>('/affiliates/me/notifications', token).catch(() => []),
    ]);
    if (fetchedProfile) profile = fetchedProfile;
    if (Array.isArray(fetchedNotifs)) notifications = fetchedNotifs;
  } catch (err) {
    console.error('Failed to fetch profile in layout:', err);
  }

  // Admin accounts strictly manage the platform and do not use the partner dashboard
  if (profile.email.toLowerCase().includes('admin')) {
    redirect('/admin');
  }

  // If user has not completed onboarding, redirect to compliance onboarding wizard
  if (profile.status === 'ONBOARDING_REQUIRED') {
    redirect('/onboarding');
  }

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-[#09090B] selection:bg-black selection:text-white">
      <AffiliateNav
        affiliateCode={profile.code}
        email={profile.email}
        status={profile.status}
        notifications={notifications}
      />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
