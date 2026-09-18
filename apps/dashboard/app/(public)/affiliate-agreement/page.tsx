'use client';

import Link from 'next/link';
import {
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Coins,
  Clock,
  Ban,
  Building2,
  Sparkles,
  ExternalLink,
  Zap,
  Globe,
  Check,
} from 'lucide-react';

const PRODUCTS = [
  {
    name: 'MoodScanr AI',
    rate: '20% Recurring Lifetime',
    desc: 'Autonomous video polarity and emotion engagement heatmaps for YouTube, TikTok, and brand marketing.',
    badgeColor: 'bg-[#FF2E93]/10 text-[#FF2E93] border-[#FF2E93]/30',
    accentDot: 'bg-[#FF2E93]',
  },
  {
    name: 'AI Headshot Pro',
    rate: '30% Per Sale (One-Off)',
    desc: 'Studio-grade executive LinkedIn headshots and corporate portraits generated in under 10 minutes.',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    accentDot: 'bg-amber-500',
  },
  {
    name: 'HalalScanr',
    rate: '25% Recurring Lifetime',
    desc: 'Computer vision food label scanner identifying E-numbers, halal certificates, and dietary allergens.',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    accentDot: 'bg-emerald-500',
  },
  {
    name: 'FanScanr Sports',
    rate: '20% Recurring Lifetime',
    desc: 'Premier League matchday fan emotion pulse, squad reaction metrics, and transfer sentiment analytics.',
    badgeColor: 'bg-green-500/10 text-green-700 border-green-500/30',
    accentDot: 'bg-green-500',
  },
  {
    name: 'TalentScanr AI',
    rate: '20% Recurring Lifetime',
    desc: 'Semantic CV scoring engine, blind resume screening, and automated candidate pipeline scoring for recruiters.',
    badgeColor: 'bg-neutral-900 text-white border-black',
    accentDot: 'bg-neutral-800',
  },
  {
    name: 'CallScanr',
    rate: '15% Recurring Lifetime',
    desc: 'Sub-300ms latency voice AI receptionists for automated customer appointments, dispatch, and CRM sync.',
    badgeColor: 'bg-neutral-800 text-neutral-100 border-neutral-700',
    accentDot: 'bg-neutral-700',
  },
  {
    name: 'AQIScanr AI',
    rate: '20% Recurring Lifetime',
    desc: 'Micro-climate pollution alerts, clean-air navigation routing, and hourly PM2.5 air quality forecasting.',
    badgeColor: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30',
    accentDot: 'bg-cyan-500',
  },
];

