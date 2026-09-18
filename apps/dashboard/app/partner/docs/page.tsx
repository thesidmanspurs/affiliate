'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Globe,
  DollarSign,
  Clock,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Search,
  Lock,
  Share2,
  Link2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';

const SECTIONS = [
  { id: 'overview', title: '1. Overview & Ecosystem' },
  { id: 'tracking', title: '2. Link Attribution & Cookies' },
  { id: 'commissions', title: '3. Commission Structure & Tiers' },
  { id: 'payouts', title: '4. Settlement & 14-Day Hold' },
  { id: 'tax-compliance', title: '5. UK HMRC & IRS Tax Rules' },
  { id: 'advertising-ethics', title: '6. ASA & FTC Ad Disclosure' },
];

const INNOTEK_COMMISSIONS = [
  { slug: 'moodscanr', name: 'MoodScanr AI', type: 'Recurring SaaS', rate: '20% Lifetime', domain: '.moodscanr.ai', payoutFreq: 'Monthly' },
  { slug: 'halalscanr', name: 'HalalScanr', type: 'Recurring & Credits', rate: '25% Lifetime', domain: '.halalscanr.innotek.global', payoutFreq: 'Monthly' },
  { slug: 'fanscanr', name: 'FanScanr Sports', type: 'Recurring SaaS', rate: '20% Lifetime', domain: '.fanscanr.innotek.global', payoutFreq: 'Monthly' },
  { slug: 'headshot', name: 'AI Headshot Pro', type: 'One-Time Credit Pack', rate: '30% Per Sale', domain: '.headshot.innotek.global', payoutFreq: 'Monthly' },
  { slug: 'talentscanr', name: 'TalentScanr', type: 'B2B Enterprise SaaS', rate: '20% Lifetime', domain: '.talentscanr.innotek.global', payoutFreq: 'Monthly' },
  { slug: 'voice-agent', name: 'Voice AI Gateway', type: 'Usage-Based Metered', rate: '15% Lifetime', domain: '.voice.innotek.global', payoutFreq: 'Monthly' },
  { slug: 'aqiscanr', name: 'AQIScanr Environmental', type: 'API Key & Subscription', rate: '20% Lifetime', domain: '.aqiscanr.innotek.global', payoutFreq: 'Monthly' },
];

