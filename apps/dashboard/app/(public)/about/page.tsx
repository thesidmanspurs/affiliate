'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Shield,
  Globe,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  Zap,
  Code2,
  Users,
  FileText,
  Lock,
  ExternalLink,
  Bot,
  Coins,
  Heart,
  Compass,
  Layers,
  Milestone,
  Mail,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="relative bg-white text-[#09090B] font-sans antialiased selection:bg-black selection:text-white min-h-[calc(100vh-80px)]">
      
      {/* 1. EDITORIAL HEADER & COMPANY OVERVIEW */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Subtle Institutional Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-xs font-mono font-medium text-neutral-600">
            <span>ABOUT INNOTEK GLOBAL</span>
            <span>&bull;</span>
            <span>LONDON, UNITED KINGDOM</span>
          </div>

          {/* Official Innotek Logo */}
          <div className="flex justify-center pt-2">
            <img
              src="/logos/innotek.png"
              alt="Innotek Global Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Lead Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#09090B] tracking-tight leading-[1.15]">
            We build software that makes artificial intelligence tangible, useful, and human.
          </h1>

          {/* Editorial Introduction */}
          <p className="text-base sm:text-xl text-neutral-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Innotek Global was founded in London with a clear conviction: the true promise of AI isn&apos;t generic chatbots or superficial wrappers—it is deep, domain-specific software engineered to solve real human and business problems every single day.
          </p>

        </div>
      </section>

      {/* 2. THE INNOTEK STORY (NARRATIVE ESSAY) */}
      <section className="py-20 sm:py-28 border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="space-y-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              OUR ORIGIN &amp; PURPOSE
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#09090B] tracking-tight">
              Why We Started Innotek
            </h2>
          </div>

          <div className="prose prose-neutral max-w-none text-neutral-700 text-base sm:text-lg leading-relaxed space-y-6 font-normal">
            <p>
              In 2023, the technology landscape experienced an unprecedented explosion in generative AI. Hundreds of startups appeared overnight, yet a troubling pattern quickly emerged: most were superficial wrappers querying public foundation models with generic prompts, offering little durability, domain depth, or user protection.
            </p>

            <p>
              We founded <strong>Innovation Tek Ltd</strong> (trading as <strong>Innotek Global</strong>) in London to take the harder, more rewarding path. We set out to build vertical software platforms where machine learning models are deeply coupled with specialized workflows—from computer-vision food safety scanners to sub-300ms telephony engines.
            </p>

            <blockquote className="border-l-4 border-black pl-5 italic text-neutral-900 font-serif text-lg sm:text-xl my-8">
              &ldquo;Software should be judged by the tangible value it delivers to the person using it, not by the volume of marketing hype behind it.&rdquo;
            </blockquote>

            <p>
              Today, our portfolio encompasses 7 specialized AI applications spanning video sentiment intelligence (<em>MoodScanr</em>), halal ingredient verification (<em>HalalScanr</em>), executive portrait generation (<em>Headshoot AI</em>), and conversational voice telephony (<em>CallScanr</em>). Each application is built as an independent tool, yet shares a unified foundation of security, privacy, and partner economics.
            </p>
          </div>

        </div>
      </section>

      {/* 3. MEET THE INNOTEK MASCOTS: GIZMO, BYTE & SPARK */}
      <section className="py-20 sm:py-28 border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Mascot Story & Philosophy (Left Column) */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-3.5 py-1 text-xs font-mono font-medium text-neutral-800">
                <Bot className="h-4 w-4 text-black" />
                <span>MEET OUR MASCOTS</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#09090B] tracking-tight">
                Why We Created the Innotek Bots
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Advanced technology shouldn&apos;t feel cold, opaque, or intimidating. We created the Innotek robot trio as our digital companions to remind us every day that intelligence is most powerful when it remains friendly, accessible, and grounded in human collaboration.
              </p>

              {/* Individual Mascot Profiles */}
              <div className="space-y-3.5 pt-2">
                <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-2xs flex items-start gap-3.5">
                  <span className="h-6 w-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    G
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#09090B]">Gizmo &bull; The Steady Guardian</h4>
                    <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                      Standing atop the Innotek medallion, Gizmo represents algorithmic reliability, system uptime, and our unyielding dedication to ethical AI engineering.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-2xs flex items-start gap-3.5">
                  <span className="h-6 w-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    B
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#09090B]">Byte &bull; The Inquisitive Explorer</h4>
                    <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                      With his star-tipped antennae, Byte represents vision, perception, and inquiry—the curiosity that drives our computer vision and OCR innovations.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-2xs flex items-start gap-3.5">
                  <span className="h-6 w-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    S
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#09090B]">Spark &bull; The Community Champion</h4>
                    <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                      Cheering with raised fists, Spark embodies our commitment to shared economic prosperity. Spark reminds us to celebrate every partner and user milestone.
                    </p>
                  </div>
                </div>
              </div>

              {/* The Coin Symbolism */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 leading-relaxed flex items-center gap-3">
                <Coins className="h-5 w-5 text-amber-700 shrink-0" />
                <span>
                  <strong>The Gold Coins:</strong> Symbolizes sustainable financial freedom. We believe technology companies should enrich the creators and partners who help them grow.
                </span>
              </div>

            </div>

            {/* Mascot Graphic Illustration (Right Column) */}
            <div className="lg:col-span-6 flex justify-center">
              <img
                src="/images/innotek-hero-mascot.png"
                alt="Innotek Mascot Trio - Gizmo, Byte, and Spark with the Innotek Coin Medallion"
                className="w-full h-auto object-contain drop-shadow-md mx-auto"
              />
            </div>

          </div>

        </div>
      </section>

      {/* 4. OUR VALUES & CULTURE */}
      <section className="py-20 sm:py-28 border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">
              HOW WE WORK
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#09090B] tracking-tight">
              Principles That Guide Every Decision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-black font-bold">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#09090B]">
                  Substance Over Hype
                </h3>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed pt-1">
                We do not launch features to catch a momentary news cycle. We measure success by whether our tools save a customer hours of tedious work or generate verified revenue for our partners.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-black font-bold">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#09090B]">
                  Privacy by Design
                </h3>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed pt-1">
                Headquartered in the UK, we hold ourselves to the gold standard of data protection. We do not sell data to brokers, our affiliate tracking uses strictly first-party cookies, and all databases are encrypted with AES-256.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-black font-bold">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#09090B]">
                  Symbiotic Growth
                </h3>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed pt-1">
                Software companies grow fastest when they share their economics. We treat our affiliates and publishers as true equity-like partners, with transparent recurring payouts and zero hidden fees.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-black font-bold">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#09090B]">
                  Zero-Secret Security
                </h3>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed pt-1">
                We separate public technical documentation from confidential API secrets. Merchant credentials and private customer data are never exposed in public repositories or client-side bundles.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. OUR JOURNEY (MILESTONES TIMELINE) */}
      <section className="py-20 sm:py-28 border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">
              TIMELINE
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#09090B] tracking-tight">
              The Story So Far
            </h2>
          </div>

          <div className="relative border-l-2 border-neutral-200 pl-6 sm:pl-8 space-y-10">
            
            {/* 2023 */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 h-4 w-4 rounded-full bg-black border-4 border-white" />
              <span className="font-mono text-xs font-bold text-neutral-400">2023 &bull; INCEPTION</span>
              <h3 className="font-display text-lg font-bold text-[#09090B] mt-1">
                Founded in London
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed mt-1">
                Innovation Tek Ltd incorporated in England &amp; Wales. Engineering begins on our proprietary computer vision and video emotion polarity models.
              </p>
            </div>

            {/* 2024 */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 h-4 w-4 rounded-full bg-black border-4 border-white" />
              <span className="font-mono text-xs font-bold text-neutral-400">2024 &bull; FIRST PLATFORMS</span>
              <h3 className="font-display text-lg font-bold text-[#09090B] mt-1">
                Launch of MoodScanr AI &amp; HalalScanr
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed mt-1">
                Public beta deployment of MoodScanr for YouTube creator analytics and HalalScanr for mobile food packaging verification. Initial community reaches over 10,000 active monthly scans.
              </p>
            </div>

            {/* 2025 */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 h-4 w-4 rounded-full bg-black border-4 border-white" />
              <span className="font-mono text-xs font-bold text-neutral-400">2025 &bull; ECOSYSTEM EXPANSION</span>
              <h3 className="font-display text-lg font-bold text-[#09090B] mt-1">
                Real-Time Voice &amp; Partner Network Launch
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed mt-1">
                Release of CallScanr sub-300ms latency voice bots and AI Headshot Pro. Launch of the Innotek Partner Platform with automated monthly settlements across 40+ countries.
              </p>
            </div>

            {/* 2026 */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-white" />
              <span className="font-mono text-xs font-bold text-emerald-600">2026 &bull; TODAY</span>
              <h3 className="font-display text-lg font-bold text-[#09090B] mt-1">
                Unified 7-Product AI Portfolio
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed mt-1">
                Operating 7 commercial applications across lifestyle, enterprise ATS, sports analytics, environmental sensing, and conversational voice.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. STATUTORY CORPORATE PROFILE */}
      <section className="py-20 sm:py-28 border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              CORPORATE GOVERNANCE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B]">
              Statutory Information
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Official legal entity details and regulatory registrations.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs divide-y divide-neutral-100 text-xs sm:text-sm">
            
            <div className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-neutral-500 font-medium">Registered Legal Entity:</span>
              <strong className="text-black font-semibold">Innovation Tek Ltd</strong>
            </div>

            <div className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-neutral-500 font-medium">Trading Brand:</span>
              <strong className="text-black font-semibold">Innotek Global</strong>
            </div>

            <div className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-neutral-500 font-medium">Jurisdiction &amp; Registry:</span>
              <strong className="text-black font-semibold">Registered in England &amp; Wales</strong>
            </div>

            <div className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-neutral-500 font-medium">Global Headquarters:</span>
              <strong className="text-black font-semibold">London, United Kingdom</strong>
            </div>

            <div className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-neutral-500 font-medium">Tax &amp; Digital Platform Compliance:</span>
              <strong className="text-black font-semibold">UK HMRC DAC7 &bull; US IRS W-8BEN / W-9</strong>
            </div>

            <div className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-neutral-500 font-medium">Data Protection Framework:</span>
              <strong className="text-black font-semibold">UK GDPR &bull; Data Protection Act 2018</strong>
            </div>

            <div className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-neutral-500 font-medium">General Inquiries:</span>
              <div className="flex items-center gap-3">
                <a href="mailto:contact@innotek.global" className="text-black font-bold hover:underline">
                  contact@innotek.global
                </a>
                <span className="text-neutral-300">•</span>
                <Link href="/contact" className="text-black font-bold hover:underline inline-flex items-center gap-1">
                  <span>Contact Desk</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. WARM CLOSING INVITATION (NOT A SALES PITCH) */}
      <section className="py-20 sm:py-24 bg-white text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-neutral-100 text-black mx-auto">
            <Compass className="h-6 w-6" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
            Let&apos;s Build Together
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            We are always eager to connect with engineers, researchers, publishers, and creators who care deeply about applied technology. Whether you want to explore our applications, partner with our network, or simply exchange ideas—our doors are open.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <Link
              href="/partner/docs"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 transition shadow-2xs"
            >
              <FileText className="h-4 w-4 text-neutral-500" />
              <span>Partner Knowledge Base</span>
            </Link>
            {/* <Link
              href="/dev/docs"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 transition shadow-2xs"
            >
              <Code2 className="h-4 w-4 text-neutral-500" />
              <span>Developer Integration SDK</span>
            </Link> */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 transition shadow-2xs"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Us</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
