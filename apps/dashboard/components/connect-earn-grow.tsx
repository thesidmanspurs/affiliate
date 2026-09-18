'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/scroll-reveal';

export function ConnectEarnGrow() {
  return (
    <section className="py-20 sm:py-28 bg-white border-b border-neutral-200 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & CTA Cluster */}
        <div className="relative top-[70px] z-10">
          {/* Top Header */}
          <ScrollReveal direction="up" delay={50} duration={650} className="text-center max-w-5xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-3">
              GET STARTED WITH INNOTEK
            </span>
            <h2 className="font-display text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-black leading-[1.08] whitespace-nowrap">
              Connect. Earn. Grow.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Build powerful B2B partnerships that fuel growth and drive revenue.
            </p>
          </ScrollReveal>

          {/* 2-Column High-Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            
            {/* Card 1: Vendors
            <ScrollReveal direction="up" delay={100} duration={700}>
              <div className="h-full rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition">
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
            </ScrollReveal> */}

            {/* CTA: Join Network & Learn More */}
            <ScrollReveal direction="up" delay={200} duration={700} className="col-span-full flex justify-center">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-10 py-4 text-base sm:text-lg font-bold text-white shadow-lg hover:bg-neutral-800 hover:shadow-xl hover:-translate-y-0.5 transition-all text-center min-w-[240px]"
                  >
                    <span>Join Network</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <Link
                    href="/affiliate"
                    className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-neutral-600 hover:text-black hover:underline py-2 px-4 rounded-lg hover:bg-neutral-100 transition"
                  >
                    <span>Learn More</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>



        {/* Decorative Bottom Illustration Graphic */}
        <ScrollReveal direction="up" delay={150} duration={800} className="mt-16 relative top-[115px] max-w-7xl mx-auto bg-white">
          <img
            src="/images/innotek-partner-collage.jpg"
            alt="Innotek Global SaaS Partner Network - Connect, Earn, Grow"
            className="w-full h-auto object-cover"
          />
        </ScrollReveal>

      </div>
    </section>
  );
}
