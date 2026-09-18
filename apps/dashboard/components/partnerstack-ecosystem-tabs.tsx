'use client';

import { useState } from 'react';
import { UserPlus, Compass, LineChart, Coins, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface StageData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  accentColor: string;
  bulletPoints: string[];
  mockCard: {
    kpi: string;
    kpiLabel: string;
    actionLabel: string;
    previewTitle: string;
    previewDesc: string;
  };
}

const STAGES: StageData[] = [
  {
    id: 'recruit',
    title: 'Recruit',
    subtitle: 'Attract high-performing partners',
    description: 'Instant onboarding with zero friction. Partner applications receive auto-generated affiliate tracking IDs and unique first-party links in under 60 seconds.',
    icon: UserPlus,
    accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
    bulletPoints: [
      'Automated partner screening & instant code issuance',
      'One unified master account covering all 7 AI apps',
      'No application fees or minimum audience gating',
    ],
    mockCard: {
      kpi: '100% Instant',
      kpiLabel: 'Partner Onboarding Rate',
      actionLabel: 'Issue Partner Code',
      previewTitle: 'Automated Account Provisioning',
      previewDesc: 'Live tracking codes issued for MoodScanr, Headshot, HalalScanr, FanScanr, and more.',
    },
  },
  {
    id: 'activate',
    title: 'Activate',
    subtitle: 'Equip with creative & conversion kits',
    description: 'Give your audience what converts. Download verified YouTube description snippets, high-resolution logo marks, video demos, and comparison reviews.',
    icon: Compass,
    accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    bulletPoints: [
      'Ready-to-use YouTube video description templates',
      '4K product screenshot kits & high-res PNG logos',
      'Proven audience conversion hooks per software vertical',
    ],
    mockCard: {
      kpi: '3.4x Higher',
      kpiLabel: 'Conversion Lift with Creative Kits',
      actionLabel: 'Download Media Kit',
      previewTitle: 'Creator Asset Center',
      previewDesc: 'Complete marketing toolkits available for instant download on every product card.',
    },
  },
  {
    id: 'track',
    title: 'Track',
    subtitle: '60-day first-party cookie engine',
    description: 'Every click, referral session, and conversion is fingerprinted with first-party domain cookies, ensuring zero lost attribution even if users convert weeks later.',
    icon: LineChart,
    accentColor: 'text-purple-600 bg-purple-50 border-purple-200',
    bulletPoints: [
      '60-day persistent browser attribution cookie',
      'Custom sub-ID parameters for campaign-level tracking',
      'Real-time webhook telemetry updated hourly',
    ],
    mockCard: {
      kpi: '60 Days',
      kpiLabel: 'Attribution Guarantee Window',
      actionLabel: 'Test Telemetry Link',
      previewTitle: 'Idempotent Click Ledger',
      previewDesc: 'Real-time referral log verifies traffic sources with zero ad-blocker drop-off.',
    },
  },
  {
    id: 'commission',
    title: 'Commission',
    subtitle: 'Up to 30% lifetime recurring payouts',
    description: 'Earn reliable recurring revenue that compounds every month. Enjoy 20% to 30% recurring commissions as long as your referred customers remain subscribed.',
    icon: Coins,
    accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
    bulletPoints: [
      '20% to 30% recurring lifetime payout tiers',
      'Automated 14-day refund clearance protection',
      'Disbursements via UK Bank Wire, Momo, and PayPal',
    ],
    mockCard: {
      kpi: 'Up to 30%',
      kpiLabel: 'Recurring Revenue Share',
      actionLabel: 'View Commission Ledger',
      previewTitle: 'Monthly NET-15 Settlements',
      previewDesc: 'Automated disbursement straight to your preferred bank account or mobile wallet.',
    },
  },
  {
    id: 'optimize',
    title: 'Optimize',
    subtitle: 'Deep performance analytics & scale',
    description: 'Monitor click-through rates, top-converting traffic channels, and highest-earning software products to scale your campaigns with precision.',
    icon: Zap,
    accentColor: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    bulletPoints: [
      'Granular EPC (Earnings Per Click) metrics',
      'Product-by-product revenue distribution analytics',
      'Dedicated partner support & performance bonuses',
    ],
    mockCard: {
      kpi: '+42% MoM',
      kpiLabel: 'Top Partner Revenue Growth',
      actionLabel: 'Open Analytics Deck',
      previewTitle: 'Performance Insights Deck',
      previewDesc: 'Actionable metrics help creators double down on their highest-converting links.',
    },
  },
];

export function PartnerStackEcosystemTabs() {
  const [activeStageId, setActiveStageId] = useState('recruit');

  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];
  const Icon = activeStage.icon;

  return (
    <section className="py-20 sm:py-28 bg-transparent border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-mono font-bold text-[#09090B] mb-3 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-[#3B50DF] animate-pulse" />
            <span>THE PARTNER ECOSYSTEM ENGINE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#09090B] tracking-tight">
            How the Innotek Partner Engine Operates
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600">
            A battle-tested architecture designed to maximize partner conversion rates and ensure transparent monthly settlements.
          </p>
        </div>

        {/* Dynamic 5-Tab Selector Strip (PartnerStack Style) */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-sm space-x-1">
            {STAGES.map((stage) => {
              const StageIcon = stage.icon;
              const isActive = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 sm:px-6 py-3 text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#0B1228] text-white shadow-md'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                  }`}
                >
                  <StageIcon className={`h-4 w-4 ${isActive ? 'text-[#3B50DF]' : 'text-neutral-400'}`} />
                  <span>{stage.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Stage Content Showcase Card */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${activeStage.accentColor} shadow-2xs`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                    STAGE {STAGES.findIndex(s => s.id === activeStage.id) + 1} OF 5
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B]">
                    {activeStage.subtitle}
                  </h3>
                </div>
              </div>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                {activeStage.description}
              </p>

              <div className="space-y-3 pt-2">
                {activeStage.bulletPoints.map((bp, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{bp}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3B50DF] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#2F40B8] transition shadow-xs"
                >
                  <span>Get Started with Innotek</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Mock UI Preview Card (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <span className="font-mono text-[11px] font-bold text-neutral-500 uppercase">
                  {activeStage.mockCard.previewTitle}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div>
                <span className="font-mono text-xs text-neutral-400 block uppercase">
                  {activeStage.mockCard.kpiLabel}
                </span>
                <p className="font-display text-3xl font-extrabold text-[#09090B] mt-0.5">
                  {activeStage.mockCard.kpi}
                </p>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {activeStage.mockCard.previewDesc}
              </p>

              <div className="pt-2">
                <div className="rounded-xl border border-neutral-200 bg-white p-3 flex items-center justify-between shadow-2xs">
                  <span className="font-mono text-xs font-bold text-neutral-700">
                    {activeStage.mockCard.actionLabel}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Ready
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
