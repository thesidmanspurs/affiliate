import { requireAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api-client';
import Link from 'next/link';
import {
  ShieldCheck,
  ExternalLink,
  Filter,
  Star,
  Mail,
  ChevronDown,
  Rocket,
} from 'lucide-react';
import { reapplyAction } from '../reapply-action';
import { PerformanceChart } from '@/components/performance-chart';

interface DashboardStats {
  totalClicks?: number;
  totalConversions: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  sourcedRevenue?: number;
}

interface AffiliateProfile {
  id?: string;
  code: string;
  commissionRate: number;
  status?: 'ONBOARDING_REQUIRED' | 'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  email?: string;
  onboardingData?: any;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  reapplyAfter?: string;
}

const PRODUCTS_CATALOG = [
  {
    name: 'MoodScanr AI',
    category: 'Video & Sentiment AI',
    rate: '20% Rec.',
    url: 'https://moodscanr.ai',
    logo: '/logos/moodscanr.png',
    badge: 'Popular',
  },
  {
    name: 'Headshoot AI',
    category: 'Generative 4K Studio',
    rate: '20% Per Sale',
    url: 'https://headshot.innotek.global',
    logo: '/logos/headshot.png',
    badge: 'Top Payout',
  },
  {
    name: 'HalalScanr',
    category: 'Dietary & Food OCR',
    rate: '25% Rec.',
    url: 'https://halalscanr.innotek.global',
    logo: '/logos/halalscanr.png',
    badge: 'High Retention',
  },
  {
    name: 'FanScanr Sports',
    category: 'Sports & Media AI',
    rate: '20% Rec.',
    url: 'https://ftracker.innotek.global',
    logo: '/logos/fanscanr.png',
    badge: 'Trending',
  },
  {
    name: 'TalentScanr AI',
    category: 'HR Tech & Enterprise ATS',
    rate: '20% Rec.',
    url: 'https://talent.innotek.global',
    logo: '/logos/talentscanr.png',
    badge: 'Enterprise',
  },
  {
    name: 'CallScanr',
    category: 'Voice AI & Telephony',
    rate: '15% Rec.',
    url: 'https://voice.innotek.global',
    logo: '/logos/callscanr.png',
    badge: 'Voice Agent',
  },
  {
    name: 'AQIScanr AI',
    category: 'Climate & CleanTech',
    rate: '20% Rec.',
    url: 'https://aqiscanr.innotek.global',
    logo: '/logos/aqiscanr.svg',
    badge: 'CleanTech',
  },
];

export default async function OverviewPage() {
  const token = await requireAuth();

  let stats: DashboardStats = {
    totalClicks: 0,
    totalConversions: 0,
    pendingCommission: 0,
    approvedCommission: 0,
    paidCommission: 0,
    sourcedRevenue: 0,
  };

  let profile: AffiliateProfile = {
    code: 'INNOTEK',
    commissionRate: 0.20,
    status: 'ACTIVE',
  };

  try {
    const [fetchedStats, fetchedProfile] = await Promise.all([
      apiFetch<DashboardStats>('/affiliates/me/stats', token).catch(() => null),
      apiFetch<AffiliateProfile>('/affiliates/me/profile', token).catch(() => null),
    ]);
    if (fetchedStats) stats = fetchedStats;
    if (fetchedProfile) profile = fetchedProfile;
  } catch (err) {
    console.error('Failed to load stats:', err);
  }

  const isActive = profile.status === 'ACTIVE';
  const isPending = profile.status === 'PENDING_REVIEW';
  const isRejected = profile.status === 'REJECTED';

  // Cooldown calculation
  const cooldownEnd = profile.reapplyAfter ? new Date(profile.reapplyAfter) : null;
  const now = new Date();
  const isCooldownActive = Boolean(cooldownEnd && cooldownEnd > now);
  const daysRemaining = cooldownEnd ? Math.max(1, Math.ceil((cooldownEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="space-y-4 text-[#09090B] pb-16 max-w-6xl mx-auto font-sans">
      
      {/* 1. Status Banner (Exact PartnerStack Banner in Screenshot 1) */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs sm:text-sm">
            <span className="text-neutral-800 font-medium">Innotek Network Approval Status: </span>
            {isActive && (
              <strong className="text-emerald-600 font-bold">Active &amp; Approved</strong>
            )}
            {isPending && (
              <strong className="text-amber-600 font-bold">Pending Review</strong>
            )}
            {isRejected && (
              <strong className="text-rose-600 font-bold">Rejected</strong>
            )}
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          {isRejected ? (
            isCooldownActive ? (
              <span className="text-xs text-neutral-500 font-medium">
                Re-apply available in {daysRemaining} days ({cooldownEnd?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
              </span>
            ) : (
              <form action={reapplyAction}>
                <button
                  type="submit"
                  className="text-xs font-bold text-black hover:underline cursor-pointer"
                >
                  Re-apply
                </button>
              </form>
            )
          ) : isPending ? (
            <span className="text-xs text-amber-700 font-medium">
              In Compliance Verification Queue (24–48h SLA)
            </span>
          ) : (
            <span className="text-xs text-emerald-700 font-medium">
              Active Partner &bull; {(profile.commissionRate * 100).toFixed(0)}% Base Rate
            </span>
          )}
        </div>
      </div>

      {/* 2. Hold Applications Banner (Screenshot 1: 3 applications on hold) */}
      {!isActive && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0 mt-1 sm:mt-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#09090B]">
                3 applications to join your program are on hold
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                If approved by the Network, Innotek will automatically submit these applications for you
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 p-1 rounded-lg border border-neutral-200 bg-neutral-50">
              <div className="h-7 w-7 rounded-md bg-white border border-neutral-200 p-1 flex items-center justify-center">
                <img src="/logos/moodscanr.png" alt="MoodScanr" className="h-full w-full object-contain" />
              </div>
              <div className="h-7 w-7 rounded-md bg-white border border-neutral-200 p-1 flex items-center justify-center">
                <img src="/logos/headshot.png" alt="Headshot" className="h-full w-full object-contain" />
              </div>
              <div className="h-7 w-7 rounded-md bg-white border border-neutral-200 p-1 flex items-center justify-center">
                <img src="/logos/halalscanr.png" alt="HalalScanr" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Spotlight Banner (Screenshot 1: ✦ NETWORK SPOTLIGHT - Monochrome Black/Neutral Style) */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white border border-neutral-200 p-2.5 flex items-center justify-center shadow-xs shrink-0">
              <img src="/logos/moodscanr.png" alt="MoodScanr" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  ✦ NETWORK SPOTLIGHT
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#09090B] mt-0.5 flex items-center gap-2 flex-wrap">
                <span>MoodScanr AI</span>
                <span className="text-xs text-neutral-600 font-normal">
                  &rarr; $29/mo • 20% Rec.
                </span>
              </h2>
              <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                Autonomous video emotion intelligence and comment polarity mapping platform for YouTube creators and TikTok agencies.
              </p>
              <div className="mt-1">
                <a
                  href="https://moodscanr.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-500 hover:text-black inline-flex items-center gap-1 hover:underline font-medium"
                >
                  <span>moodscanr.ai</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800 transition shadow-xs cursor-pointer"
            >
              <span>{isActive ? 'Get Promotional Links' : 'Join program'}</span>
            </Link>
            <button className="text-xs text-neutral-500 hover:text-neutral-800 hover:underline cursor-pointer">
              Dismiss
            </button>
          </div>
        </div>
      </div>

      {/* 4. Programs Tabbed Section (Screenshot 1: Partnerships & Invitations 0) */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-2xs overflow-hidden">
        
        {/* Tab Header Strip */}
        <div className="border-b border-neutral-200 px-6 pt-3 flex items-center space-x-8">
          <button className="relative pb-3 text-xs sm:text-[13px] font-bold text-black flex items-center gap-1.5 cursor-pointer">
            <Star className="h-3.5 w-3.5 fill-black" />
            <span>Partnerships</span>
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
          </button>
          <button className="relative pb-3 text-xs sm:text-[13px] font-medium text-neutral-500 hover:text-black flex items-center gap-1.5 cursor-pointer">
            <Mail className="h-3.5 w-3.5" />
            <span>Invitations</span>
            <span className="rounded-full bg-neutral-100 text-neutral-600 px-1.5 py-0.2 text-[10px] font-medium">0</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-8 sm:p-12">
          {!isActive ? (
            /* Funnel Illustration Empty State (Screenshot 1) */
            <div className="max-w-md mx-auto text-center space-y-4">
              {/* Funnel Illustration */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="w-16 h-12 bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-center">
                  <Filter className="h-8 w-8 text-black" />
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#09090B]">
                  You don&apos;t have any programs yet
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Visit our Marketplace to find the program that best fits your sales channels and industry focus
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 text-xs font-bold text-black hover:underline"
                >
                  <span>Explore AI Marketplace →</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Active Partnered Programs List */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold text-[#09090B]">
                  Your 7 Active Innotek AI Programs
                </span>
                <Link href="/products" className="text-xs text-black font-bold hover:underline">
                  View full catalog →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PRODUCTS_CATALOG.slice(0, 4).map((prod) => (
                  <div
                    key={prod.name}
                    className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 flex items-center justify-between gap-3 hover:bg-neutral-50 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 flex items-center justify-center shrink-0">
                        <img src={prod.logo} alt={prod.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#09090B] truncate">{prod.name}</h4>
                        <p className="text-[11px] text-emerald-700 font-semibold">{prod.rate}</p>
                      </div>
                    </div>

                    <Link
                      href="/products"
                      className="rounded-lg bg-white border border-neutral-300 px-3 py-1.5 text-xs font-bold text-[#09090B] hover:bg-neutral-100 transition shrink-0"
                    >
                      Get Link
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 5. Performance Overview Section with Interactive Chart (Screenshot 1, 2, 3) */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-2xs space-y-5">
        
        {/* Header & Filter Controls Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <h2 className="text-base sm:text-lg font-bold text-[#09090B]">
            Performance Overview
          </h2>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 font-medium">
              <span className="text-neutral-500 font-bold">$</span>
              <span>Display in USD</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 font-medium">
              <span>All programs</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 font-medium">
              <span>All partnerships</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 font-medium">
              <span>Last 90 days</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Interactive SVG Chart Canvas + 5 Metric Selector Cards */}
        <PerformanceChart stats={stats} isActive={isActive} />

      </div>

      {/* 6. Your Activity Section (Screenshot 3: Rocket Graphic Card) */}
      <div className="rounded-xl border border-neutral-200 bg-white p-8 sm:p-12 shadow-2xs text-center space-y-4">
        <div className="flex items-center justify-start pb-4 border-b border-neutral-100 text-left">
          <h3 className="text-sm sm:text-base font-bold text-[#09090B]">
            Your Activity
          </h3>
        </div>

        <div className="py-6 max-w-lg mx-auto space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center mx-auto">
            <Rocket className="h-8 w-8" />
          </div>

          <h4 className="text-base font-bold text-[#09090B]">
            You have no activity yet
          </h4>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Innotek tracks activity across all your programs so you can see when customers sign up, make purchases, or generate rewards for you.
          </p>
        </div>
      </div>

      {/* 7. Footer (Screenshot 3: Innotek.global | Partner Agreement...) */}
      <footer className="pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400 font-sans">
        <a href="https://innotek.global" target="_blank" rel="noopener noreferrer" className="hover:text-black">Innotek.global</a>
        <span>&bull;</span>
        <Link href="/affiliate-agreement" className="hover:text-black">Partner Agreement</Link>
        <span>&bull;</span>
        <Link href="/terms" className="hover:text-black">Code of Conduct</Link>
        <span>&bull;</span>
        <Link href="/faq" className="hover:text-black">Help &amp; Support Center</Link>
      </footer>

    </div>
  );
}
