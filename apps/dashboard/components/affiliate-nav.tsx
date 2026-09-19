'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ArrowRight,
  Grid,
  LogOut,
  Settings,
  ShieldCheck,
  Copy,
  Check,
  FileText,
  ChevronDown,
  Filter,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { logoutAction } from '@/app/(dashboard)/actions';

interface AffiliateNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  unread: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface AffiliateNavProps {
  affiliateCode: string;
  email: string;
  status: string;
  notifications?: AffiliateNotification[];
}

const TABS = [
  { name: 'Home', href: '/overview' },
  { name: 'Rewards', href: '/commissions' },
  { name: 'Explore Partnerships', href: '/products' },
];

const SIDEBAR_PROGRAMS = [
  {
    id: 'moodscanr',
    name: 'MoodScanr AI',
    rate: '20% Rec.',
    url: 'https://moodscanr.ai',
    logo: '/logos/moodscanr.png',
    category: 'Video & Sentiment AI',
  },
  {
    id: 'headshot',
    name: 'AI Headshot Pro',
    rate: '30% Per Sale',
    url: 'https://headshot.innotek.global',
    logo: '/logos/headshot.png',
    category: 'Generative AI Studio',
  },
  {
    id: 'halalscanr',
    name: 'HalalScanr',
    rate: '25% Rec.',
    url: 'https://halalscanr.innotek.global',
    logo: '/logos/halalscanr.png',
    category: 'Dietary & Food OCR',
  },
  {
    id: 'fanscanr',
    name: 'FanScanr Sports',
    rate: '20% Rec.',
    url: 'https://ftracker.innotek.global',
    logo: '/logos/fanscanr.png',
    category: 'Sports & Media AI',
  },
  {
    id: 'talentscanr',
    name: 'TalentScanr AI',
    rate: '20% Rec.',
    url: 'https://talent.innotek.global',
    logo: '/logos/talentscanr.png',
    category: 'HR Tech & Enterprise ATS',
  },
  {
    id: 'callscanr',
    name: 'CallScanr',
    rate: '15% Rec.',
    url: 'https://voice.innotek.global',
    logo: '/logos/callscanr.png',
    category: 'Voice AI & Telephony',
  },
  {
    id: 'aqiscanr',
    name: 'AQIScanr AI',
    rate: '20% Rec.',
    url: 'https://aqiscanr.innotek.global',
    logo: '/logos/aqiscanr.svg',
    category: 'Climate & CleanTech',
  },
];

