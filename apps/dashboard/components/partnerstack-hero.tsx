'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function PartnerStackHero() {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-transparent border-b border-neutral-200/80">
      
      {/* Background Subtle Gradient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
        <div className="absolute right-10 top-20 h-[500px] w-[500px] rounded-full bg-neutral-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Dark Navy / Black Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-xs font-mono font-bold text-white shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FOR PARTNERS &amp; PUBLISHERS</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#09090B] tracking-tight leading-[1.06]">
              The best partnerships in <span className="underline decoration-4 underline-offset-8 decoration-black">AI &amp; B2B SaaS</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-xl">
              Innotek is the world's leading AI software partner network. Start earning up to 30% recurring commissions across 7 high-converting software applications today.
            </p>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 text-sm sm:text-base font-bold text-white shadow-md hover:bg-neutral-800 transition transform hover:-translate-y-0.5"
              >
                <span>Apply to the Innotek Network</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/affiliate"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-7 py-4 text-sm sm:text-base font-bold text-[#09090B] hover:bg-neutral-50 transition shadow-2xs"
              >
                <span>Explore Programme Tiers</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 pt-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-black" />
                <span>Zero Setup Fees</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-black" />
                <span>60-Day Cookie Guarantee</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-black" />
                <span>Instant ID Provisioning</span>
              </span>
            </div>

          </div>

          {/* Right Hero: Innotek Stacking Mascot Illustration with Official Coin */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[460px] flex items-center justify-center">
              
              {/* Soft Ambient Shadow Card Behind */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/90 rounded-3xl blur-xl" />

              {/* The Mascot Graphic */}
              <div className="relative z-10 p-2">
                <img
                  src="/images/innotek-hero-mascot.png"
                  alt="Innotek Partner Stacking Mascots"
                  className="w-full h-auto max-h-[460px] object-contain drop-shadow-2xl rounded-2xl"
                  style={{ animation: 'float 5s ease-in-out infinite' }}
                />
              </div>

            </div>
          </div>

        </div>

        {/* Proof Metrics Ribbon Below Hero */}
        <div className="mt-16 pt-10 border-t border-neutral-300/80">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-4">
            WHY JOIN INNOTEK PARTNER NETWORK?
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-black">7+</p>
              <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 leading-snug">
                top AI software brands paying partners
              </p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-black">60 Days</p>
              <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 leading-snug">
                first-party cookie tracking guarantee
              </p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-black">Up to 30%</p>
              <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 leading-snug">
                in recurring lifetime commissions
              </p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-black">NET-15</p>
              <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 leading-snug">
                automated monthly settlement guarantee
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

