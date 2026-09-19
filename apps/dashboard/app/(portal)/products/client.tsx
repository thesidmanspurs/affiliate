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
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { enrollProgramAction } from './actions';

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
  onboardingData?: any;
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
    features: ['Blind CV parsing algorithm', 'Multi-jurisdiction compliance filter', 'Automated technical skill matrix scoring'],
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

export function ProductsMarketplaceClient({
  profile,
  initialPrograms = [],
}: {
  profile: AffiliateProfile;
  initialPrograms?: any[];
}) {
  const [programsList, setProgramsList] = useState<any[]>(initialPrograms);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProductModal, setSelectedProductModal] = useState<ProductItem | null>(null);
  const [applyModalProduct, setApplyModalProduct] = useState<ProductItem | null>(null);
  const [strategyNotes, setStrategyNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isGlobalActive = profile.status === 'ACTIVE';
  const isGlobalPending = profile.status === 'PENDING_REVIEW';
  const isGlobalRejected = profile.status === 'REJECTED';

  // Tax and Channel dossier snapshots from profile
  const taxDossier = profile.onboardingData?.tax;
  const promoDossier = profile.onboardingData?.promotional;
  const hasTaxOnRecord = Boolean(
    taxDossier?.taxId ||
    taxDossier?.certificationAccepted ||
    taxDossier?.certifiedUnderPerjury ||
    taxDossier?.legalName ||
    taxDossier?.formType ||
    taxDossier?.taxForm
  );

  // Helper to find program enrollment for a product
  const getProgramInfo = (prodId: string) => {
    const slugAliases = prodId === 'callscanr' ? ['callscanr', 'voice-agent'] : [prodId];
    return programsList.find((p) => slugAliases.includes(p.productId));
  };

  // Determine enrollment status: ACTIVE, PENDING_REVIEW, AVAILABLE
  const getProgramStatus = (prod: ProductItem): 'ACTIVE' | 'PENDING_REVIEW' | 'AVAILABLE' => {
    const prog = getProgramInfo(prod.id);
    if (prog?.status === 'ACTIVE') return 'ACTIVE';
    if (prog?.status === 'PENDING_REVIEW') return 'PENDING_REVIEW';
    // Fallback: If affiliate has global ACTIVE status and no program records exist yet, treat moodscanr as active
    if (isGlobalActive && (!programsList || programsList.length === 0) && prod.id === 'moodscanr') {
      return 'ACTIVE';
    }
    return 'AVAILABLE';
  };

  const handleCopyLink = (prod: ProductItem) => {
    const link = `${prod.url}/?ref=${profile.code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(prod.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenApplyModal = (prod: ProductItem) => {
    setApplyModalProduct(prod);
    setStrategyNotes('');
    setApplyError(null);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalProduct) return;

    if (!hasTaxOnRecord) {
      setApplyError('Tax declaration must be completed first.');
      return;
    }

    setSubmittingApply(true);
    setApplyError(null);

    const apiSlug = applyModalProduct.id === 'callscanr' ? 'voice-agent' : applyModalProduct.id;
    const result = await enrollProgramAction(apiSlug, strategyNotes);

    setSubmittingApply(false);

    if (!result.ok) {
      setApplyError(result.error || 'Failed to enroll in program');
      return;
    }

    // Update local state
    const newProg = {
      productId: apiSlug,
      status: 'ACTIVE',
      enrolledAt: new Date().toISOString(),
      strategyNotes,
      linkedCompliance: {
        taxForm: taxDossier?.formType || taxDossier?.taxForm || 'W-8BEN',
        legalName: taxDossier?.legalName || taxDossier?.signedName || 'Certified Partner',
        taxId: taxDossier?.taxId ? `***${taxDossier.taxId.slice(-4)}` : 'CERTIFIED',
        taxCountry: taxDossier?.taxResidenceCountry || taxDossier?.taxCountry || 'GB',
        primaryUrl: promoDossier?.primaryUrl || promoDossier?.channelUrl || '',
      },
      performance: {
        conversionsCount: 0,
        sourcedRevenue: 0,
        earnedCommission: 0,
      },
    };

    setProgramsList((prev) => [...prev.filter((p) => p.productId !== apiSlug), newProg]);
    setApplyModalProduct(null);
  };

  const filteredProducts = PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'All Categories' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeProgramsCount = PRODUCTS.filter((p) => getProgramStatus(p) === 'ACTIVE').length;

  return (
    <div className="space-y-6 text-[#09090B] pb-16 font-sans">
      
      {/* Dynamic Status Warning Alert */}
      {isGlobalPending && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white shrink-0">
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
            className="text-xs font-bold text-amber-900 bg-white border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition shrink-0"
          >
            Check Status
          </Link>
        </div>
      )}

      {isGlobalRejected && (
        <div className="rounded-xl border border-neutral-300 bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 border border-neutral-200 shrink-0">
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
            className="text-xs font-bold text-neutral-900 bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-200 transition shrink-0"
          >
            Review Re-application Status
          </Link>
        </div>
      )}

      {/* 1. Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              PARTNER NETWORK MARKETPLACE
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] mt-0.5">
            Explore Innotek AI Applications
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Register for programs individually, link your verified tax declaration, and earn isolated recurring revenues per product.
          </p>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by product or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#09090B] placeholder-neutral-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
          />
        </div>
      </div>

      {/* 2. Program Enrollment & Revenue Separation Strip */}
      <div className="border border-neutral-200 bg-white p-4 sm:p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#09090B]">
                Separated Program Streams: {activeProgramsCount} / {PRODUCTS.length} Programs Enrolled
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md">
                Isolated Revenues
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Each AI SaaS product is tracked and settled as an independent revenue stream with linked compliance dossiers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/settings?tab=tax"
            className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition inline-flex items-center gap-1.5 shadow-2xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-neutral-600" />
            <span>{hasTaxOnRecord ? 'Tax Record Verified' : 'Complete Tax Certification'}</span>
          </Link>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
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
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer border ${
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

      {/* 4. Products Grid - Clean Card Grid (No dark gray voids!) */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <span className="font-display text-sm font-bold text-[#09090B] uppercase tracking-wide">
            Available Programs ({filteredProducts.length})
          </span>
          <span className="text-xs text-neutral-500 font-medium">
            Automated Monthly NET-15 Settlements
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => {
            const programStatus = getProgramStatus(prod);
            const progInfo = getProgramInfo(prod.id);
            const isEnrolledActive = programStatus === 'ACTIVE';
            const isProgramPending = programStatus === 'PENDING_REVIEW';
            const perf = progInfo?.performance || { sourcedRevenue: 0, conversionsCount: 0, earnedCommission: 0 };

            return (
              <div
                key={prod.id}
                className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs flex flex-col justify-between hover:border-neutral-300 hover:shadow-xs transition space-y-5 group"
              >
                {/* Card Top: Uniform Logo Badge + Title Header */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 min-w-16 rounded-lg border border-neutral-200 bg-white p-2.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-black transition">
                      <img
                        src={prod.logo}
                        alt={prod.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-neutral-600 rounded-md">
                          {prod.category}
                        </span>
                        {isEnrolledActive && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 inline" />
                            <span>Enrolled</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base font-extrabold text-[#09090B] tracking-tight truncate">
                        {prod.name}
                      </h3>
                      <span className="text-[11px] font-medium text-neutral-400 block mt-0.5">
                        {prod.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                    {prod.description}
                  </p>
                </div>

                {/* Card Bottom: Commission & Isolated Performance Strip */}
                <div className="space-y-3 pt-2">
                  {/* Economics Strip */}
                  <div className="border border-neutral-200 bg-neutral-50 p-3 rounded-lg text-xs flex items-center justify-between font-medium">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block font-bold">Reward Payout</span>
                      <strong className="text-emerald-700 font-bold text-xs">{prod.commission}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 uppercase block font-bold">Pricing</span>
                      <strong className="text-neutral-800 font-bold text-xs">{prod.aov}</strong>
                    </div>
                  </div>

                  {/* Isolated Revenue Strip for Enrolled Products */}
                  {isEnrolledActive && (
                    <div className="border border-neutral-200 bg-neutral-50/70 p-2.5 rounded-lg text-[11px] grid grid-cols-2 gap-2 text-neutral-700">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-neutral-400 block">Sourced Rev.</span>
                        <span className="font-bold text-[#09090B]">
                          ${(perf.sourcedRevenue / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-neutral-400 block">Conversions</span>
                        <span className="font-bold text-[#09090B]">
                          {perf.conversionsCount} sales
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isEnrolledActive ? (
                      <button
                        onClick={() => handleCopyLink(prod)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer shadow-2xs"
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
                    ) : isProgramPending ? (
                      <div className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 border border-amber-300 px-4 py-2.5 text-xs font-bold text-amber-800">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Pending Review</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenApplyModal(prod)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white border-2 border-black px-4 py-2 text-xs font-extrabold text-black hover:bg-black hover:text-white transition cursor-pointer shadow-2xs"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Apply to Program</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedProductModal(prod)}
                      className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition cursor-pointer shadow-2xs"
                    >
                      Specs
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Program Application Modal with Linked Tax & Content Dossiers */}
      {applyModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 min-w-14 rounded-lg bg-white border border-neutral-200 p-2 flex items-center justify-center shadow-xs shrink-0">
                  <img src={applyModalProduct.logo} alt={applyModalProduct.name} className="h-full w-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-neutral-600 rounded-md">
                    Individual Program Application
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-[#09090B] mt-1">
                    Apply to Promote {applyModalProduct.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {applyModalProduct.category} &bull; Reward: <strong className="text-emerald-700 font-bold">{applyModalProduct.commission}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApplyModalProduct(null)}
                className="text-neutral-400 hover:text-black text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {applyError && (
              <div className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs text-rose-900 font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{applyError}</span>
              </div>
            )}

            {!hasTaxOnRecord ? (
              /* Tax Required Warning State */
              <div className="border border-amber-300 bg-amber-50 p-5 rounded-xl space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-950">
                      Tax Certification Required for Program Enrollment
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      In compliance with HMRC, IRS withholding standards, and Anti-Money Laundering (AML) regulations, every partner must complete an electronic tax declaration (Form W-8BEN, W-9, or HMRC Certificate) before promotional tracking parameters can be activated.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href="/settings?tab=tax"
                    className="rounded-lg bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
                  >
                    Complete Tax Declaration Now &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              /* Verified Compliance Connection Form */
              <form onSubmit={handleApplySubmit} className="space-y-5">
                
                {/* 1. Linked Tax Certification Dossier */}
                <div className="border border-neutral-200 bg-neutral-50 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>Linked Tax Certification</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-200 rounded-md">
                      Verified On File
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Form Type</span>
                      <strong className="text-neutral-900">{taxDossier?.formType || taxDossier?.taxForm || 'W-8BEN'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Legal Signer</span>
                      <strong className="text-neutral-900 truncate block">{taxDossier?.legalName || taxDossier?.signedName || 'Certified Partner'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Residence Country</span>
                      <strong className="text-neutral-900">{taxDossier?.taxResidenceCountry || taxDossier?.taxCountry || 'United Kingdom'}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Linked Content & Promotional Channels */}
                <div className="border border-neutral-200 bg-neutral-50 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-neutral-600" />
                      <span>Linked Promotional Dossier</span>
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500">
                      Reach: {promoDossier?.monthlyReach || '5k - 25k'}
                    </span>
                  </div>
                  
                  <div className="text-xs space-y-1 pt-1">
                    <p className="text-neutral-600 truncate">
                      <strong>Primary Channel:</strong> {promoDossier?.primaryUrl || promoDossier?.channelUrl || 'Direct Creator Channel'}
                    </p>
                    <p className="text-neutral-600">
                      <strong>Distribution:</strong> {Array.isArray(promoDossier?.channelTypes || promoDossier?.channels) ? (promoDossier.channelTypes || promoDossier.channels).join(', ') : 'Tech Reviews, Video Creator'}
                    </p>
                  </div>
                </div>

                {/* 3. Product-Specific Promotional Strategy Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                    Product Promotion Strategy (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Explain how you intend to present ${applyModalProduct.name} to your target audience (e.g. YouTube dedicated tutorial, newsletter sponsor slot, software directory comparison)...`}
                    value={strategyNotes}
                    onChange={(e) => setStrategyNotes(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-xs text-[#09090B] placeholder-neutral-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                  />
                </div>

                {/* 4. Compliance Agreement */}
                <div className="border border-neutral-200 bg-white p-3.5 rounded-lg flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeProgramTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-sm border-neutral-300 text-black focus:ring-black cursor-pointer"
                  />
                  <label htmlFor="agreeProgramTerms" className="text-xs text-neutral-700 leading-snug cursor-pointer">
                    I confirm that promotional activities for <strong>{applyModalProduct.name}</strong> will adhere to FTC endorsement guides, UK ASA CAP Code disclosure requirements, and Innotek brand asset guidelines.
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalProduct(null)}
                    className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApply || !agreeTerms}
                    className="rounded-lg bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition disabled:opacity-50 cursor-pointer inline-flex items-center gap-2 shadow-2xs"
                  >
                    {submittingApply ? 'Enrolling...' : 'Submit & Activate Program'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* 6. Product Specs Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 min-w-16 rounded-lg bg-white border border-neutral-200 p-2.5 flex items-center justify-center shadow-xs shrink-0">
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
                className="rounded-lg border border-neutral-300 p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 transition cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

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
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium">
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

              {/* Key Conversion Features */}
              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase block mb-2">
                  High-Converting Selling Points
                </span>
                <ul className="space-y-1.5">
                  {selectedProductModal.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase block mb-1">
                  Target Audience Persona
                </span>
                <p className="text-xs text-neutral-600">
                  {selectedProductModal.targetAudience}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <a
                  href={selectedProductModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black hover:underline"
                >
                  <span>Visit Application Homepage</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  onClick={() => setSelectedProductModal(null)}
                  className="rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
