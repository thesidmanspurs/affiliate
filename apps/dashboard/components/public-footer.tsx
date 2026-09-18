'use client';

import Link from 'next/link';
import { Globe, ExternalLink } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="relative z-30 border-t-2 border-black bg-black text-neutral-300 text-xs pointer-events-auto select-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="h-8 w-36 block cursor-pointer" title="Innotek Global Homepage">
              <img
                src="/logos/innotek-white.svg"
                alt="Innotek Global"
                className="h-full w-full object-contain object-left"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logos/innotek.png';
                }}
              />
            </Link>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Innotek Global Ltd designs domain-specific AI software, sentiment intelligence platforms, and conversational voice systems.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-300 font-bold">
              <Globe className="h-3.5 w-3.5 text-white" />
              <span>London, United Kingdom</span>
            </div>
          </div>

          {/* Affiliate Hub Links */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Affiliate Hub</h3>
            <ul className="space-y-1.5 text-[12px] font-medium">
              <li>
                <Link href="/" className="hover:text-white hover:underline transition cursor-pointer block">
                  Overview &amp; Perks
                </Link>
              </li>
              <li>
                <Link href="/partner/docs" className="text-white hover:underline transition font-bold flex items-center gap-1.5 cursor-pointer">
                  <span>Partner Documentation</span>
                  <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.2 rounded text-zinc-300">New</span>
                </Link>
              </li>
              <li>
                <Link href="/dev/docs" className="hover:text-white hover:underline transition text-neutral-400 cursor-pointer block">
                  Developer SDK Docs
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="hover:text-white hover:underline transition cursor-pointer block">
                  Commission Structure
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:underline transition cursor-pointer block">
                  About Innotek Global
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white hover:underline transition cursor-pointer block">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white hover:underline transition cursor-pointer block">
                  Affiliate Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* 7 Ecosystem Products with Live Links */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Ecosystem Products</h3>
            <ul className="space-y-1.5 text-[12px] font-mono text-neutral-300">
              <li>
                <a
                  href="https://moodscanr.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition cursor-pointer inline-flex items-center gap-1.5 group"
                >
                  <span>MoodScanr AI</span>
                  <ExternalLink className="h-2.5 w-2.5 text-neutral-500 group-hover:text-white transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://halalscanr.innotek.global"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition cursor-pointer inline-flex items-center gap-1.5 group"
                >
                  <span>HalalScanr</span>
                  <ExternalLink className="h-2.5 w-2.5 text-neutral-500 group-hover:text-white transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://ftracker.innotek.global"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition cursor-pointer inline-flex items-center gap-1.5 group"
                >
                  <span>FanScanr Sports</span>
                  <ExternalLink className="h-2.5 w-2.5 text-neutral-500 group-hover:text-white transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://headshot.innotek.global"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition cursor-pointer inline-flex items-center gap-1.5 group"
                >
                  <span>AI Headshot Pro</span>
                  <ExternalLink className="h-2.5 w-2.5 text-neutral-500 group-hover:text-white transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://talent.innotek.global"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition cursor-pointer inline-flex items-center gap-1.5 group"
                >
                  <span>TalentScanr AI</span>
                  <ExternalLink className="h-2.5 w-2.5 text-neutral-500 group-hover:text-white transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://voice.innotek.global"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition cursor-pointer inline-flex items-center gap-1.5 group"
                >
                  <span>CallScanr Voice AI</span>
                  <ExternalLink className="h-2.5 w-2.5 text-neutral-500 group-hover:text-white transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://aqiscanr.innotek.global"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition cursor-pointer inline-flex items-center gap-1.5 group"
                >
                  <span>AQIScanr AI</span>
                  <ExternalLink className="h-2.5 w-2.5 text-neutral-500 group-hover:text-white transition" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Compliance */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Legal &amp; Compliance</h3>
            <ul className="space-y-1.5 text-[12px] font-medium">
              <li>
                <Link href="/terms" className="hover:text-white hover:underline transition cursor-pointer block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white hover:underline transition cursor-pointer block">
                  Privacy Policy (GDPR)
                </Link>
              </li>
              <li>
                <Link href="/affiliate-agreement" className="hover:text-white hover:underline transition cursor-pointer block">
                  Affiliate Agreement
                </Link>
              </li>
              <li>
                <Link
                  href="/partner/docs#advertising-ethics"
                  className="text-[11px] text-neutral-400 hover:text-white hover:underline transition pt-1 font-mono cursor-pointer flex items-center gap-1"
                >
                  <span>UK ASA &amp; FTC Compliant</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-400">
          <p>© {new Date().getFullYear()} Innotek Global Ltd. Registered in England &amp; Wales. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/partner/docs" className="hover:text-white hover:underline text-white font-semibold cursor-pointer">
              Partner Docs
            </Link>
            <Link href="/dev/docs" className="hover:text-white hover:underline cursor-pointer">
              Developer SDK
            </Link>
            <Link href="/terms" className="hover:text-white hover:underline cursor-pointer">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white hover:underline cursor-pointer">
              Privacy
            </Link>
            <Link href="/affiliate-agreement" className="hover:text-white hover:underline cursor-pointer">
              Affiliate Agreement
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
