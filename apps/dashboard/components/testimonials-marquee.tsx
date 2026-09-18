'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/scroll-reveal';

interface Testimonial {
  badge: string;
  badgeBg: string;
  quote: React.ReactNode;
  author: string;
  role: string;
}

const ROW1_AFFILIATES: Testimonial[] = [
  {
    badge: 'AFFILIATE PARTNER',
    badgeBg: 'bg-[#181E2C]',
    quote: (
      <>
        &ldquo;Promoting MoodScanr AI and AI Headshot Pro generated over <strong>£2,800 in recurring commissions</strong> in the first 60 days. The conversion rates are unreal.&rdquo;
      </>
    ),
    author: 'Phil S.',
    role: 'YouTube Creator & Tech Reviewer',
  },
  {
    badge: 'CREATOR & INFLUENCER',
    badgeBg: 'bg-black',
    quote: (
      <>
        &ldquo;I have tried dozens of affiliate programs in SaaS. Innotek is <strong>super user-friendly, simple to use, and offers 7 active apps</strong> with reliable monthly bank wires.&rdquo;
      </>
    ),
    author: 'Padam J.',
    role: 'Digital Marketing Strategist',
  },
  {
    badge: 'TECH PUBLISHER',
    badgeBg: 'bg-[#181E2C]',
    quote: (
      <>
        &ldquo;I really like how well structured it is. <strong>I find tracking codes in seconds</strong>. Reading and understanding my earnings performance was never this transparent.&rdquo;
      </>
    ),
    author: 'Olivera L.',
    role: 'B2B Tech Influencer',
  },
  {
    badge: 'AFFILIATE PARTNER',
    badgeBg: 'bg-black',
    quote: (
      <>
        &ldquo;Our goal is to build recurring software revenue, and Innotek provides <strong>easy, reliable tracking across YouTube and blogs</strong> with zero setup friction.&rdquo;
      </>
    ),
    author: 'Nick S.',
    role: 'AI Tech Reviewer & Publisher',
  },
  {
    badge: 'MEDIA CONSULTANT',
    badgeBg: 'bg-[#181E2C]',
    quote: (
      <>
        &ldquo;Innotek is the perfect platform for affiliate marketers to <strong>earn money that is recurring as long as the customer stays active</strong>.&rdquo;
      </>
    ),
    author: 'Amir M.',
    role: 'Software Consultant & Affiliate',
  },
  {
    badge: 'AI CREATOR',
    badgeBg: 'bg-black',
    quote: (
      <>
        &ldquo;Tracking link generation takes 2 clicks. The <strong>pre-made YouTube description kits and video demo hooks</strong> boosted my click-through rate significantly.&rdquo;
      </>
    ),
    author: 'Sarah Lin',
    role: 'TikTok AI Channel Creator',
  },
];

const ROW2_AFFILIATES: Testimonial[] = [
  {
    badge: 'AFFILIATE PARTNER',
    badgeBg: 'bg-black',
    quote: (
      <>
        &ldquo;The 60-day first-party domain cookie has made a massive difference. <strong>Even when followers convert a month later</strong>, my commission is locked in.&rdquo;
      </>
    ),
    author: 'Jessica Thorne',
    role: 'AI Tech Blogger & Creator',
  },
  {
    badge: 'DIGITAL PUBLISHER',
    badgeBg: 'bg-[#181E2C]',
    quote: (
      <>
        &ldquo;NET-15 automated settlements straight to my UK bank account without having to file manual support tickets. <strong>Best affiliate UX in SaaS</strong>.&rdquo;
      </>
    ),
    author: 'Leon K.',
    role: 'Digital Publisher & Media Lead',
  },
  {
    badge: 'NEWSLETTER CREATOR',
    badgeBg: 'bg-black',
    quote: (
      <>
        &ldquo;Having 7 high-demand AI tools under one master affiliate code means I can <strong>recommend different software to different audience segments</strong> easily.&rdquo;
      </>
    ),
    author: 'Elena Rostova',
    role: 'Newsletter Creator & Growth Partner',
  },
  {
    badge: 'AFFILIATE MARKETER',
    badgeBg: 'bg-[#181E2C]',
    quote: (
      <>
        &ldquo;The 14-day clearance buffer protects our payout ledger, and <strong>commissions hit our bank like clockwork</strong> on the 15th of every month.&rdquo;
      </>
    ),
    author: 'David Craig',
    role: 'SaaS Affiliate Marketer',
  },
  {
    badge: 'ENTERPRISE PARTNER',
    badgeBg: 'bg-black',
    quote: (
      <>
        &ldquo;Recommending TalentScanr AI to HR tech buyers was seamless. <strong>20% lifetime recurring commission on an enterprise subscription</strong> adds up fast.&rdquo;
      </>
    ),
    author: 'Alexander Wright',
    role: 'B2B Software Consultant',
  },
  {
    badge: 'AFFILIATE PARTNER',
    badgeBg: 'bg-[#181E2C]',
    quote: (
      <>
        &ldquo;The multi-product architecture allows our channels to refer users across the whole suite. <strong>Attribution is seamless and 100% accurate</strong>.&rdquo;
      </>
    ),
    author: 'Marcus Vance',
    role: 'Video Creator & Reviewer',
  },
];

