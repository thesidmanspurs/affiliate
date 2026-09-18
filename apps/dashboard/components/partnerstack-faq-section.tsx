'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  linkText?: string;
  linkHref?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What does Innotek Affiliate Network do?',
    answer: 'Innotek accelerates the growth of your partner ecosystem by simplifying every step of your partnerships journey across 7 proprietary AI software tools, from instant link attribution to automated monthly payouts.',
  },
  {
    question: 'How long does it take to onboard to Innotek?',
    answer: 'Innotek partners go live with active tracking codes and promotion toolkits instantly in under 60 seconds with zero onboarding gating or approval delays.',
  },
  {
    question: 'How does the 60-day cookie guarantee work?',
    answer: 'Every referral click is tagged with a 60-day first-party domain cookie. If a visitor clicks your link and subscribes at any point within 60 days, the commission is 100% credited to your account.',
  },
  {
    question: 'How and when are partner payouts disbursed?',
    answer: 'Commissions are disbursed on a reliable monthly NET-15 schedule via direct UK Bank Wire (Faster Payments), PayPal, or Momo after an automated 14-day clearance buffer.',
  },
  {
    question: 'Are there any platform setup or monthly fees?',
    answer: 'None whatsoever. The Innotek Partner Network is 100% free with zero platform setup fees, zero monthly costs, and no minimum audience limits.',
  },
  {
    question: 'How many software products can I promote with one account?',
    answer: 'One unified Innotek master account gives you instant affiliate tracking links for all 7 active software products, including MoodScanr AI, HalalScanr, FanScanr Sports, AI Headshot Pro, TalentScanr AI, CallScanr Voice, and AQIScanr AI.',
  },
];

export function PartnerStackFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#F7F5F0] border-b border-neutral-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-black tracking-tight">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-lg text-neutral-600 font-normal">
            FAQs for partners and customers
          </p>
        </div>

        {/* Accordion FAQ List */}
        <div className="divide-y divide-neutral-300/80 border-t border-b border-neutral-300/80">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-6 sm:py-8 transition-all">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 text-left group"
                >
                  <span className="font-display text-lg sm:text-xl font-bold text-black group-hover:text-neutral-700 transition">
                    {item.question}
                  </span>
                  <span className="shrink-0 text-black">
                    {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-4 pr-8 animate-fade-in">
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Text */}
        <div className="mt-10 text-center text-xs font-mono text-neutral-500">
          <span>Still have questions? </span>
          <Link href="/register" className="font-bold text-black underline underline-offset-4 hover:text-neutral-700">
            Contact our partner success team →
          </Link>
        </div>

      </div>
    </section>
  );
}