export function AffiliateNav({ affiliateCode, email, status, notifications = [] }: AffiliateNavProps) {
  const pathname = usePathname();
  const [activeDrawer, setActiveDrawer] = useState<'programs' | 'notifications' | null>(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedProgId, setCopiedProgId] = useState<string | null>(null);

  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setShowAvatarMenu(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveDrawer(null);
        setShowAvatarMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(affiliateCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyProgramLink = (url: string, id: string) => {
    const link = `${url}/?ref=${affiliateCode}`;
    navigator.clipboard.writeText(link);
    setCopiedProgId(id);
    setTimeout(() => setCopiedProgId(null), 2000);
  };

  const isActive = status === 'ACTIVE';
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200 shadow-2xs font-sans">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
          
          {/* Left: Official Innotek Logo + Navigation Tabs */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/overview" className="flex items-center group">
              <div className="h-7 flex items-center justify-center hover:opacity-90 transition">
                <img
                  src="/logos/innotek.png"
                  alt="Innotek Global"
                  className="h-7 w-auto object-contain"
                />
              </div>
            </Link>

            {/* Center Navigation Tabs (100% English, Monochrome Black/White) */}
            <nav className="hidden md:flex items-center space-x-6 h-14">
              {TABS.map((tab) => {
                const isTabActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`relative flex items-center h-14 text-xs sm:text-[13px] font-medium transition cursor-pointer ${
                      isTabActive
                        ? 'text-black font-bold'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    <span>{tab.name}</span>
                    {isTabActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-4">
            
            {/* Button: Your programs (Opens Right Side Panel Drawer) */}
            {email.toLowerCase().includes('admin') && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700 transition"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Portal</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setActiveDrawer('programs')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-black transition cursor-pointer"
            >
              <Grid className="h-3.5 w-3.5" />
              <span>Your programs</span>
            </button>

            {/* Notification Bell (Opens Right Side Panel Drawer) */}
            <button
              type="button"
              onClick={() => setActiveDrawer('notifications')}
              className="relative rounded-full p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-black" />
              )}
            </button>

            {/* User Avatar with Integrated Dropdown */}
            <div className="relative" ref={avatarRef}>
              <button
                type="button"
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-neutral-100 transition cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-neutral-900 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                  {email ? email.substring(0, 2).toUpperCase() : 'PT'}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400 hidden sm:block" />
              </button>

              {/* Avatar Dropdown Menu */}
              {showAvatarMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl z-50 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-2 font-sans">
                  {/* User Info Header */}
                  <div className="p-2 border-b border-neutral-100">
                    <p className="font-bold text-black truncate">{email}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded ${
                          status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : status === 'PENDING_REVIEW'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {status === 'ACTIVE'
                          ? 'Active Partner'
                          : status === 'PENDING_REVIEW'
                          ? 'Pending Review'
                          : status === 'REJECTED'
                          ? 'Ineligible (7d)'
                          : 'Verification Req.'}
                      </span>

                      <div className="flex items-center gap-1 font-mono text-[11px] text-neutral-600 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
                        <span>{affiliateCode}</span>
                        <button
                          onClick={copyCode}
                          title="Copy Partner Code"
                          className="text-neutral-400 hover:text-black cursor-pointer"
                        >
                          {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-0.5">
                    {email.toLowerCase().includes('admin') && (
                      <Link
                        href="/admin"
                        onClick={() => setShowAvatarMenu(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100 transition font-bold border border-rose-200 mb-1"
                      >
                        <ShieldCheck className="h-4 w-4 text-rose-600" />
                        <span>Executive Admin Portal</span>
                      </Link>
                    )}

                    <Link
                      href="/settings"
                      onClick={() => setShowAvatarMenu(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-neutral-700 hover:text-black hover:bg-neutral-50 transition font-medium"
                    >
                      <Settings className="h-4 w-4 text-neutral-500" />
                      <span>Account Settings &amp; Payouts</span>
                    </Link>

                    <Link
                      href="/onboarding"
                      onClick={() => setShowAvatarMenu(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-neutral-700 hover:text-black hover:bg-neutral-50 transition font-medium"
                    >
                      <FileText className="h-4 w-4 text-neutral-500" />
                      <span>Tax Declaration &amp; Legal Compliance</span>
                    </Link>
                  </div>

                  {/* Sign Out Action */}
                  <div className="pt-2 border-t border-neutral-100">
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition font-medium text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Tab Row */}
        <div className="md:hidden flex space-x-1 overflow-x-auto px-4 py-2 border-t border-neutral-100 bg-neutral-50">
          {TABS.map((tab) => {
            const isTabActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold shrink-0 ${
                  isTabActive
                    ? 'bg-black text-white font-bold'
                    : 'text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* RIGHT SIDE PANEL / DRAWER (PARTNERSTACK SLIDE-OVER DRAWER) */}
      {activeDrawer !== null && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setActiveDrawer(null)}
          />

          {/* Slide-over Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl border-l border-neutral-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                  {activeDrawer === 'programs' ? (
                    <Grid className="h-4 w-4 text-black" />
                  ) : (
                    <Bell className="h-4 w-4 text-black" />
                  )}
                  <h2 className="font-display text-base font-bold text-[#09090B]">
                    {activeDrawer === 'programs' ? 'Your programs' : 'Notifications'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDrawer(null)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
                  title="Close panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* 1. YOUR PROGRAMS SIDE PANEL CONTENT */}
                {activeDrawer === 'programs' && (
                  <>
                    {!isActive ? (
                      /* Funnel Graphic Empty State (Exact Screenshot 2) */
                      <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-5">
                        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                          <div className="w-16 h-14 bg-neutral-100 rounded-2xl border border-neutral-200 flex items-center justify-center shadow-xs">
                            <Filter className="h-7 w-7 text-black" />
                          </div>
                        </div>

                        <div className="space-y-1.5 max-w-sm">
                          <h3 className="font-display text-base font-extrabold text-[#09090B]">
                            You don&apos;t have any programs yet
                          </h3>
                          <p className="text-xs text-neutral-500 leading-relaxed">
                            Visit our Marketplace to find the program that best fits your sales channels and industry focus.
                          </p>
                        </div>

                        <Link
                          href="/products"
                          onClick={() => setActiveDrawer(null)}
                          className="inline-flex items-center justify-center rounded-none bg-black px-6 py-3 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-sm"
                        >
                          <span>Explore programs</span>
                        </Link>
                      </div>
                    ) : (
                      /* Active Partner Programs List */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                          <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                            Active AI Partnerships (7)
                          </span>
                          <Link
                            href="/products"
                            onClick={() => setActiveDrawer(null)}
                            className="text-xs font-bold text-black hover:underline"
                          >
                            Explore full catalog →
                          </Link>
                        </div>

                        <div className="space-y-2.5">
                          {SIDEBAR_PROGRAMS.map((prog) => (
                            <div
                              key={prog.id}
                              className="p-3.5 border border-neutral-200 bg-white rounded-none hover:bg-neutral-50/80 transition flex items-center justify-between gap-3 shadow-2xs"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="h-12 w-12 min-w-12 rounded-none border border-neutral-200 bg-white p-1.5 flex items-center justify-center shrink-0">
                                  <img src={prog.logo} alt={prog.name} className="h-full w-full object-contain" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block truncate">
                                    {prog.category}
                                  </span>
                                  <h4 className="font-display text-sm font-bold text-[#09090B] truncate">
                                    {prog.name}
                                  </h4>
                                  <span className="text-xs font-semibold text-emerald-700 block">
                                    {prog.rate}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleCopyProgramLink(prog.url, prog.id)}
                                className="inline-flex items-center gap-1 rounded-none bg-black px-3 py-2 text-[11px] font-bold text-white hover:bg-neutral-800 transition shrink-0 cursor-pointer"
                              >
                                {copiedProgId === prog.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-400" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Get Link</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* 2. NOTIFICATIONS SIDE PANEL CONTENT */}
                {activeDrawer === 'notifications' && (
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      /* Empty Notifications State (Exact Screenshot 3) */
                      <div className="py-20 text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                          <Bell className="h-6 w-6" />
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
                          You&apos;ve read all notifications from the last 60 days.
                        </p>
                      </div>
                    ) : (
                      /* List of Notifications */
                      <div className="space-y-3">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border rounded-none space-y-2 transition ${
                              notif.unread
                                ? 'border-black bg-neutral-50/80'
                                : 'border-neutral-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-[#09090B] flex items-center gap-1.5">
                                {notif.unread && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
                                <span>{notif.title}</span>
                              </h4>
                              <span className="text-[11px] text-neutral-400 font-medium">
                                {new Date(notif.timestamp).toLocaleDateString()}
                              </span>
                            </div>

                            <p className="text-xs text-neutral-600 leading-relaxed">
                              {notif.message}
                            </p>

                            {notif.actionUrl && notif.actionLabel && (
                              <div className="pt-1">
                                <Link
                                  href={notif.actionUrl}
                                  onClick={() => setActiveDrawer(null)}
                                  className="inline-flex items-center gap-1 rounded-none bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
                                >
                                  <span>{notif.actionLabel}</span>
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>Innotek Partner Network</span>
                <button
                  type="button"
                  onClick={() => setActiveDrawer(null)}
                  className="text-black font-bold hover:underline cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