export default function AffiliateAgreementPage() {
  return (
    <div className="relative py-16 sm:py-24 bg-[#F7F4EE] pattern-dots text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header - Centered Style like MoodScanr */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5C2A5] bg-white px-4 py-1.5 text-xs sm:text-sm font-mono font-bold text-black shadow-xs mb-4">
            <FileText className="h-4 w-4 text-black" />
            <span>LEGAL &amp; PARTNER COMPLIANCE</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-black tracking-tight leading-tight">
            Affiliate Operating Agreement
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
            Enforceable operating terms, commission payout matrices, and legal attribution standards across the Innotek ecosystem.
          </p>
          <div className="mt-4 inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-neutral-600 bg-white border border-[#E0D8C8] px-4 py-1.5 rounded-full shadow-2xs">
            <span className="font-bold text-black">Effective Date:</span> September 2026 &bull; <span className="font-bold text-black">Jurisdiction:</span> England &amp; Wales
          </div>
        </div>

        {/* Top 3 Highlight Cards (Matching MoodScanr Privacy Top Feature Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1 */}
          <div className="rounded-3xl border border-[#E0D8C8] bg-white p-7 shadow-sm transition hover:-translate-y-0.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 border border-pink-200 mb-5 shadow-2xs">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-black mb-2">
              Zero Attribution Loss
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              60-day first-party cookies guarantee recurring attribution on all renewals and multi-device checkouts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-[#E0D8C8] bg-white p-7 shadow-sm transition hover:-translate-y-0.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 mb-5 shadow-2xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-black mb-2">
              14-Day Buffer Protection
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Automated holding window absorbs customer chargebacks before unlocking for monthly withdrawal.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-[#E0D8C8] bg-white p-7 shadow-sm transition hover:-translate-y-0.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 mb-5 shadow-2xs">
              <Coins className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-black mb-2">
              Up to 30% Lifetime Payout
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Promote all 7 Innotek software products under one unified master account with NET-15 settlements.
            </p>
          </div>
        </div>

        {/* Main Document Sections with Rounded Sub-item Horizontal Bars */}
        <div className="space-y-12">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                1
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-black">
                Identity of the Network Operator &amp; Legal Scope
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              This Affiliate Operating Agreement (&quot;Agreement&quot;) governs your participation in the Innotek Global Affiliate Programme. The network operator responsible for ledger attribution and settlements is:
            </p>

            <div className="ml-11 rounded-2xl border border-[#E0D8C8] bg-white p-6 shadow-sm space-y-2 text-xs sm:text-sm font-sans">
              <p className="font-bold text-black text-base">Innotek Global Ltd</p>
              <p className="text-neutral-600"><strong>Official Website:</strong> <a href="https://innotek.global" target="_blank" rel="noopener noreferrer" className="text-black font-semibold underline">https://innotek.global</a></p>
              <p className="text-neutral-600"><strong>Partner &amp; Legal Contact:</strong> <code className="font-mono text-black font-semibold">affiliate@innotek.global</code> / <code className="font-mono text-black font-semibold">legal@innotek.global</code></p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                2
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-black">
                Multi-Product Commission Schedule &amp; Rates
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              Approved partners are granted non-exclusive promotional rights across the following 7 software products:
            </p>

            {/* Horizontal Rounded Bar Cards (Exactly like MoodScanr data list) */}
            <div className="ml-11 space-y-3">
              {PRODUCTS.map((prod) => (
                <div
                  key={prod.name}
                  className="rounded-2xl border border-[#E0D8C8] bg-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-black transition"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className={`h-2.5 w-2.5 rounded-full ${prod.accentDot} mt-1.5 shrink-0`} />
                    <div>
                      <h4 className="font-display text-sm sm:text-base font-extrabold text-black uppercase tracking-wide">
                        {prod.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 leading-snug">
                        {prod.desc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 sm:text-right pl-5 sm:pl-0">
                    <span className={`inline-block font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-lg border ${prod.badgeColor}`}>
                      {prod.rate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                3
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-black">
                Prohibited Conduct &amp; Fraud Prevention
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              To protect brand equity and partner ledger authenticity, the following promotional methods are strictly banned:
            </p>

            {/* Horizontal Bar Cards for Prohibited Actions */}
            <div className="ml-11 space-y-3">
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 sm:p-5 shadow-2xs flex items-start gap-3">
                <Ban className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm sm:text-base font-extrabold text-rose-950 uppercase">
                    Self-Referrals &amp; Personal Use Discounts
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-800 mt-0.5">
                    Purchasing Innotek subscriptions for personal benefit or internal corporate use via your own affiliate links is strictly prohibited.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 sm:p-5 shadow-2xs flex items-start gap-3">
                <Ban className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm sm:text-base font-extrabold text-rose-950 uppercase">
                    PPC Trademark Bidding (Google &amp; Bing Ads)
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-800 mt-0.5">
                    Bidding on trademark keywords (e.g. &quot;MoodScanr&quot;, &quot;HalalScanr&quot;, &quot;Innotek&quot;) or coupon variations on paid search engines is disallowed.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 sm:p-5 shadow-2xs flex items-start gap-3">
                <Ban className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm sm:text-base font-extrabold text-rose-950 uppercase">
                    Automated Spam &amp; Scraped DM Outreach
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-800 mt-0.5">
                    Sending unsolicited bulk emails, automated Telegram/Discord messages, or scraping contacts without consent will result in immediate termination.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 sm:p-5 shadow-2xs flex items-start gap-3">
                <Ban className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm sm:text-base font-extrabold text-rose-950 uppercase">
                    Cookie Stuffing &amp; Hidden Zero-Pixel Iframes
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-800 mt-0.5">
                    Forcing tracking cookies through pop-unders, hidden iframes, or browser extension inject scripts is automatically flagged by our ledger auditor.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                4
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-black">
                Mandatory Disclosures (UK ASA &amp; US FTC)
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              Affiliates must prominently disclose commercial compensation in compliance with international consumer protection standards:
            </p>

            <div className="ml-11 rounded-2xl border border-[#E0D8C8] bg-white p-5 shadow-sm space-y-2">
              <span className="font-mono text-xs font-bold text-neutral-500 uppercase">Approved Disclaimer Format:</span>
              <p className="font-mono text-xs sm:text-sm text-neutral-800 italic bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E5DAC6]">
                &quot;Disclosure: Some links on this channel are affiliate links. If you purchase through my link, I may earn a commission from Innotek Global Ltd at zero extra cost to you.&quot;
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                5
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-black">
                Settlement Rails &amp; Payout Terms
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              Commissions are audited and disbursed on a monthly NET-15 cadence (around the 15th of each month) across 3 verified payout rails:
            </p>

            <div className="ml-11 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#E0D8C8] bg-white p-5 shadow-sm">
                <span className="block font-mono text-xs text-neutral-400 font-bold uppercase">UK Domestic</span>
                <span className="font-display font-extrabold text-black text-base mt-1 block">Faster Payments</span>
                <p className="text-xs text-neutral-600 mt-1">Direct UK bank transfer with Sort Code &amp; Account Number.</p>
              </div>

              <div className="rounded-2xl border border-[#E0D8C8] bg-white p-5 shadow-sm">
                <span className="block font-mono text-xs text-neutral-400 font-bold uppercase">International</span>
                <span className="font-display font-extrabold text-black text-base mt-1 block">SWIFT / IBAN Wire</span>
                <p className="text-xs text-neutral-600 mt-1">Direct cross-border settlements for global partners.</p>
              </div>

              <div className="rounded-2xl border border-[#E0D8C8] bg-white p-5 shadow-sm">
                <span className="block font-mono text-xs text-neutral-400 font-bold uppercase">Digital Rails</span>
                <span className="font-display font-extrabold text-black text-base mt-1 block">Momo / PayPal</span>
                <p className="text-xs text-neutral-600 mt-1">Instant electronic wallet payouts with £20 / $25 minimum.</p>
              </div>
            </div>
          </section>

        </div>

        {/* Bottom CTA Acceptance Card */}
        <div className="mt-20 rounded-3xl border border-black bg-black text-white p-8 sm:p-12 text-center shadow-lg relative overflow-hidden">
          <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
            Ready to become an Innotek Partner?
          </h3>
          <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto">
            Zero setup fees. Instant referral link generator. Earn up to 30% recurring commissions across 7 AI applications.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm sm:text-base font-bold text-black shadow-md hover:bg-neutral-100 transition"
            >
              <span>Accept Agreement &amp; Register</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
