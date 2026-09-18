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
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
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
  byProduct?: Record<string, {
    productId: string;
    productName: string;
    conversionsCount: number;
    sourcedRevenue: number;
    pendingCommission: number;
    approvedCommission: number;
    totalCommission: number;
    status: string;
  }>;
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
    id: 'moodscanr',
    name: 'MoodScanr AI',
    category: 'Video & Sentiment AI',
    rate: '20% Rec.',
    url: 'https://moodscanr.ai',
    logo: '/logos/moodscanr.png',
    badge: 'Popular',
  },
  {
    id: 'headshot',
    name: 'Headshoot AI',
    category: 'Generative 4K Studio',
    rate: '30% Per Sale',
    url: 'https://headshot.innotek.global',
    logo: '/logos/headshot.png',
    badge: 'Top Payout',
  },
  {
    id: 'halalscanr',
    name: 'HalalScanr',
    category: 'Dietary & Food OCR',
    rate: '25% Rec.',
    url: 'https://halalscanr.innotek.global',
    logo: '/logos/halalscanr.png',
    badge: 'High Retention',
  },
  {
    id: 'fanscanr',
    name: 'FanScanr Sports',
    category: 'Sports & Media AI',
    rate: '20% Rec.',
    url: 'https://ftracker.innotek.global',
    logo: '/logos/fanscanr.png',
    badge: 'Trending',
  },
  {
    id: 'talentscanr',
    name: 'TalentScanr AI',
    category: 'HR Tech & Enterprise ATS',
    rate: '20% Rec.',
    url: 'https://talent.innotek.global',
    logo: '/logos/talentscanr.png',
    badge: 'Enterprise',
  },
  {
    id: 'callscanr',
    name: 'CallScanr',
    category: 'Voice AI & Telephony',
    rate: '15% Rec.',
    url: 'https://voice.innotek.global',
    logo: '/logos/callscanr.png',
    badge: 'Voice Agent',
  },
  {
    id: 'aqiscanr',
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

  let programs: any[] = [];

  try {
    const [fetchedStats, fetchedProfile, fetchedPrograms] = await Promise.all([
      apiFetch<DashboardStats>('/affiliates/me/stats', token).catch(() => null),
      apiFetch<AffiliateProfile>('/affiliates/me/profile', token).catch(() => null),
      apiFetch<any[]>('/affiliates/me/programs', token).catch(() => []),
    ]);
    if (fetchedStats) stats = fetchedStats;
    if (fetchedProfile) profile = fetchedProfile;
    if (fetchedPrograms && Array.isArray(fetchedPrograms)) programs = fetchedPrograms;
  } catch (err) {
    console.error('Failed to load overview data:', err);
  }

  const isActive = profile.status === 'ACTIVE';
  const isPending = profile.status === 'PENDING_REVIEW';
  const isRejected = profile.status === 'REJECTED';

  // Cooldown calculation
  const cooldownEnd = profile.reapplyAfter ? new Date(profile.reapplyAfter) : null;
  const now = new Date();
  const isCooldownActive = Boolean(cooldownEnd && cooldownEnd > now);
  const daysRemaining = cooldownEnd ? Math.max(1, Math.ceil((cooldownEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

  // Compute enrolled products
  const enrolledPrograms = PRODUCTS_CATALOG.map((prod) => {
    const slugAliases = prod.id === 'callscanr' ? ['callscanr', 'voice-agent'] : [prod.id];
    const found = programs.find((p) => slugAliases.includes(p.productId));
    const prodStat = stats.byProduct?.[prod.id] || (prod.id === 'callscanr' ? stats.byProduct?.['voice-agent'] : undefined);

    let status = found?.status || 'AVAILABLE';
    if (!found && isActive && prod.id === 'moodscanr') {
      status = 'ACTIVE';
    }

    return {
      ...prod,
      status,
      sourcedRevenue: found?.performance?.sourcedRevenue || prodStat?.sourcedRevenue || 0,
      conversionsCount: found?.performance?.conversionsCount || prodStat?.conversionsCount || 0,
      earnedCommission: found?.performance?.earnedCommission || prodStat?.totalCommission || 0,
    };
  });

  const activeEnrolled = enrolledPrograms.filter((p) => p.status === 'ACTIVE');

  return (
    <div className="space-y-4 text-[#09090B] pb-16 max-w-6xl mx-auto font-sans bg-white">
      
      {/* 1. Status Banner */}
      <div className="rounded-none border border-neutral-300 bg-white p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-none bg-black flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="text-xs sm:text-sm">
            <span className="text-neutral-800 font-medium">Innotek Partner Compliance: </span>
            {isActive && (
              <strong className="text-emerald-700 font-bold">Active &amp; Verified</strong>
            )}
            {isPending && (
              <strong className="text-amber-700 font-bold">Pending Compliance Review</strong>
            )}
            {isRejected && (
              <strong className="text-rose-700 font-bold">Ineligible for Cohort</strong>
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
                  Re-apply Now
                </button>
              </form>
            )
          ) : isPending ? (
            <span className="text-xs text-amber-800 font-medium">
              In Compliance Verification Queue (24–48h SLA)
            </span>
          ) : (
            <span className="text-xs text-emerald-800 font-bold">
              {activeEnrolled.length} of {PRODUCTS_CATALOG.length} Programs Registered &bull; Isolated Accounting
            </span>
          )}
        </div>
      </div>

      {/* 2. Spotlight Banner */}
      <div className="rounded-none border border-neutral-300 bg-neutral-50 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-none bg-white border border-neutral-300 p-2.5 flex items-center justify-center shadow-xs shrink-0">
              <img src="/logos/moodscanr.png" alt="MoodScanr" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  ✦ FEATURED PROGRAM
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#09090B] mt-0.5 flex items-center gap-2 flex-wrap">
                <span>MoodScanr AI</span>
                <span className="text-xs text-neutral-600 font-normal">
                  &rarr; $29/mo • 20% Recurring Commission
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none bg-black px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800 transition shadow-xs cursor-pointer"
            >
              <span>Manage Programs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Partnerships Section with Individual Program Cards */}
      <div className="rounded-none border border-neutral-300 bg-white shadow-2xs overflow-hidden">
        <div className="border-b border-neutral-200 px-6 pt-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button className="relative pb-3 text-xs sm:text-[13px] font-bold text-black flex items-center gap-1.5 cursor-pointer">
              <Star className="h-3.5 w-3.5 fill-black" />
              <span>Registered Programs ({activeEnrolled.length})</span>
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
            </button>
          </div>
          <Link href="/products" className="pb-3 text-xs font-bold text-black hover:underline inline-flex items-center gap-1">
            <span>Marketplace Catalog &rarr;</span>
          </Link>
        </div>

        <div className="p-6">
          {activeEnrolled.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-6 space-y-3">
              <div className="h-12 w-12 rounded-none bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-neutral-600">
                <Filter className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-[#09090B]">
                No Individual Programs Enrolled Yet
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Enroll in specific Innotek AI programs in the marketplace to activate your dedicated tracking links and isolated revenue streams.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="rounded-none bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition inline-block"
                >
                  Explore Programs
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeEnrolled.map((prod) => (
                <div
                  key={prod.name}
                  className="p-4 rounded-none border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between gap-3 hover:bg-neutral-50 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 min-w-10 rounded-none bg-white border border-neutral-200 p-1.5 flex items-center justify-center shrink-0">
                      <img src={prod.logo} alt={prod.name} className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#09090B] truncate">{prod.name}</h4>
                      <p className="text-[11px] text-emerald-700 font-bold">{prod.rate}</p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <div className="border-t border-neutral-200 pt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[9px] text-neutral-400 block font-bold uppercase">Sourced Revenue</span>
                      <strong className="text-neutral-900">${(prod.sourcedRevenue / 100).toFixed(2)}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-neutral-400 block font-bold uppercase">Sales</span>
                      <strong className="text-neutral-900">{prod.conversionsCount}</strong>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Link
                      href="/products"
                      className="w-full text-center block rounded-none bg-white border border-neutral-300 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition"
                    >
                      Get Link
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Isolated Product Revenue Streams Breakdown Table ("mỗi product là một nguồn thu riêng, không gộp") */}
      <div className="rounded-none border border-neutral-300 bg-white shadow-2xs overflow-hidden">
        <div className="border-b border-neutral-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-[#09090B]">
                Product-Level Revenue Isolation &amp; Ledger Breakdown
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 border border-neutral-300 text-neutral-700 px-2 py-0.5">
                Non-Aggregated
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Independent accounting of gross sales generated and earned commissions per AI SaaS tool.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="py-3 px-4">Program / Product</th>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4 text-right">Commission Rail</th>
                <th className="py-3 px-4 text-right">Driven Sales</th>
                <th className="py-3 px-4 text-right">Sourced Revenue</th>
                <th className="py-3 px-4 text-right">Earned Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {enrolledPrograms.map((p) => {
                const isEnrolled = p.status === 'ACTIVE';
                return (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-none border border-neutral-200 bg-white p-1 flex items-center justify-center shrink-0">
                          <img src={p.logo} alt={p.name} className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-neutral-900 block">{p.name}</strong>
                          <span className="text-[10px] text-neutral-400">{p.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {isEnrolled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Enrolled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-300 px-2 py-0.5">
                          <span>Available</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-neutral-800">
                      {p.rate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-neutral-900">
                      {p.conversionsCount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-neutral-900">
                      ${(p.sourcedRevenue / 100).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                      ${(p.earnedCommission / 100).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Performance Overview Section with Interactive Chart */}
      <div className="rounded-none border border-neutral-300 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <h2 className="text-base sm:text-lg font-bold text-[#09090B]">
            Platform Performance History
          </h2>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1 rounded-none border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 font-medium">
              <span className="text-neutral-500 font-bold">$</span>
              <span>USD Currency</span>
            </div>
            <div className="flex items-center gap-1 rounded-none border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 font-medium">
              <span>All programs</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </div>
            <div className="flex items-center gap-1 rounded-none border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 font-medium">
              <span>Last 90 days</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </div>
          </div>
        </div>

        <PerformanceChart stats={stats} isActive={isActive} />
      </div>

      {/* 6. Footer */}
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
