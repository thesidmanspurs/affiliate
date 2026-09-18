'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Globe,
  CheckCircle2,
  Lock,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  commission: string;
  commissionType: string;
  rate: string;
  aov: string;
  url: string;
  logo: string;
  targetAudience: string;
  badge: string;
  featuredColor: string;
  features: string[];
}

interface AffiliateProfile {
  id?: string;
  code: string;
  commissionRate: number;
  status?: 'ONBOARDING_REQUIRED' | 'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  email?: string;
  rejectionReason?: string;
  reapplyAfter?: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'moodscanr',
    name: 'MoodScanr AI',
    tagline: 'Autonomous Video & Comment Polarity Mapping',
    description: 'Frame-by-frame viewer emotion recognition and comment sentiment heatmaps for YouTube, TikTok, and brand marketing.',
    category: 'AI Sentiment & Video',
    commission: '20% Rec.',
    commissionType: 'recurring',
    rate: '20%',
    aov: '$29 / mo',
    url: 'https://moodscanr.ai',
    logo: '/logos/moodscanr.png',
    targetAudience: 'YouTube creators, TikTok influencers, brand agencies, marketing teams',
    badge: 'Popular',
    featuredColor: 'border-pink-500',
    features: ['Frame-by-frame emotion timeline', 'Comment heatmaps & polarity graphs', 'Multi-lingual transcript NLP analysis'],
  },
  {
    id: 'headshot',
    name: 'Headshoot AI',
    tagline: 'Studio-Grade Executive AI Corporate Portraits',
    description: 'Generates photorealistic LinkedIn portraits and executive headshots with 4K studio lighting in under 10 minutes.',
    category: 'Generative AI Studio',
    commission: '30% Per Sale',
    commissionType: 'per_sale',
    rate: '30%',
    aov: '$35 / pack',
    url: 'https://headshot.innotek.global',
    logo: '/logos/headshot.png',
    targetAudience: 'Job seekers, LinkedIn professionals, real estate agents, freelancers, corporate teams',
    badge: 'Top Payout',
    featuredColor: 'border-amber-500',
    features: ['4K executive lighting presets', 'Natural skin texture preservation', '10-minute automated turnaround'],
  },
  {
    id: 'halalscanr',
    name: 'HalalScanr',
    tagline: 'Dietary E-Number & Ingredient OCR Scanner',
    description: 'Computer vision food label scanner identifying E-numbers, halal certificates, animal derivatives, and dietary allergens.',
    category: 'Dietary & Food OCR',
    commission: '25% Rec.',
    commissionType: 'recurring',
    rate: '25%',
    aov: '$9.99 / mo',
    url: 'https://halalscanr.innotek.global',
    logo: '/logos/halalscanr.png',
    targetAudience: 'Muslim consumers, halal supermarket shoppers, vegetarian & vegan shoppers, health-conscious families',
    badge: 'High Retention',
    featuredColor: 'border-emerald-500',
    features: ['Live camera OCR E-number parser', 'Global halal certification authority database', 'Personalized allergen alerts'],
  },
  {
    id: 'fanscanr',
    name: 'FanScanr Sports',
    tagline: 'Premier League Matchday Sentiment & Squad Pulse',
    description: 'Real-time social sentiment tracker capturing matchday emotions, manager approval ratings, and transfer buzz.',
    category: 'Sports & Media Analytics',
    commission: '20% Rec.',
    commissionType: 'recurring',
    rate: '20%',
    aov: '$19 / mo',
    url: 'https://ftracker.innotek.global',
    logo: '/logos/fanscanr.png',
    targetAudience: 'Football podcasts, fan channels, sports journalists, betting analysts',
    badge: 'Trending',
    featuredColor: 'border-green-500',
    features: ['Live 90-minute emotion pulse stream', 'Player squad sentiment rankings', 'Transfer rumor buzz metric'],
  },
  {
    id: 'talentscanr',
    name: 'TalentScanr AI',
    tagline: 'Semantic CV Scoring & Blind ATS Screening',
    description: 'Autonomous CV parsing and candidate ranking engine designed to streamline HR pipelines and eliminate hiring bias.',
    category: 'HR Tech & Enterprise ATS',
    commission: '20% Rec.',
    commissionType: 'recurring',
    rate: '20%',
    aov: '$99 / mo',
    url: 'https://talent.innotek.global',
    logo: '/logos/talentscanr.png',
    targetAudience: 'Recruitment agencies, HR departments, talent leaders, fast-growing tech startups',
    badge: 'Enterprise SaaS',
    featuredColor: 'border-indigo-500',
    features: ['Vector semantic CV embedding match', 'Automated blind screening mode', 'Custom interview scorecard generator'],
  },
  {
    id: 'callscanr',
    name: 'CallScanr',
    tagline: 'Sub-300ms Voice AI Telephony & Receptionist',
    description: 'Ultra-low latency conversational voice AI bots handling inbound appointments, dispatch services, and CRM sync.',
    category: 'Voice AI & Telephony',
    commission: '15% Rec.',
    commissionType: 'recurring',
    rate: '15%',
    aov: '$149 / mo',
    url: 'https://voice.innotek.global',
    logo: '/logos/callscanr.png',
    targetAudience: 'Dental & medical clinics, local services, real estate agencies, customer support centers',
    badge: 'Voice AI Agent',
    featuredColor: 'border-purple-500',
    features: ['Sub-300ms audio streaming latency', 'Direct SIP trunk & PSTN integration', 'Automated calendar booking engine'],
  },
  {
    id: 'aqiscanr',
    name: 'AQIScanr AI',
    tagline: 'Hyper-Local Microclimate Air Quality Forecasting',
    description: 'Environmental intelligence platform providing street-level pollution forecasts and clean-air jogging routing.',
    category: 'Climate & CleanTech',
    commission: '20% Rec.',
    commissionType: 'recurring',
    rate: '20%',
    aov: '$7.99 / mo',
    url: 'https://aqiscanr.innotek.global',
    logo: '/logos/aqiscanr.svg',
    targetAudience: 'Urban runners, cyclists, families with respiratory sensitivities, smart city researchers',
    badge: 'CleanTech',
    featuredColor: 'border-cyan-500',
    features: ['Hyper-local 50m microclimate grid', 'Hourly PM2.5 & NO2 pollution forecast', 'Clean-air navigation algorithm'],
  },
];