export default function PartnerDocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [customCode, setCustomCode] = useState('PARTNERVIP');
  const [selectedProduct, setSelectedProduct] = useState('moodscanr');

  // Robust Smooth Scroll to Section Handler
  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(sectionId);
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Near bottom of document, activate last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 250) {
        setActiveSection('advertising-ethics');
        return;
      }

      const scrollPosition = window.scrollY + 140;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const generatedUrl = `https://${selectedProduct}.innotek.global?ref=${customCode || 'YOUR_CODE'}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setCopiedToast(true);
    setTimeout(() => {
      setCopiedLink(false);
      setCopiedToast(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans antialiased selection:bg-zinc-900 selection:text-white relative">
      {/* Fixed Toast Notification on Successful Copy */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-zinc-950 text-white border border-zinc-800 shadow-2xl text-xs font-mono animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-zinc-100">Copied successfully!</span>
        </div>
      )}

      {/* Top Black & White Documentation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logos/innotek.png"
                alt="Innotek Logo"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logos/innotek-logo.svg';
                }}
              />
              <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-zinc-950">
                Affiliate Partner Documentation
              </span>
            </Link>
            <span className="h-5 w-px bg-zinc-300 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-800 bg-zinc-100 px-2.5 py-0.5 rounded border border-zinc-200 shrink-0">
              <Share2 className="h-3.5 w-3.5 text-zinc-950" />
              Partner Guide v1.4.0
            </span>
          </div>

          {/* Quick Search Bar */}
          <div className="hidden md:flex items-center relative flex-1 max-w-sm mx-4">
            <Search className="h-4 w-4 absolute left-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search partner guides, commission tiers, tax rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-md border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-950 focus:bg-white transition"
            />
          </div>

          {/* Header Right Status Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-zinc-200 bg-zinc-50 text-xs font-mono text-zinc-700">
              {/* <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
              <span>Partner Specs &bull; Public</span> */}
            </div>
          </div>
        </div>
      </header>

      {/* 3-Column Layout: Left Sidebar (w-64), Center Docs Body (flex-1), Right TOC (w-56) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 py-8">
        
        {/* Left Column: Fixed Navigation Sidebar (Exactly w-64 / 256px) */}
        <aside className="w-64 shrink-0 hidden lg:block sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto pr-4 text-xs font-medium text-zinc-600 border-r border-zinc-200">
          <div className="pb-3 mb-3 border-b border-zinc-200">
            <span className="font-mono uppercase text-xs font-bold text-zinc-900 tracking-wider block mb-1">
              Partner Knowledge Base
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Official operating specifications for publishers, affiliate partners, and media agencies.
            </p>
          </div>

          <nav className="space-y-1">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={(e) => scrollToSection(e, sec.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md transition cursor-pointer text-xs font-semibold ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950'
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-white shrink-0 ml-1.5" />}
                </a>
              );
            })}
          </nav>

          <div className="mt-6 pt-5 border-t border-zinc-200 space-y-3">
            <span className="font-mono uppercase text-xs font-bold text-zinc-900 tracking-wider block">
              Direct Support
            </span>
            <div className="p-2.5 rounded-md border border-zinc-200 bg-zinc-50 space-y-1 text-xs">
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Questions regarding tax compliance, custom rates, or higher VIP tier qualification?
              </p>
              <a
                href="mailto:affiliates@innotek.global"
                className="inline-flex items-center gap-1 text-xs font-bold text-zinc-950 hover:underline pt-0.5"
              >
                <span>affiliates@innotek.global</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </aside>

        {/* Center Column: Documentation Body */}
        <main className="flex-1 min-w-0 max-w-4xl space-y-12 pb-48">
          
          {/* Breadcrumbs & Header */}
          <div className="space-y-3 pb-6 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <span>Innotek Tech Docs</span>
              <span>/</span>
              <span>Affiliate Ecosystem</span>
              <span>/</span>
              <span className="text-zinc-950 font-bold">Partner Operating Guidelines</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
              Innotek Affiliate Partner Documentation
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              Comprehensive reference guide for affiliate attribution, commission structures, 14-day clearance holds, statutory tax self-certification (UK HMRC DAC7 / W-8BEN), and ASA advertising compliance covenants.
            </p>
          </div>

          {/* Section 1: Ecosystem Overview */}
          <section id="overview" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  1. Ecosystem Overview &amp; Multi-Product Attribution
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  One partner link activates lifetime commissions across our entire SaaS portfolio
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed font-normal">
              Innotek operates an integrated portfolio of 7 artificial intelligence and software-as-a-service platforms, ranging from social sentiment scanners (<code className="bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-xs text-zinc-900">MoodScanr</code>) to automated executive headshot generators (<code className="bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-xs text-zinc-900">AI Headshot Pro</code>) and conversational voice agents.
            </p>

            {/* Monochrome Best Practice Callout */}
            <div className="rounded-md border-l-4 border-zinc-950 bg-zinc-100/70 p-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 text-sm">
                <CheckCircle2 className="h-4 w-4 text-zinc-950 shrink-0" />
                <span>Multi-Product Global Attribution Guarantee</span>
              </div>
              <p className="text-zinc-700 leading-relaxed text-xs">
                When a user enters the Innotek ecosystem through your referral link for one product (e.g. MoodScanr), cross-domain attribution cookies ensure you receive commission credit if they purchase subscription passes for complementary Innotek products within the active 30-day window.
              </p>
            </div>
          </section>

          {/* Section 2: Link Attribution & Cookies */}
          <section id="tracking" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  2. Link Attribution &amp; 30-Day Cookie Window
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  URL formatting standards, cookie persistence rules, and referral link generation
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">
              Innotek employs a strict <strong>30-day first/last-touch cookie tracking model</strong>. Every referral link is formatted with the URL query parameter <code className="bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-xs font-bold text-zinc-900">?ref=YOUR_CODE</code>.
            </p>

            {/* Interactive Link Generator Playground */}
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-display font-bold text-sm text-zinc-950">
                  <Link2 className="h-4 w-4 text-zinc-900" />
                  <span>Affiliate Tracking Link Builder Playground</span>
                </div>
                <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-zinc-200 text-zinc-700 font-bold">
                  Live Generator
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-700 font-medium mb-1 uppercase tracking-wider text-[10px]">Target Product:</label>
                  <div className="relative">
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="appearance-none w-full rounded border border-zinc-300 bg-white px-3 py-1.5 pr-8 text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-950 cursor-pointer shadow-2xs"
                    >
                      <option value="moodscanr">MoodScanr AI (20% Recurring)</option>
                      <option value="halalscanr">HalalScanr (25% Recurring)</option>
                      <option value="fanscanr">FanScanr Sports (20% Recurring)</option>
                      <option value="headshot">AI Headshot Pro (30% Per Sale)</option>
                      <option value="talentscanr">TalentScanr AI (20% Recurring)</option>
                      <option value="voice-agent">Voice AI Gateway (15% Recurring)</option>
                      <option value="aqiscanr">AQIScanr Environmental (20% Recurring)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-medium mb-1 uppercase tracking-wider text-[10px]">Your Partner Referral Code:</label>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                    placeholder="YOUR_CODE"
                    className="w-full rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-zinc-900 outline-none focus:border-zinc-950 shadow-2xs"
                  />
                </div>
              </div>

              {/* Generated URL Box with Icon-Only Copy Button at Top-Right */}
              <div className="relative rounded-md border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-200 flex items-center justify-between">
                <span className="text-zinc-100 font-bold truncate pr-16">{generatedUrl}</span>
                
                {/* Icon-Only Copy Button */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-2 z-10">
                  {copiedLink && (
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700 text-[11px] font-mono font-medium shadow-sm animate-in fade-in">
                      Copied successfully!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedUrl)}
                    className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer border border-zinc-700/70"
                    aria-label="Copy tracking link"
                    title="Copy link to clipboard"
                  >
                    {copiedLink ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Cookie Sandboxing Callout */}
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 text-sm">
                <ShieldCheck className="h-4 w-4 text-zinc-900 shrink-0" />
                <span>Cookie Mechanics &amp; Privacy Sandboxing</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-xs">
                Our redirect engine stamps an HTTP-only, Secure cookie named <code className="bg-white px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-zinc-900 font-bold">innotek_aff_ref</code> carrying a cryptographic attribution hash. It respects modern browser Intelligent Tracking Prevention (ITP) and persists across all Innotek subdomains for 30 calendar days.
              </p>
            </div>
          </section>

          {/* Section 3: Commission Structure */}
          <section id="commissions" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  3. Commission Structure &amp; Tier Models
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  Industry-leading recurring SaaS shares and high-ticket one-time payouts
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">
              Innotek supports two primary commission structures designed to generate reliable passive cash flow:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-950">
                  <Sparkles className="h-4 w-4 text-zinc-900" />
                  <span>Recurring SaaS (Lifetime Revenue Share)</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  Earn <strong>15% to 25% monthly recurring commission</strong> for the lifetime of every active subscriber you refer. As long as the customer maintains their subscription, you get paid every month.
                </p>
              </div>

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-950">
                  <Award className="h-4 w-4 text-zinc-900" />
                  <span>One-Time Packages (High Bounty)</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  For credit packages and digital goods (e.g. AI Headshot Pro photo packs), receive a high-velocity <strong>30% instant payout</strong> per settled transaction.
                </p>
              </div>
            </div>

            {/* Product Commission Registry Table */}
            <div className="rounded-md border border-zinc-200 overflow-hidden text-xs">
              <div className="bg-zinc-100 px-4 py-2.5 font-mono text-[11px] font-bold text-zinc-900 uppercase border-b border-zinc-200">
                Standard Commission Rates by Product
              </div>
              <div className="divide-y divide-zinc-200 bg-white">
                {INNOTEK_COMMISSIONS.map((item) => (
                  <div key={item.slug} className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                    <div>
                      <strong className="font-display text-xs font-bold text-zinc-950 block">{item.name}</strong>
                      <span className="text-[10px] font-mono text-zinc-500">{item.slug}</span>
                    </div>
                    <div className="text-zinc-600 font-medium">{item.type}</div>
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded bg-zinc-900 text-white font-mono font-bold text-[11px]">
                        {item.rate}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 sm:text-right">
                      Scope: {item.domain}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4: Settlement & 14-Day Hold */}
          <section id="payouts" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  4. Settlement Schedule &amp; 14-Day Clearance Hold
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  Automated payout cadence, dispute buffers, and global bank rails
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">
              To prevent chargeback clawbacks and protect ecosystem integrity, all commissions enter a mandatory <strong>14-day clearance hold</strong> before becoming payable.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-md border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-mono font-bold text-[11px] text-zinc-900 uppercase">1. Sale Recorded</div>
                <p className="text-zinc-600 leading-relaxed">
                  Referral transaction clears payment processor. Commission moves to <code className="font-mono bg-white px-1 py-0.5 rounded border border-zinc-200">Pending Hold</code>.
                </p>
              </div>

              <div className="p-4 rounded-md border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-mono font-bold text-[11px] text-zinc-900 uppercase">2. 14-Day Window</div>
                <p className="text-zinc-600 leading-relaxed">
                  Customer 14-day statutory money-back window elapses without chargebacks or refund requests.
                </p>
              </div>

              <div className="p-4 rounded-md border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-mono font-bold text-[11px] text-zinc-900 uppercase">3. Payout Dispatched</div>
                <p className="text-zinc-600 leading-relaxed">
                  Balance shifts to <code className="font-mono bg-white px-1 py-0.5 rounded border border-zinc-200">Cleared Balance</code> and is paid on the 1st of the calendar month.
                </p>
              </div>
            </div>

            {/* Payment Rails Specs */}
            <div className="rounded-md border border-zinc-200 overflow-hidden text-xs">
              <div className="bg-zinc-100 px-4 py-2.5 font-mono text-[11px] font-bold text-zinc-900 uppercase border-b border-zinc-200">
                Supported Payout Methods &amp; Minimum Thresholds
              </div>
              <div className="divide-y divide-zinc-200 bg-white">
                <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900">Minimum Payout</span>
                  <span className="sm:col-span-3 text-zinc-700">£50.00 GBP / $50.00 USD / €50.00 EUR</span>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900">Disbursement Date</span>
                  <span className="sm:col-span-3 text-zinc-700">1st business day of each calendar month (Net-14 terms)</span>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900">Supported Rails</span>
                  <span className="sm:col-span-3 text-zinc-700">Wise, UK BACS, US ACH, Stripe Connect, SEPA Euro, PayPal</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Tax Compliance */}
          <section id="tax-compliance" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  5. UK HMRC &amp; IRS Tax Compliance
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  Self-certification covenants under HMRC DAC7 and US cross-border reporting
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">
              As a UK-registered corporation (Innovation Tek Ltd, England &amp; Wales), Innotek complies strictly with statutory digital platform disclosure rules (HMRC DAC7 / OECD Model Rules).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                <div className="font-bold text-sm text-zinc-950">UK &amp; EU Resident Partners</div>
                <p className="text-zinc-600 leading-relaxed">
                  Provide your National Insurance Number (NINO), Unique Taxpayer Reference (UTR), or Corporate VAT identifier during portal onboarding.
                </p>
              </div>

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                <div className="font-bold text-sm text-zinc-950">US &amp; International Partners</div>
                <p className="text-zinc-600 leading-relaxed">
                  Must self-certify via digital Form W-8BEN (individuals) or W-8BEN-E (corporations) to establish zero UK source tax withholding under bilateral tax treaties.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Advertising Ethics & Brand Safety */}
          <section id="advertising-ethics" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  6. Advertising Ethics &amp; Brand Safety Covenants
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  Mandatory FTC, ASA, and brand bidding rules for all promotional activities
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-2 border-l-4 border-l-zinc-950">
                <div className="font-bold text-sm text-zinc-950">Mandatory Disclosure Rules</div>
                <ul className="space-y-1.5 text-zinc-600 leading-relaxed">
                  <li>&bull; Clearly disclose affiliate connections using <code className="font-mono bg-white px-1 py-0.5 rounded border border-zinc-200">#ad</code> or <code className="font-mono bg-white px-1 py-0.5 rounded border border-zinc-200">#affiliate</code>.</li>
                  <li>&bull; Place disclosure before links appear above the fold on reviews.</li>
                  <li>&bull; Only make objective claims supported by Innotek documentation.</li>
                </ul>
              </div>

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-2 border-l-4 border-l-zinc-950">
                <div className="font-bold text-sm text-zinc-950">Strictly Prohibited Practices</div>
                <ul className="space-y-1.5 text-zinc-600 leading-relaxed">
                  <li>&bull; <strong>Brand Bidding:</strong> Bidding on trademark keywords (e.g. &ldquo;MoodScanr discount&rdquo;) in Google Ads.</li>
                  <li>&bull; Unsolicited commercial email (SPAM) or deceptive cookie-stuffing.</li>
                  <li>&bull; Misleading claims regarding AI diagnostic capabilities.</li>
                </ul>
              </div>
            </div>

            {/* Footer Action Card */}
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-bold text-zinc-950">
                  Ready to start earning recurring commissions?
                </h3>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Sign in to your partner console to track clicks, view real-time conversions, and request payouts.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition shadow-xs shrink-0"
              >
                <span>Go to Partner Console</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>

        </main>

        {/* Right Column: "On this page" TOC (Fixed w-56 / 224px) */}
        <aside className="w-56 shrink-0 hidden xl:block sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto pl-4 text-xs">
          <span className="font-mono uppercase text-xs font-bold text-zinc-900 tracking-wider block mb-3">
            On this page
          </span>
          <nav className="space-y-2 border-l border-zinc-200 pl-3 text-zinc-500 font-medium">
            {SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => scrollToSection(e, sec.id)}
                className={`block transition cursor-pointer text-xs leading-snug hover:text-zinc-950 ${
                  activeSection === sec.id ? 'text-zinc-950 font-bold' : ''
                }`}
              >
                {sec.title}
              </a>
            ))}
          </nav>
        </aside>

      </div>
    </div>
  );
}