export function TestimonialsMarquee() {
  return (
    <section className="py-20 sm:py-28 bg-transparent border-b border-neutral-200 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header (PartnerStack Style) */}
        <ScrollReveal direction="up" delay={50} duration={650} className="text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">
            WHAT OUR AFFILIATES SAY
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#09090B] tracking-tight">
            Loved by AI creators &amp; affiliates
          </h2>
          <div className="mt-2.5">
            <Link
              href="/register"
              className="font-mono text-xs sm:text-sm font-bold text-black hover:underline inline-flex items-center gap-1.5"
            >
              <span>Join over 2,800+ active partners earning recurring payouts</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* 2-Row Continuous Seamless Infinite Auto-Scrolling Marquee */}
        <ScrollReveal direction="up" delay={150} duration={750}>
          <div className="space-y-6 overflow-hidden relative">
          
          {/* Ambient Fade Mask on Left & Right */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#E5E8EC] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#E5E8EC] to-transparent z-10 pointer-events-none" />

          {/* Row 1: Affiliates & Creators - Scrolls Left Continuously */}
          <div className="overflow-hidden w-full flex">
            <div className="flex w-max animate-marquee-left">
              <div className="flex shrink-0 gap-4 pr-4">
                {ROW1_AFFILIATES.map((item, idx) => (
                  <div
                    key={`r1-a-${idx}`}
                    className="w-72 sm:w-80 shrink-0 rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div className={`${item.badgeBg} text-white px-4 py-1.5 text-[10px] font-mono font-bold tracking-wider uppercase`}>
                      {item.badge}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
                        {item.quote}
                      </p>
                      <div className="pt-3 border-t border-neutral-100">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-[#09090B]">
                          {item.author}
                        </h4>
                        <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex shrink-0 gap-4 pr-4" aria-hidden="true">
                {ROW1_AFFILIATES.map((item, idx) => (
                  <div
                    key={`r1-b-${idx}`}
                    className="w-72 sm:w-80 shrink-0 rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div className={`${item.badgeBg} text-white px-4 py-1.5 text-[10px] font-mono font-bold tracking-wider uppercase`}>
                      {item.badge}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
                        {item.quote}
                      </p>
                      <div className="pt-3 border-t border-neutral-100">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-[#09090B]">
                          {item.author}
                        </h4>
                        <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Publishers & Partners - Scrolls Right Continuously */}
          <div className="overflow-hidden w-full flex">
            <div className="flex w-max animate-marquee-right">
              <div className="flex shrink-0 gap-4 pr-4">
                {ROW2_AFFILIATES.map((item, idx) => (
                  <div
                    key={`r2-a-${idx}`}
                    className="w-72 sm:w-80 shrink-0 rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div className={`${item.badgeBg} text-white px-4 py-1.5 text-[10px] font-mono font-bold tracking-wider uppercase`}>
                      {item.badge}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
                        {item.quote}
                      </p>
                      <div className="pt-3 border-t border-neutral-100">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-[#09090B]">
                          {item.author}
                        </h4>
                        <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex shrink-0 gap-4 pr-4" aria-hidden="true">
                {ROW2_AFFILIATES.map((item, idx) => (
                  <div
                    key={`r2-b-${idx}`}
                    className="w-72 sm:w-80 shrink-0 rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div className={`${item.badgeBg} text-white px-4 py-1.5 text-[10px] font-mono font-bold tracking-wider uppercase`}>
                      {item.badge}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
                        {item.quote}
                      </p>
                      <div className="pt-3 border-t border-neutral-100">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-[#09090B]">
                          {item.author}
                        </h4>
                        <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}

