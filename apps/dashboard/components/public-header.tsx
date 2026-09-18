'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  Play,
  UserPlus,
  Compass,
  LineChart,
  Coins,
  Cpu,
  Share2,
  Users,
  Target,
  FileText,
  BookOpen,
  HelpCircle,
  Building2,
  CheckCircle2,
  Menu,
  X,
  Mail,
  Layers,
  Code2,
  ExternalLink,
} from 'lucide-react';

type DropdownKey = 'platform' | 'solutions' | 'partners' | 'resources';

export function PublicHeader() {
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close dropdown on route navigation
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleMouseEnter = (menu: DropdownKey) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 280);
  };

  const handleDropdownToggle = (menu: DropdownKey) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const closeDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full bg-[#F8F9FD] shadow-xs border-b border-neutral-200">
      {/* 1. Top Announcement Trim Bar */}
      <div className="bg-[#F8F9FD] border-b border-neutral-200/80 px-4 py-2 text-center text-xs font-medium text-neutral-800 flex items-center justify-center gap-2">
        <span>Thrive 2026: The AI Partnership &amp; Recurring Growth Ecosystem.</span>
        <Link href="/register" className="font-bold text-black hover:underline inline-flex items-center gap-1">
          <span>Apply for Partner Access</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* 2. Main White Navigation Bar */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        
        {/* Left: Brand Logo + Lockup */}
        <div className="flex items-center gap-8">
          <Link href="/" onClick={closeDropdown} className="flex items-center gap-3 group">
            <div className="h-9 w-auto flex items-center">
              <img
                src="/logos/innotek.png"
                alt="Innotek Global"
                className="h-8 w-auto object-contain"
              />
            </div>
            <span className="relative left-[-13px] font-display text-[13px] font-bold text-black border border-neutral-100 px-2 py-0.5 uppercase ">
              Affiliate Network
            </span>
          </Link>

          {/* Desktop Navigation Links with Dual Click & Hover Triggers */}
          <nav className="hidden lg:flex items-center space-x-1">
            
            {/* 1. Platform Dropdown Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('platform')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleDropdownToggle('platform')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer select-none ${
                  activeDropdown === 'platform'
                    ? 'text-black font-bold bg-neutral-100'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-50'
                }`}
                aria-expanded={activeDropdown === 'platform'}
              >
                <span>Platform</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === 'platform' ? 'rotate-180 text-black' : 'text-neutral-400'
                  }`}
                />
              </button>
            </div>

            {/* 2. Solutions Dropdown Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleDropdownToggle('solutions')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer select-none ${
                  activeDropdown === 'solutions'
                    ? 'text-black font-bold bg-neutral-100'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-50'
                }`}
                aria-expanded={activeDropdown === 'solutions'}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === 'solutions' ? 'rotate-180 text-black' : 'text-neutral-400'
                  }`}
                />
              </button>
            </div>

            {/* 3. For Partners & Publishers Dropdown Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('partners')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleDropdownToggle('partners')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer select-none ${
                  activeDropdown === 'partners'
                    ? 'text-black font-bold bg-neutral-100'
                    : pathname.startsWith('/partner') || pathname === '/affiliate'
                    ? 'text-black font-bold'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-50'
                }`}
                aria-expanded={activeDropdown === 'partners'}
              >
                <span>For Partners &amp; Publishers</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === 'partners' ? 'rotate-180 text-black' : 'text-neutral-400'
                  }`}
                />
              </button>
            </div>

            {/* 4. Resources Dropdown Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleDropdownToggle('resources')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer select-none ${
                  activeDropdown === 'resources'
                    ? 'text-black font-bold bg-neutral-100'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-50'
                }`}
                aria-expanded={activeDropdown === 'resources'}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === 'resources' ? 'rotate-180 text-black' : 'text-neutral-400'
                  }`}
                />
              </button>
            </div>

            {/* 5. About Us Direct Link */}
            <Link
              href="/about"
              onClick={closeDropdown}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                pathname === '/about'
                  ? 'text-black font-bold bg-neutral-100'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-50'
              }`}
            >
              About Us
            </Link>

          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/partner/docs"
            onClick={closeDropdown}
            className="text-neutral-500 hover:text-black p-2 transition"
            title="Browse Documentation"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            onClick={closeDropdown}
            className="text-sm font-bold text-neutral-700 hover:text-black px-3 py-2 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={closeDropdown}
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition"
          >
            <span>Get started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/register"
            onClick={closeDropdown}
            className="rounded-lg bg-black px-3.5 py-1.5 text-xs font-bold text-white"
          >
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-black cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* 3. MEGA-MENU CONTAINER: PLATFORM */}
      <div
        className={`absolute left-0 right-0 top-full z-50 bg-[#F7F5F0] text-[#09090B] border-t border-neutral-300 shadow-2xl transition-all duration-300 ease-out origin-top ${
          activeDropdown === 'platform'
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-2 invisible pointer-events-none'
        }`}
        onMouseEnter={() => {
          if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        }}
        onMouseLeave={handleMouseLeave}
      >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Platform Features */}
              <div className="col-span-12 lg:col-span-4 space-y-4 pr-4 border-r border-neutral-300">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  PLATFORM FEATURES
                </span>
                <h3 className="font-display text-2xl font-extrabold text-[#09090B] leading-tight">
                  One platform to power your AI partner ecosystem
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Automate tracking, attribution, 14-day clearance holding buffers, and monthly payouts across 7 proprietary software applications.
                </p>
                <div className="pt-2">
                  <Link
                    href="/#tour"
                    onClick={closeDropdown}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-[#09090B] hover:bg-neutral-100 transition shadow-2xs"
                  >
                    <Play className="h-3.5 w-3.5 fill-black text-black" />
                    <span>Watch live simulator demo</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: 5 Pillars + Innotek AI Banner */}
              <div className="col-span-12 lg:col-span-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {/* Step 1: Recruit */}
                  <Link
                    href="/register"
                    onClick={closeDropdown}
                    className="p-3.5 rounded-xl bg-white border border-neutral-200 hover:border-black hover:shadow-md transition group shadow-xs"
                  >
                    <UserPlus className="h-5 w-5 text-black mb-2" />
                    <h4 className="font-bold text-xs text-[#09090B]">Recruit</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      Attract high-converting B2B &amp; AI partners
                    </p>
                  </Link>

                  {/* Step 2: Activate */}
                  <Link
                    href="/partner/docs"
                    onClick={closeDropdown}
                    className="p-3.5 rounded-xl bg-white border border-neutral-200 hover:border-black hover:shadow-md transition group shadow-xs"
                  >
                    <Compass className="h-5 w-5 text-black mb-2" />
                    <h4 className="font-bold text-xs text-[#09090B]">Activate</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      Equip partners with docs, hooks &amp; scripts
                    </p>
                  </Link>

                  {/* Step 3: Track */}
                  <Link
                    href="/dev/docs"
                    onClick={closeDropdown}
                    className="p-3.5 rounded-xl bg-white border border-neutral-200 hover:border-black hover:shadow-md transition group shadow-xs"
                  >
                    <LineChart className="h-5 w-5 text-black mb-2" />
                    <h4 className="font-bold text-xs text-[#09090B]">Track</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      S2S tracking &amp; 60-day cookie attribution
                    </p>
                  </Link>

                  {/* Step 4: Commission */}
                  <Link
                    href="/affiliate"
                    onClick={closeDropdown}
                    className="p-3.5 rounded-xl bg-white border border-neutral-200 hover:border-black hover:shadow-md transition group shadow-xs"
                  >
                    <Coins className="h-5 w-5 text-black mb-2" />
                    <h4 className="font-bold text-xs text-[#09090B]">Commission</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      Earn up to 30% recurring monthly payouts
                    </p>
                  </Link>

                  {/* Step 5: Optimize */}
                  <Link
                    href="/partner/docs#best-practices"
                    onClick={closeDropdown}
                    className="p-3.5 rounded-xl bg-white border border-neutral-200 hover:border-black hover:shadow-md transition group shadow-xs"
                  >
                    <Zap className="h-5 w-5 text-black mb-2" />
                    <h4 className="font-bold text-xs text-[#09090B]">Optimize</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      Audience angle playbooks &amp; conversion tips
                    </p>
                  </Link>
                </div>

                {/* Bottom Banner: Innotek AI Portfolio */}
                <Link
                  href="/partner/docs#products"
                  onClick={closeDropdown}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-neutral-300 hover:border-black transition shadow-xs group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black p-2 shrink-0 shadow-xs">
                    <img
                      src="/logos/innotek.png"
                      alt="Innotek AI"
                      className="h-full w-full object-contain filter invert"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#09090B] flex items-center gap-2">
                      <span>Innotek Ecosystem AI</span>
                      <span className="font-mono text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.2 rounded border border-neutral-200 font-bold">
                        7 Live Products
                      </span>
                    </h4>
                    <p className="text-xs text-neutral-600 truncate">
                      MoodScanr, HalalScanr, FanScanr, Headshoot, TalentScanr, CallScanr, and AQIScanr.
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition" />
                </Link>
              </div>

            </div>

            {/* Bottom Utility Link Bar */}
            <div className="mt-8 pt-4 border-t border-neutral-300/80 flex items-center justify-between text-xs text-neutral-600">
              <div className="flex items-center gap-6">
                <Link href="/register" onClick={closeDropdown} className="hover:text-black">Apply for Access</Link>
                <Link href="/affiliate" onClick={closeDropdown} className="hover:text-black">Commission Tiers</Link>
                <Link href="/faq" onClick={closeDropdown} className="hover:text-black">Partner FAQ</Link>
                <Link href="/affiliate-agreement" onClick={closeDropdown} className="hover:text-black">Operating Agreement</Link>
              </div>
              <Link href="/partner/docs#products" onClick={closeDropdown} className="font-bold text-black hover:underline flex items-center gap-1">
                <span>Explore all 7 applications</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

      {/* 4. MEGA-MENU CONTAINER: SOLUTIONS */}
      <div
        className={`absolute left-0 right-0 top-full z-50 bg-[#F7F5F0] text-[#09090B] border-t border-neutral-300 shadow-2xl transition-all duration-300 ease-out origin-top ${
          activeDropdown === 'solutions'
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-2 invisible pointer-events-none'
        }`}
        onMouseEnter={() => {
          if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        }}
        onMouseLeave={handleMouseLeave}
      >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-12 gap-8 items-start">
              
              {/* Left Title */}
              <div className="col-span-12 lg:col-span-4 space-y-4 pr-4 border-r border-neutral-300">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  SOLUTIONS
                </span>
                <h3 className="font-display text-2xl font-extrabold text-[#09090B] leading-tight">
                  Scalable revenue motions for every promotion channel
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Whether you are a YouTube creator, tech blogger, media agency, or enterprise consultant, our platform scales multiple partner motions seamlessly.
                </p>
                <div className="pt-2">
                  <Link
                    href="/register"
                    onClick={closeDropdown}
                    className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs"
                  >
                    <span>Join Partner Network</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right 4 Visual Cards */}
              <div className="col-span-12 lg:col-span-8 space-y-3">
                <p className="text-xs font-mono font-bold text-neutral-500 uppercase">
                  Innotek scales multiple partnership types and motions
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  
                  {/* Card 1: Affiliates */}
                  <Link
                    href="/affiliate"
                    onClick={closeDropdown}
                    className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-black hover:shadow-md transition group shadow-xs"
                  >
                    <div className="h-14 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black mb-3 shadow-2xs">
                      <Share2 className="h-6 w-6 text-black" />
                    </div>
                    <h4 className="font-bold text-xs text-[#09090B]">Affiliates</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      Purpose-built affiliate platform for recurring AI SaaS
                    </p>
                  </Link>

                  {/* Card 2: B2B Influencer */}
                  <Link
                    href="/partner/docs#best-practices"
                    onClick={closeDropdown}
                    className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-black hover:shadow-md transition group shadow-xs"
                  >
                    <div className="h-14 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black mb-3 shadow-2xs">
                      <Users className="h-6 w-6 text-black" />
                    </div>
                    <h4 className="font-bold text-xs text-[#09090B]">AI Creators &amp; Influencers</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      High-converting video scripts &amp; YouTube promo kits
                    </p>
                  </Link>

                  {/* Card 3: Co-sell */}
                  <Link
                    href="/partner/docs#compliance"
                    onClick={closeDropdown}
                    className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-black hover:shadow-md transition group shadow-xs"
                  >
                    <div className="h-14 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black mb-3 shadow-2xs">
                      <Target className="h-6 w-6 text-black" />
                    </div>
                    <h4 className="font-bold text-xs text-[#09090B]">Agency Co-Sell</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      Client pipelines powered by domain-specific AI software
                    </p>
                  </Link>

                  {/* Card 4: Answer Engine Optimization */}
                  <Link
                    href="/dev/docs"
                    onClick={closeDropdown}
                    className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-black hover:shadow-md transition group shadow-xs"
                  >
                    <div className="h-14 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black mb-3 shadow-2xs">
                      <Cpu className="h-6 w-6 text-black" />
                    </div>
                    <h4 className="font-bold text-xs text-[#09090B]">Answer Engine (AEO)</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      Turn generative AI responses into trackable referral revenue
                    </p>
                  </Link>

                </div>
              </div>

            </div>
          </div>
        </div>

      {/* 5. MEGA-MENU CONTAINER: FOR PARTNERS & PUBLISHERS */}
      <div
        className={`absolute left-0 right-0 top-full z-50 bg-[#F7F5F0] text-[#09090B] border-t border-neutral-300 shadow-2xl transition-all duration-300 ease-out origin-top ${
          activeDropdown === 'partners'
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-2 invisible pointer-events-none'
        }`}
        onMouseEnter={() => {
          if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        }}
        onMouseLeave={handleMouseLeave}
      >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Overview & CTAs */}
              <div className="col-span-12 lg:col-span-4 space-y-4 pr-4 border-r border-neutral-300">
                <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-[11px] font-mono font-bold text-white shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>FOR PARTNERS &amp; PUBLISHERS</span>
                </div>
                <h3 className="font-display text-2xl font-extrabold text-[#09090B] leading-tight">
                  Maximize recurring revenue with Innotek AI software
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Join hundreds of top YouTube creators, tech bloggers, media buyers, and agencies monetizing 7 domain-specific AI applications.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <Link
                    href="/register"
                    onClick={closeDropdown}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs"
                  >
                    <span>Apply for Access</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/login"
                    onClick={closeDropdown}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition shadow-2xs"
                  >
                    <span>Partner Login</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: 4 Core Hub Cards */}
              <div className="col-span-12 lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Card 1: Partner Documentation */}
                  <Link
                    href="/partner/docs"
                    onClick={closeDropdown}
                    className="group rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-black hover:shadow-md transition flex items-start gap-3.5"
                  >
                    <div className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-[#09090B] group-hover:underline">Partner Documentation</h4>
                        <span className="font-mono text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                          NEW
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                        Integration blueprints, conversion hooks, video scripts, and product angles for all 7 apps.
                      </p>
                    </div>
                  </Link>

                  {/* Card 2: Developer SDK Docs */}
                  <Link
                    href="/dev/docs"
                    onClick={closeDropdown}
                    className="group rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-black hover:shadow-md transition flex items-start gap-3.5"
                  >
                    <div className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-[#09090B] group-hover:underline">Developer SDK &amp; APIs</h4>
                        <span className="font-mono text-[9px] font-bold uppercase bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded border border-neutral-200">
                          v1.0
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                        S2S server attribution, postback webhooks, dynamic sub-IDs, and code snippets.
                      </p>
                    </div>
                  </Link>

                  {/* Card 3: Commission Structure */}
                  <Link
                    href="/affiliate"
                    onClick={closeDropdown}
                    className="group rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-black hover:shadow-md transition flex items-start gap-3.5"
                  >
                    <div className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Coins className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-[#09090B] group-hover:underline">Commission Tiers</h4>
                        <span className="font-mono text-[9px] font-bold uppercase bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded border border-neutral-200">
                          20% - 30%
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                        Starter (20%), Pro (25%), Enterprise (30%) recurring models with NET-15 payouts.
                      </p>
                    </div>
                  </Link>

                  {/* Card 4: Operating Agreement */}
                  <Link
                    href="/affiliate-agreement"
                    onClick={closeDropdown}
                    className="group rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-black hover:shadow-md transition flex items-start gap-3.5"
                  >
                    <div className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-[#09090B] group-hover:underline">Operating Agreement</h4>
                        <span className="font-mono text-[9px] font-bold uppercase bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded border border-neutral-200">
                          Legal
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                        Affiliate terms of operation, FTC disclosure standards, and 14-day clearance guidelines.
                      </p>
                    </div>
                  </Link>

                </div>

                {/* Bottom Bar with Direct Links */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-neutral-300 text-xs text-neutral-600">
                  <div className="flex items-center gap-5 font-medium">
                    <Link href="/partner/docs#products" onClick={closeDropdown} className="hover:text-black">7 Software Portfolio</Link>
                    <Link href="/faq" onClick={closeDropdown} className="hover:text-black">Partner FAQs</Link>
                    <Link href="/about" onClick={closeDropdown} className="hover:text-black">About Innotek</Link>
                  </div>
                  <Link
                    href="/partner/docs"
                    onClick={closeDropdown}
                    className="font-bold text-black hover:underline inline-flex items-center gap-1"
                  >
                    <span>Read Partner Docs</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

      {/* 6. MEGA-MENU CONTAINER: RESOURCES */}
      <div
        className={`absolute left-0 right-0 top-full z-50 bg-[#F7F5F0] text-[#09090B] border-t border-neutral-300 shadow-2xl transition-all duration-300 ease-out origin-top ${
          activeDropdown === 'resources'
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-2 invisible pointer-events-none'
        }`}
        onMouseEnter={() => {
          if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        }}
        onMouseLeave={handleMouseLeave}
      >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-12 gap-8 items-start">
              
              {/* Left Column */}
              <div className="col-span-12 lg:col-span-4 space-y-4 pr-4 border-r border-neutral-300">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  RESOURCES
                </span>
                <h3 className="font-display text-2xl font-extrabold text-[#09090B] leading-tight">
                  Ecosystem resources in your back pocket
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Perfect your affiliate marketing strategy with our curated collection of promotion guides, creative kits, and conversion blueprints.
                </p>
                <div className="pt-2">
                  <Link
                    href="/partner/docs"
                    onClick={closeDropdown}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
                  >
                    <span>All partner guides →</span>
                  </Link>
                </div>
              </div>

              {/* Center Grid: 4 Rich Cards with Previews */}
              <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-3.5">
                
                {/* 1: Partner Documentation */}
                <Link
                  href="/partner/docs"
                  onClick={closeDropdown}
                  className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs hover:border-black hover:shadow-md transition group flex flex-col"
                >
                  <div className="h-20 w-full overflow-hidden bg-neutral-100">
                    <img
                      src="/images/resources/playbook-guide.jpg"
                      alt="Partner Documentation"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-xs text-[#09090B] group-hover:underline">Partner Documentation</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                      Step-by-step blueprints to maximize recurring payouts.
                    </p>
                  </div>
                </Link>

                {/* 2: About Innotek */}
                <Link
                  href="/about"
                  onClick={closeDropdown}
                  className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs hover:border-black hover:shadow-md transition group flex flex-col"
                >
                  <div className="h-20 w-full overflow-hidden bg-neutral-100">
                    <img
                      src="/images/resources/about-innotek.jpg"
                      alt="About Innotek"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-xs text-[#09090B] group-hover:underline">About Innotek Global</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                      London-headquartered AI software studio background.
                    </p>
                  </div>
                </Link>

                {/* 3: Partner FAQs */}
                <Link
                  href="/faq"
                  onClick={closeDropdown}
                  className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs hover:border-black hover:shadow-md transition group flex flex-col"
                >
                  <div className="h-20 w-full overflow-hidden bg-neutral-100">
                    <img
                      src="/images/resources/partner-faq.jpg"
                      alt="Partner FAQs"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-xs text-[#09090B] group-hover:underline">Partner FAQs</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                      Clear answers to cookies, payouts, and clearance buffers.
                    </p>
                  </div>
                </Link>

                {/* 4: Operating Agreement */}
                <Link
                  href="/affiliate-agreement"
                  onClick={closeDropdown}
                  className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs hover:border-black hover:shadow-md transition group flex flex-col"
                >
                  <div className="h-20 w-full overflow-hidden bg-neutral-100">
                    <img
                      src="/images/resources/operating-agreement.jpg"
                      alt="Operating Agreement"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-xs text-[#09090B] group-hover:underline">Operating Agreement</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                      Standard commercial and compliance legal terms.
                    </p>
                  </div>
                </Link>
              </div>

              {/* Right Column: Newsletter Signup Card */}
              <div className="col-span-12 lg:col-span-3 rounded-xl border border-neutral-300 bg-white p-5 space-y-3 shadow-xs">
                <h4 className="font-display text-base font-extrabold text-[#09090B]">
                  Get free ecosystem advice
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Sign up for our partner dispatch to enjoy premium AI product release alerts and conversion tactics you can't get anywhere else.
                </p>

                <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs text-[#09090B] placeholder-neutral-400 outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-black py-2 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs"
                  >
                    {newsletterSubscribed ? 'Subscribed!' : 'Subscribe'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-6 space-y-4 max-h-[85vh] overflow-y-auto">
          
          {/* Section: For Partners & Publishers */}
          <div className="space-y-1 border-b border-neutral-100 pb-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 block">
              PARTNERS &amp; PUBLISHERS
            </span>
            <Link
              href="/partner/docs"
              onClick={closeDropdown}
              className="flex items-center justify-between px-3 py-2 text-sm font-bold text-neutral-800 rounded-lg hover:bg-neutral-100"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-black" />
                <span>Partner Documentation</span>
              </div>
              <span className="font-mono text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                NEW
              </span>
            </Link>
            <Link
              href="/dev/docs"
              onClick={closeDropdown}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-neutral-800 rounded-lg hover:bg-neutral-100"
            >
              <Cpu className="h-4 w-4 text-black" />
              <span>Developer SDK &amp; Webhooks</span>
            </Link>
            <Link
              href="/affiliate"
              onClick={closeDropdown}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-neutral-800 rounded-lg hover:bg-neutral-100"
            >
              <Coins className="h-4 w-4 text-black" />
              <span>Commission Tiers (20% – 30%)</span>
            </Link>
          </div>

          {/* Section: Platform & Solutions */}
          <div className="space-y-1 border-b border-neutral-100 pb-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 block">
              PLATFORM &amp; ECOSYSTEM
            </span>
            <Link
              href="/#tour"
              onClick={closeDropdown}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-neutral-800 rounded-lg hover:bg-neutral-100"
            >
              <Play className="h-4 w-4 text-black" />
              <span>Live Simulator Demo</span>
            </Link>
            <Link
              href="/partner/docs#products"
              onClick={closeDropdown}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-neutral-800 rounded-lg hover:bg-neutral-100"
            >
              <Sparkles className="h-4 w-4 text-black" />
              <span>7 AI Applications Portfolio</span>
            </Link>
          </div>

          {/* Section: Company & Legal */}
          <div className="space-y-1 pb-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 block">
              RESOURCES &amp; COMPANY
            </span>
            <Link
              href="/about"
              onClick={closeDropdown}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-neutral-800 rounded-lg hover:bg-neutral-100"
            >
              <Building2 className="h-4 w-4 text-black" />
              <span>About Innotek Global</span>
            </Link>
            <Link
              href="/faq"
              onClick={closeDropdown}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-neutral-800 rounded-lg hover:bg-neutral-100"
            >
              <HelpCircle className="h-4 w-4 text-black" />
              <span>Partner FAQ Guide</span>
            </Link>
            <Link
              href="/affiliate-agreement"
              onClick={closeDropdown}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-neutral-800 rounded-lg hover:bg-neutral-100"
            >
              <FileText className="h-4 w-4 text-black" />
              <span>Operating Agreement</span>
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 border-t border-neutral-200 flex flex-col gap-2">
            <Link
              href="/register"
              onClick={closeDropdown}
              className="w-full text-center rounded-lg bg-black py-2.5 text-sm font-bold text-white hover:bg-neutral-800"
            >
              Apply for Partner Access
            </Link>
            <Link
              href="/login"
              onClick={closeDropdown}
              className="w-full text-center rounded-lg border border-neutral-300 py-2.5 text-sm font-bold text-neutral-800 hover:bg-neutral-50"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
