'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'How does multi-product tracking work across the 7 Innotek products?',
    a: 'When you register for the Innotek Affiliate Programme, you receive a single master partner account. Inside your portal, you can generate unique referral links for any of our 7 products (e.g. moodscanr.ai/?ref=YOUR_CODE or headshot.innotek.global/?ref=YOUR_CODE). All clicks, conversions, and commissions across all 7 products flow into your single unified ledger.',
  },
  {
    q: 'How and when do I get paid?',
    a: 'We process payouts on a monthly NET-15 schedule (around the 15th of each month for all approved commissions from the previous period). You can withdraw via UK Faster Payments (Direct Bank Transfer with Sort Code & Account Number), International Bank Wire / IBAN, Momo, or PayPal. The minimum payout threshold is £20 / $25.',
  },
  {
    q: 'What is the 14-day refund buffer window?',
    a: 'When a customer subscribes or purchases through your link, the conversion is recorded immediately with status "PENDING". Because software purchases may be subject to customer refund or cooling-off periods, commissions are held in buffer for 14 days before being automatically transitioned to "APPROVED" and added to your withdrawable balance.',
  },
  {
    q: 'How long do referral cookies last?',
    a: 'Our tracking cookies last for 60 calendar days from the initial click on a first-party basis. If a visitor clicks your link today and subscribes 45 days later, you will still be credited with the conversion.',
  },
  {
    q: 'Are there any restrictions on promotional methods?',
    a: 'Yes. We encourage genuine reviews, YouTube tutorials, comparison guides, social content, and email newsletters. However, spamming, unsolicited mass emailing, purchasing Innotek brand trademark keywords on Google Ads (e.g. bidding on "MoodScanr coupon"), and self-referrals (buying through your own link) are strictly prohibited and will result in account suspension.',
  },
  {
    q: 'Is the programme open to international affiliates outside the UK?',
    a: 'Yes! While Innotek Global Ltd is a UK-registered enterprise, our partner programme is worldwide. We support international partners across Southeast Asia, Europe, the Americas, and the Middle East, with multi-currency conversions and international payout rails.',
  },
  {
    q: 'Can I request custom discount promo codes for my audience?',
    a: 'Yes. Affiliates on the Pro Tier (16+ referrals/month) or creators with established followings can request dedicated audience promo codes (e.g. "INNOTEK10") that link directly to your affiliate attribution.',
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="relative py-20 sm:py-28 bg-white text-[#111827] min-h-[calc(100vh-80px)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs sm:text-sm font-mono font-bold text-black shadow-2xs mb-4">
            <HelpCircle className="h-4 w-4 text-[#10B981]" />
            <span>SUPPORT &amp; GUIDANCE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#111827] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Everything you need to know about the Innotek Global Affiliate Programme, attribution logic, and payments.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all shadow-xs hover:border-neutral-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 sm:p-7 text-left cursor-pointer"
                >
                  <span className="font-display text-base sm:text-xl font-extrabold text-[#111827] pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-black transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-neutral-100 px-6 sm:px-7 pt-5 pb-7 text-sm sm:text-base text-neutral-600 leading-relaxed bg-neutral-50/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help CTA */}
        <div className="mt-16 text-center rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 shadow-xs">
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#111827] mb-2">Have a question not listed here?</h3>
          <p className="text-sm sm:text-base text-neutral-600 mb-6">Our partner operations team in London is available to assist you.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-neutral-800 transition"
            >
              <span>Join the Programme</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:support@innotek.global"
              className="text-sm sm:text-base font-mono font-bold text-neutral-700 hover:text-black hover:underline transition"
            >
              Contact support@innotek.global →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
