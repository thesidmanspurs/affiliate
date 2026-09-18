import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const TIERS = [
  {
    name: 'Standard Tier',
    rate: '20%',
    badge: 'Starter',
    requirement: '0 – 15 monthly active referrals',
    payoutTerms: 'NET-15 Settlement',
    features: [
      '20% recurring commission on subscriptions',
      '30% one-off per sale on AI Headshot Pro',
      '60-day first-party cookie attribution',
      'Standard partner media creative kits',
      'Unified multi-product tracking portal',
    ],
    highlight: false,
    scatterClass: '-rotate-0.5 hover:rotate-0',
  },
  {
    name: 'Pro Tier',
    rate: '25%',
    badge: 'Most Popular',
    requirement: '16 – 50 monthly active referrals',
    payoutTerms: 'NET-15 Priority Settlement',
    features: [
      '25% recurring commission on subscriptions',
      '35% one-off on AI Headshot Pro',
      'Custom audience promo codes (e.g. YOURNAME10)',
      'Dedicated partner success manager in London',
      'Early access to beta Innotek product launches',
      'Co-branded landing pages upon request',
    ],
    highlight: true,
    scatterClass: 'rotate-0.5 translate-y-1 hover:rotate-0',
  },
  {
    name: 'Enterprise Tier',
    rate: '30%',
    badge: 'High Volume',
    requirement: '50+ monthly active referrals or top creator',
    payoutTerms: 'Bi-Weekly / Custom Rails',
    features: [
      '30% recurring commission lifetime',
      'Custom revenue share contracts available',
      'Direct API attribution webhook integrations',
      'Sponsored video & YouTube sponsorship deals',
      'Executive Slack/Discord partner channel',
    ],
    highlight: false,
    scatterClass: '-rotate-0.5 hover:rotate-0',
  },
];

export default function AffiliateProgrammePage() {
  return (
    <div className="relative py-20 sm:py-28 bg-white text-[#111827] min-h-[calc(100vh-80px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs sm:text-sm font-mono font-bold text-black shadow-2xs mb-4">
            <Sparkles className="h-4 w-4 text-[#10B981]" />
            <span>COMMISSION ARCHITECTURE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#111827] tracking-tight">
            Transparent, Tiered Earnings
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
            Scale your monthly payouts as your referral volume expands across our 7 SaaS products.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col justify-between rounded-3xl border ${
                tier.highlight ? 'border-black shadow-lg ring-1 ring-black' : 'border-neutral-200 shadow-xs'
              } bg-white p-8 sm:p-10 transition-all duration-200 ${tier.scatterClass}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-400">{tier.name}</span>
                  <span
                    className={`rounded px-3 py-1 text-xs sm:text-sm font-mono font-bold ${
                      tier.highlight
                        ? 'bg-black text-white'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 my-4">
                  <span className="font-display text-5xl sm:text-6xl font-extrabold text-[#111827]">{tier.rate}</span>
                  <span className="text-sm sm:text-base font-mono font-bold text-neutral-500">Recurring</span>
                </div>

                <div className="space-y-2.5 py-4 border-y border-neutral-100 text-xs sm:text-sm font-mono text-neutral-600">
                  <p><strong>Volume:</strong> {tier.requirement}</p>
                  <p><strong>Payouts:</strong> {tier.payoutTerms}</p>
                </div>

                <ul className="mt-6 space-y-3.5">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-neutral-700 leading-snug">
                      <CheckCircle2 className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100">
                <Link
                  href="/register"
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm sm:text-base font-bold transition shadow-xs ${
                    tier.highlight
                      ? 'bg-black text-white hover:bg-neutral-800 shadow-md'
                      : 'bg-white text-black hover:bg-neutral-50 border border-neutral-200'
                  }`}
                >
                  <span>Apply for {tier.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
