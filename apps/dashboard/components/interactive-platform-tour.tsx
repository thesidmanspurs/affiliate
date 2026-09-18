'use client';

import { useState, useEffect, useRef } from 'react';
import { ScrollReveal } from '@/components/scroll-reveal';
import {
  MousePointer2,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  Coins,
  ArrowRight,
  Sparkles,
  Grid,
  Bell,
  Search,
  ExternalLink,
  Star,
  Mail,
  Filter,
  ChevronDown,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface SimulationStage {
  url: string;
  activeTab: 'overview' | 'products' | 'commissions';
  cursorX: number; // %
  cursorY: number; // %
  copied: boolean;
  clicks: number;
  signups: number;
  pending: number;
  balance: number;
  recentEvent: string;
}

const STAGES: SimulationStage[] = [
  // 0: Home (Overview) - Telemetry live
  {
    url: 'https://affiliate.innotek.global/overview',
    activeTab: 'overview',
    cursorX: 68,
    cursorY: 48,
    copied: false,
    clicks: 142,
    signups: 18,
    pending: 116.0,
    balance: 1240.0,
    recentEvent: 'Telemetry Active: Tracking 7 Innotek AI applications across 60-day cookie attribution',
  },
  // 1: Click "Explore Partnerships"
  {
    url: 'https://affiliate.innotek.global/products',
    activeTab: 'products',
    cursorX: 30,
    cursorY: 15,
    copied: false,
    clicks: 142,
    signups: 18,
    pending: 116.0,
    balance: 1240.0,
    recentEvent: 'Navigating Marketplace: Viewing 7 vertical AI applications with up to 30% recurring payouts',
  },
  // 2: Copy Link on MoodScanr AI
  {
    url: 'https://affiliate.innotek.global/products',
    activeTab: 'products',
    cursorX: 84,
    cursorY: 54,
    copied: true,
    clicks: 142,
    signups: 18,
    pending: 116.0,
    balance: 1240.0,
    recentEvent: 'Copied Referral Link: https://moodscanr.ai/?ref=INNOTEK_VIP',
  },
  // 3: Switch to Rewards
  {
    url: 'https://affiliate.innotek.global/commissions',
    activeTab: 'commissions',
    cursorX: 20,
    cursorY: 15,
    copied: false,
    clicks: 143,
    signups: 19,
    pending: 121.8,
    balance: 1240.0,
    recentEvent: 'Rewards Ledger: $1,240.00 USD settled • Automated 14-day clearance holding buffer verified',
  },
  // 4: Points to Request Withdrawal
  {
    url: 'https://affiliate.innotek.global/commissions',
    activeTab: 'commissions',
    cursorX: 79,
    cursorY: 48,
    copied: false,
    clicks: 143,
    signups: 19,
    pending: 121.8,
    balance: 1240.0,
    recentEvent: 'Payment Rails: Instant withdrawal via Direct Deposit, PayPal, Wise, or USDT',
  },
  // 5: Return to Home with Attributed Sale
  {
    url: 'https://affiliate.innotek.global/overview',
    activeTab: 'overview',
    cursorX: 14,
    cursorY: 15,
    copied: false,
    clicks: 143,
    signups: 19,
    pending: 121.8,
    balance: 1240.0,
    recentEvent: 'Referral Attributed: YouTube Creator Demo • +$5.80 (20%) added to 14-day clearance ledger',
  },
];

export function InteractivePlatformTour() {
  const [stageIndex, setStageIndex] = useState(0);
  const [manualTab, setManualTab] = useState<'overview' | 'products' | 'commissions' | null>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [manualCopied, setManualCopied] = useState(false);

  const current = STAGES[stageIndex];
  const activeTab = manualTab ?? current.activeTab;
  const isCopied = manualCopied || current.copied;

  // Continuous fluid tour advance loop
  useEffect(() => {
    if (manualTab) return; // Pause auto-advance if user manually interacts

    const clickTimer = setTimeout(() => {
      setIsClicking(true);
    }, 1900);

    const advanceTimer = setTimeout(() => {
      setIsClicking(false);
      setStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 2400);

    return () => {
      clearTimeout(clickTimer);
      clearTimeout(advanceTimer);
    };
  }, [stageIndex, manualTab]);

  const handleManualTab = (tab: 'overview' | 'products' | 'commissions') => {
    setManualTab(tab);
  };

  const handleManualCopy = () => {
    navigator.clipboard?.writeText('https://moodscanr.ai/?ref=INNOTEK_VIP');
    setManualCopied(true);
    setTimeout(() => setManualCopied(false), 2500);
  };

  return (
    <section id="tour" className="scroll-mt-24 py-20 sm:py-28 bg-transparent border-b border-neutral-200 overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={650} className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-mono font-bold text-[#09090B] mb-3 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE INTERACTIVE SIMULATOR</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#09090B] tracking-tight">
            See the Innotek Engine in Action
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600">
            Continuous real-time demonstration: instant tracking link generation, first-party cookie attribution, and transparent monthly ledger settlements.
          </p>
        </ScrollReveal>

        {/* Real Portal Simulation Browser Window */}
        <ScrollReveal direction="up" delay={150} duration={750} distance={36} className="max-w-5xl mx-auto w-full">
          <div className="w-full relative rounded-2xl border border-neutral-300 bg-white shadow-2xl overflow-hidden h-[600px] min-h-[600px] max-h-[600px] flex flex-col justify-between select-none">
          
          {/* Mock Browser Header Bar */}
          <div className="bg-[#0B1228] text-white px-4 sm:px-6 h-11 flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-3 font-mono text-xs text-neutral-300 font-bold hidden sm:inline">
                {current.url}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              {/* <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">TELEMETRY LIVE</span> */}
            </div>
          </div>

          {/* EXACT REPRODUCTION OF REAL PORTAL NAVBAR (AffiliateNav) */}
          <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0 font-sans">
            <div className="flex items-center gap-6 sm:gap-8">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <img
                  src="/logos/innotek.png"
                  alt="Innotek Global"
                  className="h-6 w-auto object-contain"
                />
              </div>

              {/* Exact Portal Tabs */}
              <nav className="flex items-center space-x-6 h-14">
                <button
                  type="button"
                  onClick={() => handleManualTab('overview')}
                  className={`relative flex items-center h-14 text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'overview'
                      ? 'text-black font-bold'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  <span>Home</span>
                  {activeTab === 'overview' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-t-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleManualTab('commissions')}
                  className={`relative flex items-center h-14 text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'commissions'
                      ? 'text-black font-bold'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  <span>Rewards</span>
                  {activeTab === 'commissions' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-t-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleManualTab('products')}
                  className={`relative flex items-center h-14 text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'products'
                      ? 'text-black font-bold'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  <span>Explore Partnerships</span>
                  <span className="rounded bg-neutral-100 text-neutral-700 text-[9px] font-mono px-1.5 py-0.5 ml-1.5 font-bold">
                    7 AI
                  </span>
                  {activeTab === 'products' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-t-full" />
                  )}
                </button>
              </nav>
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                <Grid className="h-3.5 w-3.5" />
                <span>Your programs</span>
              </div>

              <div className="relative rounded-full p-1.5 text-neutral-600">
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute top-1 right-1 flex h-1.5 w-1.5 rounded-full bg-black" />
              </div>

              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                <div className="h-7 w-7 rounded-full bg-neutral-900 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                  IN
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[11px] font-bold text-neutral-900 leading-tight">INNOTEK_VIP</span>
                  <span className="text-[9px] font-mono text-emerald-600 font-bold leading-tight">Active &bull; 20%</span>
                </div>
                <ChevronDown className="h-3 w-3 text-neutral-400 hidden sm:block" />
              </div>
            </div>
          </div>

          {/* Main Stage Content Viewport */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between overflow-hidden bg-[#F9FAFB]">
            
            <div className="relative h-[395px] w-full overflow-y-auto pr-1">
              
              {/* VIEW 1: HOME (Exact replica of apps/dashboard/app/(portal)/overview/page.tsx) */}
              {activeTab === 'overview' && (
                <div className="space-y-3.5 w-full">
                  
                  {/* Status Banner */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-3 sm:p-3.5 flex items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-black flex items-center justify-center text-white shrink-0">
                        <ShieldCheck className="h-3 w-3" />
                      </div>
                      <div className="text-xs">
                        <span className="text-neutral-800 font-medium">Innotek Network Approval Status: </span>
                        <strong className="text-emerald-600 font-bold">Active &amp; Approved</strong>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-700 font-medium hidden sm:inline">
                      Active Partner &bull; 20% Base Rate
                    </span>
                  </div>

                  {/* Spotlight Banner */}
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-11 w-11 rounded-xl bg-white border border-neutral-200 p-1.5 flex items-center justify-center shadow-xs shrink-0">
                          <img src="/logos/moodscanr.png" alt="MoodScanr" className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                            ✦ NETWORK SPOTLIGHT
                          </span>
                          <h3 className="text-sm font-bold text-[#09090B] flex items-center gap-2">
                            <span>MoodScanr AI</span>
                            <span className="text-xs text-neutral-500 font-normal">&rarr; $29/mo &bull; 20% Rec.</span>
                          </h3>
                          <p className="text-xs text-neutral-600 mt-0.5 max-w-xl line-clamp-1">
                            Autonomous video emotion intelligence and comment polarity mapping platform.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleManualTab('products')}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs shrink-0 cursor-pointer"
                      >
                        <span>Get Promotional Links</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Real Metric KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">Total Clicks</span>
                      <p className="font-display text-xl font-extrabold text-[#09090B] mt-0.5">{current.clicks}</p>
                      <span className="text-[9px] font-mono text-emerald-600 font-bold">+14.2% 60d</span>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">Conversions</span>
                      <p className="font-display text-xl font-extrabold text-[#09090B] mt-0.5">{current.signups}</p>
                      <span className="text-[9px] font-mono text-neutral-500">Attributed</span>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 shadow-xs">
                      <span className="text-[10px] font-mono text-amber-800 uppercase block">14d Buffer</span>
                      <p className="font-display text-xl font-extrabold text-amber-950 mt-0.5">${current.pending.toFixed(2)}</p>
                      <span className="text-[9px] font-mono text-amber-700">Holding</span>
                    </div>

                    <div className="rounded-xl border border-black bg-black text-white p-3 shadow-xs">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Withdrawable</span>
                      <p className="font-display text-xl font-extrabold text-white mt-0.5">${current.balance.toFixed(2)}</p>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">Available Now</span>
                    </div>
                  </div>

                  {/* Active Programs Strip */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                      <div className="flex items-center space-x-4">
                        <span className="text-xs font-bold text-black flex items-center gap-1">
                          <Star className="h-3 w-3 fill-black" />
                          <span>Active Partnerships (7)</span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleManualTab('products')}
                        className="text-[11px] text-black font-bold hover:underline cursor-pointer"
                      >
                        Marketplace &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="p-2 rounded-lg border border-neutral-200 bg-neutral-50/60 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src="/logos/moodscanr.png" alt="MoodScanr" className="h-6 w-6 object-contain" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-black truncate">MoodScanr AI</h4>
                            <p className="text-[10px] text-emerald-700 font-semibold">20% Recurring</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleManualTab('products')}
                          className="rounded-md bg-white border border-neutral-300 px-2.5 py-1 text-[11px] font-bold text-black hover:bg-neutral-100 transition shadow-2xs cursor-pointer"
                        >
                          Get Link
                        </button>
                      </div>

                      <div className="p-2 rounded-lg border border-neutral-200 bg-neutral-50/60 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src="/logos/headshot.png" alt="Headshot" className="h-6 w-6 object-contain" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-black truncate">Headshoot AI</h4>
                            <p className="text-[10px] text-emerald-700 font-semibold">30% Per Sale</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleManualTab('products')}
                          className="rounded-md bg-white border border-neutral-300 px-2.5 py-1 text-[11px] font-bold text-black hover:bg-neutral-100 transition shadow-2xs cursor-pointer"
                        >
                          Get Link
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* VIEW 2: EXPLORE PARTNERSHIPS (Exact replica of apps/dashboard/app/(portal)/products/client.tsx) */}
              {activeTab === 'products' && (
                <div className="space-y-3 w-full">
                  
                  {/* Search Bar */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                      <input
                        type="text"
                        readOnly
                        value="Search 7 AI software applications..."
                        className="w-full rounded-lg border border-neutral-200 bg-white pl-8 pr-3 py-1.5 text-xs text-neutral-700 font-sans outline-none shadow-2xs"
                      />
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-800 shadow-2xs">
                      All Products (7)
                    </div>
                  </div>

                  {/* Primary Featured Product: MoodScanr AI with Instant Copy Box */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200 p-1.5 flex items-center justify-center shadow-2xs">
                          <img src="/logos/moodscanr.png" alt="MoodScanr AI" className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-black">MoodScanr AI</h4>
                            <span className="font-mono text-[9px] font-bold uppercase bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded border border-neutral-200">
                              AI Sentiment &amp; Video
                            </span>
                            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.2">
                              Popular
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Autonomous video emotion intelligence and comment polarity mapping platform.
                          </p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <span className="font-bold text-xs text-emerald-700 block">20% Rec.</span>
                        <span className="text-[10px] text-neutral-400">$29 / mo</span>
                      </div>
                    </div>

                    {/* Referral Link Copy Bar */}
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase">
                        YOUR UNIQUE REFERRAL LINK:
                      </span>
                      <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-50 p-2 shadow-2xs">
                        <input
                          type="text"
                          readOnly
                          value="https://moodscanr.ai/?ref=INNOTEK_VIP"
                          className="flex-1 min-w-0 font-mono text-xs text-black bg-transparent outline-none select-all font-semibold"
                        />
                        <button
                          type="button"
                          onClick={handleManualCopy}
                          className={`inline-flex items-center gap-1 rounded-lg px-3.5 py-1 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer ${
                            isCopied ? 'bg-emerald-600' : 'bg-black hover:bg-neutral-800'
                          }`}
                        >
                          {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Product Row: Headshoot AI */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-3 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-white border border-neutral-200 p-1 flex items-center justify-center">
                        <img src="/logos/headshot.png" alt="Headshoot AI" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-black">Headshoot AI</h4>
                          <span className="rounded-full bg-amber-100 text-amber-800 text-[9px] font-mono font-bold px-1.5 py-0.2">
                            Top Payout
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500">Studio-Grade Executive AI Corporate Portraits</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-bold text-xs text-emerald-700 block">30% Per Sale</span>
                        <span className="text-[10px] text-neutral-400">$35 / pack</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleManualCopy}
                        className="rounded-lg bg-white border border-neutral-300 px-3 py-1 text-xs font-bold text-black hover:bg-neutral-50 transition shadow-2xs cursor-pointer"
                      >
                        Get Link
                      </button>
                    </div>
                  </div>

                  {/* Tertiary Product Row: HalalScanr */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-3 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-white border border-neutral-200 p-1 flex items-center justify-center">
                        <img src="/logos/halalscanr.png" alt="HalalScanr" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-black">HalalScanr</h4>
                          <span className="rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-1.5 py-0.2">
                            High Retention
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500">Dietary E-Number &amp; Ingredient OCR Scanner</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-bold text-xs text-emerald-700 block">25% Rec.</span>
                        <span className="text-[10px] text-neutral-400">$9.99 / mo</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleManualCopy}
                        className="rounded-lg bg-white border border-neutral-300 px-3 py-1 text-xs font-bold text-black hover:bg-neutral-50 transition shadow-2xs cursor-pointer"
                      >
                        Get Link
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* VIEW 3: REWARDS (Exact replica of apps/dashboard/app/(portal)/commissions/page.tsx) */}
              {activeTab === 'commissions' && (
                <div className="space-y-3.5 w-full">
                  
                  {/* Subtitle & Title */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                        INNOTEK GLOBAL
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#09090B]">
                        Rewards &amp; withdrawals
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      NET-15 Schedule
                    </span>
                  </div>

                  {/* Two Main Top KPI Cards */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs space-y-3">
                    <span className="text-xs font-medium text-neutral-600 block">
                      Total available balance
                    </span>
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B]">
                      $1,240.00 USD
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 items-center">
                      {/* Breakdown */}
                      <div className="space-y-1 text-xs text-neutral-600">
                        <div className="flex justify-between py-0.5">
                          <span>Total rewards</span>
                          <span className="font-semibold text-neutral-800">$1,240.00 USD</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span>Processing fee</span>
                          <span className="font-normal text-neutral-400">&mdash;</span>
                        </div>
                        <div className="border-t border-neutral-200 pt-1 flex justify-between font-bold text-neutral-900">
                          <span>Total</span>
                          <span className="font-mono">$1,240.00 USD</span>
                        </div>
                      </div>

                      {/* Action Box */}
                      <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center space-y-1.5">
                        <button
                          type="button"
                          className="w-full inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs cursor-pointer"
                        >
                          <span>Request withdrawal</span>
                        </button>
                        <p className="text-[10px] text-neutral-500">
                          Choose direct deposit, PayPal, Wise or USDT
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Commission Ledger Table */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                      <span className="font-mono text-[11px] font-bold text-neutral-500 uppercase">
                        Recent Referral Settlements
                      </span>
                      <span className="font-mono text-[11px] text-emerald-700 font-bold">
                        14-Day Automated Buffer
                      </span>
                    </div>

                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-neutral-50 text-[10px] text-neutral-500 uppercase font-bold">
                        <tr>
                          <th className="p-1.5">Application</th>
                          <th className="p-1.5">Sale</th>
                          <th className="p-1.5">Rate</th>
                          <th className="p-1.5">Commission</th>
                          <th className="p-1.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-[11px]">
                        <tr className="bg-emerald-50/40 font-bold">
                          <td className="p-1.5 text-black">MoodScanr AI</td>
                          <td className="p-1.5 text-black">$29.00</td>
                          <td className="p-1.5 text-neutral-600">20%</td>
                          <td className="p-1.5 text-emerald-700 font-bold">+$5.80</td>
                          <td className="p-1.5">
                            <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded text-[9px] font-bold">
                              14D_BUFFER
                            </span>
                          </td>
                        </tr>
                        <tr className="text-neutral-600">
                          <td className="p-1.5 font-semibold text-black">Headshoot AI</td>
                          <td className="p-1.5">$35.00</td>
                          <td className="p-1.5">30%</td>
                          <td className="p-1.5 text-emerald-700 font-bold">+$10.50</td>
                          <td className="p-1.5">
                            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-[9px] font-bold">
                              CLEARED
                            </span>
                          </td>
                        </tr>
                        <tr className="text-neutral-600">
                          <td className="p-1.5 font-semibold text-black">HalalScanr</td>
                          <td className="p-1.5">$9.99</td>
                          <td className="p-1.5">25%</td>
                          <td className="p-1.5 text-emerald-700 font-bold">+$2.50</td>
                          <td className="p-1.5">
                            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-[9px] font-bold">
                              CLEARED
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>

            {/* Bottom Live Activity Feed Bar */}
            <div className="p-2.5 rounded-xl border border-neutral-200 bg-white flex items-center justify-between text-xs font-mono shadow-2xs shrink-0">
              <div className="flex items-center gap-2 text-neutral-700 truncate">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="truncate"><strong>Event:</strong> {current.recentEvent}</span>
              </div>
              <span className="text-neutral-400 text-[11px] shrink-0 ml-2 hidden sm:inline">Real-time</span>
            </div>

          </div>

          {/* SIMULATED ANIMATED CURSOR */}
          {!manualTab && (
            <div
              className="absolute pointer-events-none z-30 transition-all duration-500 ease-out flex flex-col items-start"
              style={{
                left: `${current.cursorX}%`,
                top: `${current.cursorY}%`,
                transform: 'translate(-4px, -4px)',
              }}
            >
              <div className="relative">
                <MousePointer2
                  className={`h-6 w-6 text-black fill-black filter drop-shadow-md transition-opacity duration-150 ${
                    isClicking ? 'opacity-80' : 'opacity-100'
                  }`}
                />
                {isClicking && (
                  <span className="absolute -inset-2 rounded-full border-2 border-black/60 animate-ping" />
                )}
              </div>
            </div>
          )}

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
