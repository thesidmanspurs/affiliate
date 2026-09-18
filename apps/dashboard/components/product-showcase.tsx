'use client';

import { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Coins,
  Target,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  commission: string;
  commissionType: 'recurring' | 'per_sale';
  rateNumber: number;
  url: string;
  logo: string;
  targetAudience: string;
  conversionHooks: string[];
  keyFeatures: string[];
  aov: string;
  projectedMonthly: string;
  badgeAccent: string;
  theme: {
    accentColor: string;
    badgeBg: string;
    badgeText: string;
    borderActive: string;
  };
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'moodscanr',
    name: 'MoodScanr AI',
    tagline: 'Autonomous Video & Comment Polarity Mapping',
    description: 'Frame-by-frame emotion recognition and audience comment polarity heatmaps for YouTube creators, TikTok agencies, and brand marketing campaigns.',
    category: 'Video & Sentiment AI',
    commission: '20% Recurring Lifetime',
    commissionType: 'recurring',
    rateNumber: 0.20,
    url: 'https://moodscanr.ai',
    logo: '/logos/moodscanr.png',
    targetAudience: 'YouTube creators, TikTok influencers, digital marketing agencies, brand managers',
    conversionHooks: [
      'Show creators why viewers drop off at specific emotional video timestamps.',
      'Highlight 1-click comment sentiment analysis for sponsored video ROI reports.',
      'Demonstrate multi-language transcript sentiment scoring in under 5 seconds.',
    ],
    keyFeatures: ['Frame-by-frame emotion timeline', 'Comment heatmaps & polarity graphs', 'Multi-lingual transcript NLP analysis'],
    aov: '£29 / month',
    projectedMonthly: '£580 / mo per 100 subs',
    badgeAccent: 'Sentiment Intelligence',
    theme: {
      accentColor: '#FF2E93',
      badgeBg: 'bg-pink-50',
      badgeText: 'text-pink-700',
      borderActive: 'border-[#FF2E93] ring-2 ring-[#FF2E93]/20',
    },
  },
  {
    id: 'headshot',
    name: 'AI Headshot Pro',
    tagline: 'Studio-Grade Executive AI Corporate Portraits',
    description: 'Transforms casual mobile selfies into ultra-photorealistic LinkedIn portraits and corporate headshots with 4K studio lighting in under 10 minutes.',
    category: 'Generative 4K Studio',
    commission: '30% Per Sale (One-Off)',
    commissionType: 'per_sale',
    rateNumber: 0.30,
    url: 'https://headshot.innotek.global',
    logo: '/logos/headshot.png',
    targetAudience: 'Job seekers, LinkedIn professionals, real estate agents, freelancers, corporate teams',
    conversionHooks: [
      'Save $300+ compared to booking a traditional corporate photographer studio.',
      'Get 100+ professional outfits and studio backdrops delivered in 10 minutes.',
      'Natural skin texture guarantee with zero artificial plastic-look artifacts.',
    ],
    keyFeatures: ['4K executive lighting presets', 'Natural skin texture preservation', '10-minute automated turnaround'],
    aov: '£35 / pack',
    projectedMonthly: '£1,050 per 100 orders',
    badgeAccent: 'Studio 4K AI',
    theme: {
      accentColor: '#F59E0B',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
      borderActive: 'border-amber-500 ring-2 ring-amber-500/20',
    },
  },
  {
    id: 'halalscanr',
    name: 'HalalScanr',
    tagline: 'Instant Dietary E-Number & Ingredient Scanner',
    description: 'Computer vision food label scanner instantly identifying E-numbers, halal certificates, animal derivatives, and cross-contamination allergens.',
    category: 'Dietary & Food OCR',
    commission: '25% Recurring Lifetime',
    commissionType: 'recurring',
    rateNumber: 0.25,
    url: 'https://halalscanr.innotek.global',
    logo: '/logos/halalscanr.png',
    targetAudience: 'Muslim consumers, halal supermarket shoppers, vegetarian & vegan shoppers, health-conscious families',
    conversionHooks: [
      'Scan any supermarket barcode or ingredient list in under 1 second.',
      'Cross-checked with 50+ global halal certification authorities automatically.',
      'Instant allergen and hidden animal derivative warning system.',
    ],
    keyFeatures: ['Live camera OCR E-number parser', 'Global halal certification authority database', 'Personalized allergen & diet alerts'],
    aov: '£9.99 / month',
    projectedMonthly: '£250 / mo per 100 subs',
    badgeAccent: 'Halal Verified',
    theme: {
      accentColor: '#10B981',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-800',
      borderActive: 'border-emerald-500 ring-2 ring-emerald-500/20',
    },
  },
  {
    id: 'fanscanr',
    name: 'FanScanr Sports',
    tagline: 'Premier League Matchday Sentiment & Squad Pulse',
    description: 'Real-time social sentiment tracker capturing live matchday emotions, manager approval ratings, and transfer buzz for football media and podcasts.',
    category: 'Sports & Media AI',
    commission: '20% Recurring Lifetime',
    commissionType: 'recurring',
    rateNumber: 0.20,
    url: 'https://ftracker.innotek.global',
    logo: '/logos/fanscanr.png',
    targetAudience: 'Football fan channels, football podcast hosts, sports journalists, fantasy league & betting enthusiasts',
    conversionHooks: [
      'Live emotion graph during Premier League and Champions League fixtures.',
      'Identify squad sentiment drops before mainstream media headlines.',
      'Automated matchday infographics for social media content creators.',
    ],
    keyFeatures: ['Live 90-minute emotion pulse stream', 'Player squad sentiment rankings', 'Transfer rumor buzz metric'],
    aov: '£19 / month',
    projectedMonthly: '£380 / mo per 100 subs',
    badgeAccent: 'Premier League Pulse',
    theme: {
      accentColor: '#22C55E',
      badgeBg: 'bg-green-50',
      badgeText: 'text-green-800',
      borderActive: 'border-green-500 ring-2 ring-green-500/20',
    },
  },
  {
    id: 'talentscanr',
    name: 'TalentScanr AI',
    tagline: 'Semantic CV Scoring & Blind ATS Screening',
    description: 'Autonomous CV parsing and candidate ranking engine designed to streamline HR pipelines, eliminate hiring bias, and generate interview scorecards.',
    category: 'HR Tech & Enterprise ATS',
    commission: '20% Recurring Lifetime',
    commissionType: 'recurring',
    rateNumber: 0.20,
    url: 'https://talent.innotek.global',
    logo: '/logos/talentscanr.png',
    targetAudience: 'Recruitment agencies, HR departments, talent acquisition leaders, fast-growing tech startups',
    conversionHooks: [
      'Screen 1,000+ candidate CVs against job specs in under 60 seconds.',
      'Automated anti-bias blind screening mode for fair enterprise hiring.',
      'Generates customized technical interview question guides per candidate.',
    ],
    keyFeatures: ['Vector semantic CV embedding match', 'Automated blind screening mode', 'Custom interview scorecard generator'],
    aov: '£99 / month',
    projectedMonthly: '£1,980 / mo per 100 subs',
    badgeAccent: 'Enterprise ATS',
    theme: {
      accentColor: '#4F46E5',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-800',
      borderActive: 'border-indigo-600 ring-2 ring-indigo-600/20',
    },
  },
  {
    id: 'callscanr',
    name: 'CallScanr',
    tagline: 'Sub-300ms Voice AI Telephony & Receptionist',
    description: 'Ultra-low latency conversational voice AI bots handling inbound clinic appointments, dispatch services, and real-time CRM integration.',
    category: 'Voice AI & Telephony',
    commission: '15% Recurring Lifetime',
    commissionType: 'recurring',
    rateNumber: 0.15,
    url: 'https://voice.innotek.global',
    logo: '/logos/callscanr.png',
    targetAudience: 'Dental & medical clinics, local services, real estate brokerages, customer support call centers',
    conversionHooks: [
      '24/7 human-like voice receptionist answering missed calls instantly.',
      'Books appointments directly into Google Calendar, Outlook, or CRM.',
      'Sub-300ms latency feels completely natural with zero awkward pauses.',
    ],
    keyFeatures: ['Sub-300ms audio streaming latency', 'Direct SIP trunk & PSTN integration', 'Automated calendar booking engine'],
    aov: '£149 / month',
    projectedMonthly: '£2,235 / mo per 100 subs',
    badgeAccent: 'Sub-300ms Audio',
    theme: {
      accentColor: '#6366F1',
      badgeBg: 'bg-purple-50',
      badgeText: 'text-purple-800',
      borderActive: 'border-purple-600 ring-2 ring-purple-600/20',
    },
  },
  {
    id: 'aqiscanr',
    name: 'AQIScanr AI',
    tagline: 'Hyper-Local Microclimate Air Quality Forecasting',
    description: 'Environmental intelligence platform providing street-level pollution forecasts, asthma risk alerts, and clean-air jogging routing.',
    category: 'Climate & CleanTech',
    commission: '20% Recurring Lifetime',
    commissionType: 'recurring',
    rateNumber: 0.20,
    url: 'https://aqiscanr.innotek.global',
    logo: '/logos/aqiscanr.svg',
    targetAudience: 'Urban runners, cyclists, families with respiratory sensitivities, smart city researchers',
    conversionHooks: [
      'Street-level 50m resolution shows clean-air walking routes.',
      'Hourly PM2.5 and Ozone pollution spike alerts before leaving home.',
      'Personalized health advisories based on local environmental sensors.',
    ],
    keyFeatures: ['Hyper-local 50m microclimate grid', 'Hourly PM2.5 & NO2 pollution forecast', 'Clean-air navigation algorithm'],
    aov: '£7.99 / month',
    projectedMonthly: '£160 / mo per 100 subs',
    badgeAccent: 'CleanTech Weather',
    theme: {
      accentColor: '#06B6D4',
      badgeBg: 'bg-cyan-50',
      badgeText: 'text-cyan-800',
      borderActive: 'border-cyan-500 ring-2 ring-cyan-500/20',
    },
  },
];