const CATEGORIES = [
  'All Categories',
  'AI Sentiment & Video',
  'Generative AI Studio',
  'Dietary & Food OCR',
  'Sports & Media Analytics',
  'HR Tech & Enterprise ATS',
  'Voice AI & Telephony',
  'Climate & CleanTech',
];

export function ProductsMarketplaceClient({ profile }: { profile: AffiliateProfile }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProductModal, setSelectedProductModal] = useState<ProductItem | null>(null);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isActive = profile.status === 'ACTIVE';
  const isPending = profile.status === 'PENDING_REVIEW';
  const isRejected = profile.status === 'REJECTED';

  const handleCopyLink = (prod: ProductItem) => {
    if (!isActive) {
      setLockModalOpen(true);
      return;
    }
    const link = `${prod.url}/?ref=${profile.code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(prod.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProducts = PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'All Categories' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 text-[#09090B] pb-16 font-sans">
      
      {/* Dynamic Status Warning Alert */}
      {isPending && (
        <div className="rounded-none border border-amber-300 bg-amber-50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-none bg-amber-500 text-white shrink-0">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-sm text-amber-950">
                Promotional Links Locked &bull; Application Under Compliance Review
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Your partner onboarding dossier is being verified by the Innotek Risk Team. Unique tracking parameters and media kit downloads will activate upon approval.
              </p>
            </div>
          </div>
          <Link
            href="/overview"
            className="text-xs font-bold text-amber-900 bg-white border border-amber-300 rounded-none px-3 py-1.5 hover:bg-amber-100 transition shrink-0"
          >
            Check Status
          </Link>
        </div>
      )}

      {isRejected && (
        <div className="rounded-none border border-neutral-300 bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-none bg-neutral-100 text-neutral-700 border border-neutral-200 shrink-0">
              <AlertCircle className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#09090B]">
                Promotional Links Locked &bull; Account Ineligible for Current Cohort
              </p>
              <p className="text-xs text-neutral-600 mt-0.5">
                You may update your promotional channel dossier and re-apply once your 7-day cooldown period concludes.
              </p>
            </div>
          </div>
          <Link
            href="/overview"
            className="text-xs font-bold text-neutral-900 bg-neutral-100 border border-neutral-300 rounded-none px-3 py-1.5 hover:bg-neutral-200 transition shrink-0"
          >
            Review Re-application Status
          </Link>
        </div>
      )}

      {/* 1. Header with Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              PARTNER NETWORK MARKETPLACE
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] mt-0.5">
            Explore Innotek AI Applications
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Generate customized referral links, download verified marketing kits, and earn up to 30% recurring commissions.
          </p>
        </div>

        {/* Search Box - Sharp Square */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by product, category, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-none border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#09090B] placeholder-neutral-400 outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* 2. Category Filter Tabs - Sharp Square */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            BROWSE BY DOMAIN CATEGORY
          </span>
          <button
            onClick={() => { setSelectedCategory('All Categories'); setSearchQuery(''); }}
            className="text-xs font-semibold text-black hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-none px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer border ${
                  isSelected
                    ? 'bg-black text-white font-bold border-black shadow-2xs'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CONTIGUOUS SQUARE GRID (NO ROUNDED CORNERS, EQUAL SIZED CRISP VECTOR LOGOS) */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <span className="font-display text-sm font-bold text-[#09090B] uppercase tracking-wide">
            All AI Programs ({filteredProducts.length})
          </span>
          <span className="text-xs text-neutral-500 font-medium">
            Automated Monthly NET-15 Settlements
          </span>
        </div>

        {/* The Contiguous Modular Grid Container with 1px borders touching */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-neutral-300 bg-neutral-300 gap-px rounded-none overflow-hidden">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white p-6 rounded-none flex flex-col justify-between hover:bg-neutral-50/80 transition space-y-5 group"
            >
              {/* Card Top: Uniform Large Vector Logo + Title Header */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {/* UNIFORM SIZED LARGE SQUARE LOGO BADGE (All SVGs rendered identically at 64x64px) */}
                  <div className="h-16 w-16 min-w-16 rounded-none border border-neutral-300 bg-white p-2.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-black transition">
                    <img
                      src={prod.logo}
                      alt={prod.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 border border-neutral-200 px-2 py-0.2 text-neutral-600 rounded-none">
                        {prod.category}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-extrabold text-[#09090B] tracking-tight truncate">
                      {prod.name}
                    </h3>
                    <span className="text-[11px] font-medium text-neutral-400 block mt-0.5">
                      {prod.badge}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                  {prod.description}
                </p>
              </div>

              {/* Card Bottom: Commission Box & Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Economics Strip (Square border) */}
                <div className="border border-neutral-200 bg-neutral-50 p-3 rounded-none text-xs flex items-center justify-between font-medium">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase block font-bold">Reward Payout</span>
                    <strong className="text-emerald-700 font-bold text-xs">{prod.commission}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase block font-bold">Pricing</span>
                    <strong className="text-neutral-800 font-bold text-xs">{prod.aov}</strong>
                  </div>
                </div>

                {/* Action Buttons - Sharp Square Buttons */}
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <button
                      onClick={() => handleCopyLink(prod)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-none bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer"
                    >
                      {copiedId === prod.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Link Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Get Link</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => setLockModalOpen(true)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-none bg-neutral-100 border border-neutral-300 px-4 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-200 transition cursor-pointer"
                    >
                      <Lock className="h-3.5 w-3.5 text-neutral-500" />
                      <span>Locked</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedProductModal(prod)}
                    className="rounded-none border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
                  >
                    Specs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Product Inspection Modal / Drawer - Sharp Square */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-none border border-neutral-300 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 min-w-16 rounded-none bg-white border border-neutral-300 p-2.5 flex items-center justify-center shadow-xs shrink-0">
                  <img src={selectedProductModal.logo} alt={selectedProductModal.name} className="h-full w-full object-contain" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-[#09090B]">
                    {selectedProductModal.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5 font-normal">
                    {selectedProductModal.category} &bull; {selectedProductModal.commission}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="rounded-none border border-neutral-300 p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 transition cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase block mb-1">
                  Product Overview &amp; Value Proposition
                </span>
                <p className="text-neutral-700 leading-relaxed">
                  {selectedProductModal.description}
                </p>
              </div>

              {/* Commission Stats Box */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-none border border-neutral-200 bg-neutral-50 text-xs font-medium">
                <div>
                  <span className="text-neutral-500 block">Commission Model</span>
                  <strong className="text-black text-sm">{selectedProductModal.commission}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Average Order Value (AOV)</span>
                  <strong className="text-black text-sm">{selectedProductModal.aov}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Cookie Lifespan</span>
                  <strong className="text-black">60 Days (1st-Party Domain)</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Clearance Buffer</span>
                  <strong className="text-black">14 Days Holding</strong>
                </div>
              </div>

              {/* Referral Link Generator */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-500 uppercase block">
                  Your Master Referral Link
                </span>
                {isActive ? (
                  <div className="flex items-center gap-2 rounded-none border border-neutral-300 bg-white p-2">
                    <Globe className="h-4 w-4 text-neutral-400 shrink-0 ml-1" />
                    <input
                      type="text"
                      readOnly
                      value={`${selectedProductModal.url}/?ref=${profile.code}`}
                      className="flex-1 min-w-0 font-mono text-xs text-[#09090B] bg-transparent outline-none select-all"
                    />
                    <button
                      onClick={() => handleCopyLink(selectedProductModal)}
                      className="inline-flex items-center gap-1 rounded-none bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition shrink-0 cursor-pointer"
                    >
                      {copiedId === selectedProductModal.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-none border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                    <Lock className="h-4 w-4 text-amber-700 shrink-0" />
                    <span>
                      Tracking parameters locked pending partner compliance review.
                    </span>
                  </div>
                )}
              </div>

              {/* Key Features */}
              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase block mb-1.5">
                  Core AI Capabilities to Highlight
                </span>
                <ul className="space-y-1.5">
                  {selectedProductModal.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
              <a
                href={selectedProductModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-black hover:underline"
              >
                <span>Visit Live Application</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="rounded-none bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Lock Information Modal - Sharp Square */}
      {lockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-none border border-neutral-300 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-none bg-amber-100 text-amber-800 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[#09090B]">
                  Program Promotion Access Locked
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {isPending ? 'Compliance verification is currently underway' : 'Partner account is not currently active'}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {isPending
                ? 'Your promotional channels, tax declaration, and beneficiary banking details are currently in the compliance review queue. You will receive an instant notification in your dashboard when your account is approved (typically 24–48 hours).'
                : 'Your application was not approved for this cohort. You may update your promotional details and re-apply after the 7-day cooldown period.'}
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setLockModalOpen(false)}
                className="rounded-none border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
              >
                Dismiss
              </button>
              <Link
                href="/overview"
                className="rounded-none bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
              >
                View Status Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
