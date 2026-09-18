'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Copy,
  Check,
  TrendingUp,
  Coins,
  Clock,
  ShieldCheck,
  MousePointer2,
  Bell,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface FeatureTab {
  id: number;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

const TABS: FeatureTab[] = [
  {
    id: 0,
    title: 'Reach the right partners',
    description: 'Get your brand in front of more customers by promoting your partner program across 7 proprietary AI software tools, ready to market instantly.',
    ctaText: 'Learn more about recruitment →',
    ctaHref: '/register',
  },
  {
    id: 1,
    title: 'Progress makes perfect',
    description: 'Understand where your traffic flows and converts, and trace it back to partners with 60-day first-party cookie attribution so you’re always paid accurately.',
    ctaText: 'Learn more about tracking →',
    ctaHref: '/partner/docs',
  },
  {
    id: 2,
    title: 'Champion partners to perform',
    description: 'Set your partners up for success with custom onboarding journeys, creative video assets, YouTube description kits, and conversion hooks.',
    ctaText: 'Learn more about activations →',
    ctaHref: '/affiliate',
  },
  {
    id: 3,
    title: 'Never miss a payment',
    description: 'No more mind-numbing calculations. Automated 14-day clearance hold protects margins with single monthly payouts straight to your bank.',
    ctaText: 'Learn more about commissions →',
    ctaHref: '/affiliate',
  },
  {
    id: 4,
    title: 'Prove ROI faster',
    description: 'Empower your partners to optimize their performance with detailed reporting, sub-ID telemetry, and conversion stats on how to improve success.',
    ctaText: 'Learn more about optimization →',
    ctaHref: '/partner/docs#best-practices',
  },
];

const AUTO_PLAY_DURATION = 5000; // 5 seconds

export function PartnerStackFeatureTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  // 5-Second Tab Auto-Advance Timer (Zero re-renders during cycle)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % TABS.length);
    }, AUTO_PLAY_DURATION);

    return () => clearInterval(timer);
  }, [activeTab]);

  const handleSelectTab = (index: number) => {
    setActiveTab(index);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText('https://moodscanr.ai/?ref=INNOTEK_VIP');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTab = TABS[activeTab];

  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28 bg-[#F7F5F0] text-[#09090B] overflow-hidden relative border-t border-b border-neutral-200/80 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Mini-Title & Main Bold Headline */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-3">
            INNOTEK PLATFORM FEATURES
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#09090B] leading-[1.08]">
            Simplify your ecosystem — automate the hard stuff
          </h2>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: 5 Vertical Tabs with 5-Second Solid Black Progress Bar */}
          <div className="lg:col-span-5 space-y-4">
            {TABS.map((tab, idx) => {
              const isActive = idx === activeTab;
              return (
                <div
                  key={tab.id}
                  onClick={() => handleSelectTab(idx)}
                  className="relative pl-6 cursor-pointer group select-none transition-all py-1.5"
                >
                  {/* Left Vertical Bar (Subtle Track + Solid Black Fill) */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-300/70 rounded-full overflow-hidden">
                    {isActive && (
                      <div
                        key={`tab-fill-${activeTab}`}
                        className="w-full bg-black rounded-full"
                        style={{
                          animation: `progress-vertical ${AUTO_PLAY_DURATION}ms linear forwards`,
                        }}
                      />
                    )}
                  </div>

                  {/* Tab Title */}
                  <h3
                    className={`font-display text-lg sm:text-xl font-extrabold transition-colors ${
                      isActive ? 'text-[#09090B]' : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    {tab.title}
                  </h3>

                  {/* Expandable Active Description */}
                  {isActive && (
                    <div className="mt-1.5 space-y-1">
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                        {tab.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: High-End Balanced Studio Mockup (Harmonized with site colors) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-8 h-[490px] min-h-[490px] max-h-[490px] flex flex-col justify-between shadow-xl relative overflow-hidden border border-neutral-200/90 bg-white">
              
              {/* STAGE 0: RECRUIT */}
              {activeTab === 0 && (
                <div className="flex-1 flex flex-col justify-between text-[#09090B] space-y-4">
                  {/* App Tiles Matrix in Background */}
                  <div className="grid grid-cols-4 gap-2">
                    {['MoodScanr AI', 'HalalScanr', 'FanScanr Sports', 'Headshoot AI', 'TalentScanr AI', 'CallScanr', 'AQIScanr AI', 'Innotek AI'].map((app, i) => (
                      <div key={i} className="rounded-xl bg-neutral-50 border border-neutral-200/80 p-2.5 text-center text-[11px] font-mono text-neutral-700 font-semibold shadow-2xs">
                        {app}
                      </div>
                    ))}
                  </div>

                  {/* Centered Floating Modal Card with Official Logo */}
                  <div className="max-w-xs mx-auto w-full rounded-2xl bg-neutral-50 border border-neutral-200 p-5 text-center shadow-md space-y-3 z-10">
                    <div className="h-12 w-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mx-auto shadow-xs p-2">
                      <img src="/logos/moodscanr.png" alt="MoodScanr AI" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-black">MoodScanr AI</h4>
                      <p className="text-[11px] font-mono text-neutral-500 mt-0.5">Earn 20% recurring per active subscriber</p>
                    </div>
                    <div className="pt-1">
                      <div className="relative inline-block w-full">
                        <button className="w-full rounded-xl bg-black py-2.5 text-xs font-bold text-white hover:bg-neutral-800 shadow-xs transition cursor-pointer">
                          Join program
                        </button>
                        <MousePointer2 className="absolute -bottom-3 -right-2 h-6 w-6 text-black fill-black animate-bounce" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 flex justify-end z-10">
                    <Link
                      href={currentTab.ctaHref}
                      className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs"
                    >
                      <span>{currentTab.ctaText}</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* STAGE 1: TRACKING */}
              {activeTab === 1 && (
                <div className="flex-1 flex flex-col justify-between text-[#09090B] space-y-4">
                  
                  {/* Main Link Generator Card */}
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-xs space-y-2.5">
                    <span className="font-display font-bold text-xs text-black block">
                      Your unique partner referral link
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      Share your link to refer customers with guaranteed 60-day first-party cookie attribution
                    </p>

                    <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white p-2 shadow-2xs">
                      <input
                        type="text"
                        readOnly
                        value="https://moodscanr.ai/?ref=INNOTEK_VIP"
                        className="flex-1 min-w-0 font-mono text-xs text-black bg-transparent outline-none select-all font-semibold"
                      />
                      <button
                        onClick={handleCopy}
                        className="rounded-lg bg-black px-4 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Metric Cards in Clean Balanced Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-200 shadow-2xs text-center">
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">CLICKS</span>
                      <strong className="text-lg text-black font-extrabold">64</strong>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-200 shadow-2xs text-center">
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">SIGNUPS</span>
                      <strong className="text-lg text-black font-extrabold">24</strong>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-200 shadow-2xs text-center">
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">SALES</span>
                      <strong className="text-lg text-emerald-700 font-extrabold">18</strong>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-200 shadow-2xs text-center">
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">AVG EPC</span>
                      <strong className="text-lg text-black font-extrabold">$655.18</strong>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={currentTab.ctaHref}
                      className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs"
                    >
                      <span>{currentTab.ctaText}</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* STAGE 2: ACTIVATION (Balanced Partner Dashboard Snapshot) */}
              {activeTab === 2 && (
                <div className="flex-1 flex flex-col justify-between text-[#09090B] space-y-4">
                  
                  {/* Dashboard Mock Card */}
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6 shadow-xs relative space-y-4">
                    
                    {/* Header Strip with Authentic Innotek Logo */}
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center p-1 shadow-2xs">
                          <img src="/logos/innotek.png" alt="Innotek" className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-black">Your Partner Dashboard</h4>
                          <p className="text-[10px] font-mono text-neutral-500">Unified telemetry across 7 AI applications</p>
                        </div>
                      </div>
                    </div>

                    {/* 3 Metric Columns */}
                    <div className="grid grid-cols-3 gap-3 py-1 text-left font-mono">
                      <div className="rounded-xl bg-white border border-neutral-200 p-3 shadow-2xs">
                        <span className="text-[10px] text-neutral-400 uppercase block">CLICKS</span>
                        <strong className="text-base sm:text-lg text-black font-extrabold">2,894</strong>
                      </div>
                      <div className="rounded-xl bg-white border border-neutral-200 p-3 shadow-2xs">
                        <span className="text-[10px] text-neutral-400 uppercase block">TRANSACTIONS</span>
                        <strong className="text-base sm:text-lg text-black font-extrabold">116</strong>
                      </div>
                      <div className="rounded-xl bg-white border border-neutral-200 p-3 shadow-2xs">
                        <span className="text-[10px] text-neutral-400 uppercase block">DEALS SOURCED</span>
                        <strong className="text-base sm:text-lg text-black font-extrabold">14</strong>
                      </div>
                    </div>

                    {/* Lifetime Earned Highlight Banner */}
                    <div className="rounded-xl bg-white border border-neutral-200 p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="font-mono text-[10px] text-neutral-500 uppercase block">
                          LIFETIME RECURRING REVENUE
                        </span>
                        <span className="text-xs text-neutral-600 font-medium">Auto-disbursed via NET-15 schedule</span>
                      </div>
                      <strong className="font-display text-xl sm:text-2xl text-black font-extrabold">
                        £17,829
                      </strong>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={currentTab.ctaHref}
                      className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs"
                    >
                      <span>{currentTab.ctaText}</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* STAGE 3: COMMISSIONS & PAYOUTS */}
              {activeTab === 3 && (
                <div className="flex-1 flex flex-col justify-between text-[#09090B] space-y-4">
                  
                  {/* Dashboard Invoice Card */}
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200/80">
                      <span className="font-mono text-xs font-bold text-neutral-700 uppercase">
                        Invoice Settlements Ledger
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        Auto NET-15
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between py-1.5 border-b border-neutral-200/60">
                        <span className="text-neutral-600">Period: June 1 to June 30</span>
                        <strong className="text-black">£110,093 &bull; <span className="text-emerald-600 font-bold">Settled</span></strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-neutral-200/60">
                        <span className="text-neutral-600">Period: May 1 to May 31</span>
                        <strong className="text-black">£97,345 &bull; <span className="text-emerald-600 font-bold">Settled</span></strong>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-neutral-600">Period: April 1 to April 30</span>
                        <strong className="text-black">£93,476 &bull; <span className="text-emerald-600 font-bold">Settled</span></strong>
                      </div>
                    </div>

                    {/* Notification Box */}
                    <div className="rounded-xl bg-white border border-neutral-200 p-3 space-y-1 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-black uppercase">
                        <Bell className="h-3.5 w-3.5" />
                        <span>PAYOUT NOTIFICATION</span>
                      </div>
                      <p className="text-xs text-neutral-800 font-semibold">
                        Invoice for July 1 to July 31 is ready for automatic bank wire transfer
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={currentTab.ctaHref}
                      className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs"
                    >
                      <span>{currentTab.ctaText}</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* STAGE 4: PROVE ROI */}
              {activeTab === 4 && (
                <div className="flex-1 flex flex-col justify-between text-[#09090B] space-y-4">
                  
                  {/* Graph Overview Card */}
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200/80">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span className="font-bold text-xs text-black">Program Revenue Analytics</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-800 font-mono text-[10px] font-bold">
                        Total Gross Revenue
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white border border-neutral-200 p-3 shadow-2xs">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase block">PREVIOUS MONTH</span>
                        <strong className="font-display text-base sm:text-lg text-black font-extrabold">£1,548,016</strong>
                      </div>
                      <div className="rounded-xl bg-white border border-neutral-200 p-3 shadow-2xs">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase block">ALL-TIME SOURCED</span>
                        <strong className="font-display text-base sm:text-lg text-emerald-700 font-extrabold">£16,327,983</strong>
                      </div>
                    </div>

                    {/* Paid Customers Badge */}
                    <div className="rounded-xl bg-white border border-neutral-200 p-3 text-center shadow-2xs">
                      <strong className="font-display text-xl text-black font-extrabold block">1,148</strong>
                      <span className="font-mono text-[10px] text-neutral-500 uppercase">ACTIVE PAID SUBSCRIBERS SOURCED</span>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={currentTab.ctaHref}
                      className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs"
                    >
                      <span>{currentTab.ctaText}</span>
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
