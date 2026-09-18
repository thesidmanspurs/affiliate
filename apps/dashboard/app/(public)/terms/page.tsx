import Link from 'next/link';
import { Scale, ArrowRight, ShieldCheck, Cpu, Terminal, Building2, Lock } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="relative py-16 sm:py-24 bg-white text-[#111827] min-h-[calc(100vh-80px)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs sm:text-sm font-mono font-bold text-black shadow-2xs mb-4">
            <Scale className="h-4 w-4 text-[#10B981]" />
            <span>LEGAL JURISDICTION // ENGLAND &amp; WALES</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
            Platform governing laws, enterprise software licenses, and operational standards for Innotek Global Ltd.
          </p>
          <div className="mt-4 inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-neutral-600 bg-neutral-50 border border-neutral-200 px-4 py-1.5 rounded-full shadow-2xs">
            <span className="font-bold text-black">Effective:</span> September 2026 &bull; <span className="font-bold text-black">Governing Law:</span> England &amp; Wales
          </div>
        </div>

        {/* Content Cards */}
        {/* Content Cards */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-neutral-200 bg-white p-7 sm:p-9 shadow-xs hover:border-neutral-300 transition">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                1
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#111827]">
                General Provisions &amp; Acceptance
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              These Terms of Service (&quot;Terms&quot;) govern access to and use of all software applications, affiliate tracking engines, APIs, and online portals operated by Innotek Global Ltd. By accessing any part of our ecosystem, you agree to be bound by these Terms.
            </p>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-7 sm:p-9 shadow-xs hover:border-neutral-300 transition">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                2
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#111827]">
                Intellectual Property &amp; Proprietary Models
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              All proprietary algorithms, design marks, logos, and software code related to <em>MoodScanr AI, HalalScanr, FanScanr, AI Headshot Pro, TalentScanr, CallScanr, and AQIScanr</em> remain the exclusive property of Innotek Global Ltd.
            </p>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-7 sm:p-9 shadow-xs hover:border-neutral-300 transition">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                3
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#111827]">
                Service Availability &amp; Disclaimer of Warranties
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              While we maintain redundant enterprise infrastructure to deliver 99.9% uptime, services are provided &quot;as is&quot; without express or implied warranty of error-free operation or uninterrupted server connectivity.
            </p>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-7 sm:p-9 shadow-xs hover:border-neutral-300 transition">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                4
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#111827]">
                Governing Law &amp; Jurisdiction
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              These Terms are governed by and construed in accordance with the laws of <strong>England and Wales</strong>. All legal claims or disputes shall be submitted exclusively to the courts located in London, United Kingdom.
            </p>
          </section>
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <Link
            href="/affiliate-agreement"
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold text-black hover:underline bg-white border border-neutral-200 px-5 py-2.5 rounded-xl shadow-xs hover:bg-neutral-50 transition"
          >
            <span>View Affiliate Operating Agreement</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