export function ProductShowcase() {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(PRODUCTS[0]);
  const [copied, setCopied] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCopyLink = () => {
    const link = `${selectedProduct.url}/?ref=YOUR_PARTNER_CODE`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="products" className="relative py-16 sm:py-24 bg-[#EFF3EC] pattern-grid border-y border-[#D8E1D6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8E1D6] bg-white px-4 py-1.5 text-xs font-mono font-bold text-black mb-3 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>INTERACTIVE MULTI-PRODUCT MATRIX</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
            Inspect Promotion Engine by Product
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Select or swipe your target software application below to reveal conversion hooks, commission economics, and instant promotion tools.
          </p>
        </div>

        {/* STEP 1: Horizontal Scrollable Product Selector Carousel */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-600">
              Step 1: Choose Application ({PRODUCTS.length} Available AI Products)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D8E1D6] bg-white text-black hover:bg-neutral-100 transition shadow-xs"
                title="Scroll Left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D8E1D6] bg-white text-black hover:bg-neutral-100 transition shadow-xs"
                title="Scroll Right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Carousel Track with Authentic Product Logos */}
          <div
            ref={carouselRef}
            className="flex gap-3.5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
          >
            {PRODUCTS.map((prod) => {
              const isSelected = selectedProduct.id === prod.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`flex flex-col items-center justify-between p-4 rounded-xl text-center shrink-0 w-44 sm:w-48 transition-all duration-200 relative ${
                    isSelected
                      ? `bg-white border-2 border-black shadow-md ${prod.theme.borderActive}`
                      : 'bg-white/90 border border-[#D8E1D6] hover:bg-white hover:border-neutral-400 shadow-xs'
                  }`}
                >
                  {/* Selected Micro-Badge */}
                  {isSelected && (
                    <span className="absolute -top-2.5 bg-black text-white font-mono text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-xs tracking-wider">
                      SELECTED
                    </span>
                  )}

                  {/* Logo Badge - Clean High-Contrast Container */}
                  <div className="h-14 w-14 rounded-xl bg-white border border-neutral-200 p-2 flex items-center justify-center shadow-xs mb-3">
                    <img src={prod.logo} alt={prod.name} className="h-full w-full object-contain" />
                  </div>

                  {/* Product Title */}
                  <div className="w-full">
                    <h3 className="font-display text-sm font-extrabold text-[#111827] truncate">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">
                      {prod.category}
                    </p>
                  </div>

                  {/* Commission Pill */}
                  <div className="mt-3 w-full">
                    <span className={`block font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-neutral-200 ${prod.theme.badgeBg} ${prod.theme.badgeText} truncate`}>
                      {prod.commission.split(' ')[0]} {prod.commission.split(' ')[1]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Interactive Detailed Product Inspection Deck Below */}
        <div className="rounded-2xl border border-[#D8E1D6] bg-white p-6 sm:p-10 shadow-md">
          
          {/* Deck Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EFF3EC]">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white border border-neutral-200 p-2 shadow-sm flex items-center justify-center shrink-0">
                <img src={selectedProduct.logo} alt={selectedProduct.name} className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-neutral-500 uppercase">
                    Step 2: Inspecting Promotion Profile
                  </span>
                  <span className={`rounded px-2.5 py-0.5 text-xs font-mono font-bold ${selectedProduct.theme.badgeBg} ${selectedProduct.theme.badgeText}`}>
                    {selectedProduct.badgeAccent}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111827] mt-0.5">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-neutral-600 mt-0.5">
                  {selectedProduct.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={selectedProduct.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8E1D6] bg-[#FAFAF4] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#111827] hover:bg-[#EFF3EC] transition"
              >
                <span>Live Website</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* 4-Box Technical Inspection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
            
            {/* Box 1: Commission Economics & Attribution */}
            <div className="lg:col-span-6 rounded-xl border border-[#D8E1D6] bg-[#FAFAF4] p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
                <Coins className="h-4 w-4 text-[#10B981]" />
                <span>COMMISSION ECONOMICS &amp; ATTRIBUTION</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="rounded-lg bg-white p-3.5 border border-[#D8E1D6]">
                  <span className="text-neutral-500 text-[11px] block uppercase">Commission Payout</span>
                  <strong className="text-base font-extrabold text-[#111827] block mt-0.5">{selectedProduct.commission}</strong>
                  <span className="text-[11px] text-neutral-500">Tier scale up to 30%</span>
                </div>
                <div className="rounded-lg bg-white p-3.5 border border-[#D8E1D6]">
                  <span className="text-neutral-500 text-[11px] block uppercase">Average Order Value</span>
                  <strong className="text-base font-extrabold text-[#111827] block mt-0.5">{selectedProduct.aov}</strong>
                  <span className="text-[11px] text-neutral-500">High recurring retention</span>
                </div>
                <div className="rounded-lg bg-white p-3.5 border border-[#D8E1D6]">
                  <span className="text-neutral-500 text-[11px] block uppercase">Cookie Attribution</span>
                  <strong className="text-sm font-extrabold text-[#111827] block mt-0.5">60 Days Active</strong>
                  <span className="text-[11px] text-neutral-500">1st-party domain link</span>
                </div>
                <div className="rounded-lg bg-white p-3.5 border border-[#D8E1D6]">
                  <span className="text-neutral-500 text-[11px] block uppercase">Clearance Buffer</span>
                  <strong className="text-sm font-extrabold text-[#111827] block mt-0.5">14 Days Holding</strong>
                  <span className="text-[11px] text-neutral-500">Auto refund protection</span>
                </div>
              </div>

              <div className="rounded-lg bg-white p-3 border border-[#D8E1D6] flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-600">Estimated Yield (100 Active Users):</span>
                <span className="font-mono font-extrabold text-[#10B981] text-sm">{selectedProduct.projectedMonthly}</span>
              </div>
            </div>

            {/* Box 2: 1-Click Referral Link Generator */}
            <div className="lg:col-span-6 rounded-xl border border-[#D8E1D6] bg-[#FAFAF4] p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
                <Share2 className="h-4 w-4 text-[#10B981]" />
                <span>INSTANT 1-CLICK PROMOTION LINK</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Embed your unique tracking link in YouTube video descriptions, comparison reviews, blogs, or newsletters:
              </p>

              <div className="flex items-center gap-2 rounded-lg border border-[#D8E1D6] bg-white p-2">
                <Globe className="h-4 w-4 text-neutral-400 shrink-0 ml-1" />
                <input
                  type="text"
                  readOnly
                  value={`${selectedProduct.url}/?ref=YOUR_PARTNER_CODE`}
                  className="flex-1 min-w-0 font-mono text-xs sm:text-sm text-[#111827] bg-transparent outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-md bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="font-mono text-[11px] font-bold text-neutral-500 uppercase block">
                  Core AI Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.keyFeatures.map((feat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md bg-white border border-[#D8E1D6] px-2.5 py-1 text-xs font-medium text-neutral-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Box 3: High-Converting Audience & Promotion Hooks */}
            <div className="lg:col-span-12 rounded-xl border border-[#D8E1D6] bg-[#FAFAF4] p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
                <Target className="h-4 w-4 text-[#10B981]" />
                <span>TARGET AUDIENCE &amp; PROVEN CONVERSION HOOKS</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-700">
                <strong>Best Demographic to Target:</strong> {selectedProduct.targetAudience}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {selectedProduct.conversionHooks.map((hook, idx) => (
                  <div key={idx} className="rounded-lg bg-white p-3.5 border border-[#D8E1D6] flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-700 leading-snug">{hook}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
