'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ConnectEarnGrow() {
  return (
    <section className="py-20 sm:py-28 bg-white border-b border-neutral-200 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-3">
            GET STARTED WITH INNOTEK
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-black leading-[1.08]">
            Connect. Earn. Grow.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            Build powerful B2B partnerships that fuel growth and drive revenue.
          </p>
        </div>

        {/* 2-Column High-Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          
          {/* Card 1: Vendors */}
          <div className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition">
            <div className="space-y-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-neutral-200 text-neutral-800 px-3 py-1 rounded-full">
                VENDORS
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-black leading-snug">
                Empower your partners. Accelerate growth.
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Manage relationships and grow your ecosystem with top-notch partners across our 7 specialized AI software vertical engines.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition"
              >
                <span>Book a demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/affiliate"
                className="text-xs sm:text-sm font-bold text-neutral-700 hover:text-black hover:underline"
              >
                See how it works →
              </Link>
            </div>
          </div>

          {/* Card 2: Partners & Publishers */}
          <div className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition">
            <div className="space-y-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-black text-white px-3 py-1 rounded-full">
                PARTNERS &amp; PUBLISHERS
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-black leading-snug">
                Earn more with the best B2B SaaS brands
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Partner with top software brands and start earning recurring lifetime commissions with 60-day cookie guarantee and monthly payouts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition"
              >
                <span>Join the network</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/affiliate"
                className="text-xs sm:text-sm font-bold text-neutral-700 hover:text-black hover:underline"
              >
                Learn more →
              </Link>
            </div>
          </div>

        </div>

        {/* Decorative Bottom Illustration Graphic */}
        <div className="mt-16 max-w-5xl mx-auto overflow-hidden rounded-3xl border border-neutral-200 shadow-xl bg-white">
          <img
            src="/images/innotek-partner-collage.jpg"
            alt="Innotek Global SaaS Partner Network - Connect, Earn, Grow"
            className="w-full h-auto object-cover"
          />
        </div>

      </div>
    </section>
  );
}
