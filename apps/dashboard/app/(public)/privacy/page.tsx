import Link from 'next/link';
import { ShieldCheck, ArrowRight, Lock, Terminal, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="relative py-16 sm:py-24 bg-[#FAFAF4] pattern-dots text-[#1B231D]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8E1D6] bg-white px-4 py-1.5 text-xs sm:text-sm font-mono font-bold text-black shadow-xs mb-4">
            <ShieldCheck className="h-4 w-4 text-[#10B981]" />
            <span>DATA PRIVACY PROTOCOL // UK GDPR &amp; DPA 2018</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
            Telemetry collection standards, encryption protocols, and data subject rights for the Innotek ecosystem.
          </p>
          <div className="mt-4 inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-neutral-600 bg-white border border-[#D8E1D6] px-4 py-1.5 rounded-full shadow-2xs">
            <span className="font-bold text-black">Compliance:</span> UK GDPR &bull; <span className="font-bold text-black">Zero</span> Third-Party Data Sharing
          </div>
        </div>

        {/* Content Cards */}
        <div className="space-y-8">
          <section className="rounded-3xl border border-[#D8E1D6] bg-white p-7 sm:p-9 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                1
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#111827]">
                Information We Collect
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              When you participate in the Innotek Affiliate Programme, we collect registration metadata (name, email, company registration), financial payout vectors (bank sort code, IBAN, or Momo identifier), and pseudonymised referral telemetry (hashed IP signatures, conversion click IDs).
            </p>
          </section>

          <section className="rounded-3xl border border-[#D8E1D6] bg-white p-7 sm:p-9 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                2
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#111827]">
                Lawful Basis for Processing
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              We process personal data under the lawful basis of <strong className="text-[#111827]">contractual necessity</strong> (to compute attribution and disburse commissions) and <strong className="text-[#111827]">statutory compliance</strong> (UK tax accounting and anti-money laundering regulations).
            </p>
          </section>

          <section className="rounded-3xl border border-[#D8E1D6] bg-white p-7 sm:p-9 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                3
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#111827]">
                First-Party Cookie Integrity
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              Our 60-day attribution system operates strictly on first-party domains. We do not sell telemetry data to third-party ad brokers or cross-site tracking networks.
            </p>
          </section>

          <section className="rounded-3xl border border-[#D8E1D6] bg-white p-7 sm:p-9 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-mono text-sm font-bold shadow-xs">
                4
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#111827]">
                Your Data Subject Rights (UK GDPR)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pl-11">
              Under UK GDPR, you maintain rights to access, rectify, export, or erase your telemetry records by reaching our Data Protection Officer at <code className="font-mono bg-[#FAFAF4] border border-[#D8E1D6] px-2 py-0.5 rounded text-black font-semibold">privacy@innotek.global</code>.
            </p>
          </section>
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <Link
            href="/affiliate-agreement"
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold text-black hover:underline bg-white border border-[#D8E1D6] px-5 py-2.5 rounded-xl shadow-xs"
          >
            <span>View Affiliate Operating Agreement</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
