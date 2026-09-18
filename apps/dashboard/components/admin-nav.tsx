'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Layers,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { logoutAction } from '@/app/(dashboard)/actions';

const ADMIN_TABS = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Partners', href: '/admin/users', icon: Users },
  { name: 'Revenue & Profit', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Products Manage', href: '/admin/products', icon: Layers },
  { name: 'Settlements & Approvals', href: '/admin/settings', icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white shadow-xs font-sans">
      {/* Top row: Brand & Actions */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-8 w-auto flex items-center">
              <img
                src="/logos/innotek.png"
                alt="Innotek Global"
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
              <span>Executive Admin</span>
            </span>
          </Link>
        </div>

        {/* Top Right: User Avatar & Popover Menu (Sign Out hidden inside) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 rounded-md p-1 hover:bg-neutral-100 transition cursor-pointer outline-none focus:ring-2 focus:ring-black/10"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div className="h-8 w-8 rounded-md bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              AD
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-black leading-tight">Admin Console</span>
              <span className="text-[10px] text-neutral-500 leading-tight">admin@innotek.global</span>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${menuOpen ? 'rotate-180 text-black' : ''}`} />
          </button>

          {/* Floating Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-md border border-neutral-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 text-xs font-sans">
              {/* Profile Header */}
              <div className="px-3 py-2.5 border-b border-neutral-100 mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-md bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    AD
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-black truncate">Executive Administrator</p>
                    <p className="text-[11px] text-neutral-500 font-mono truncate">admin@innotek.global</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>Platform Operations Active</span>
                </div>
              </div>

              {/* Navigation Shortcuts */}
              <div className="py-1 space-y-0.5 text-neutral-700">
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-sm hover:bg-neutral-100 hover:text-black transition font-medium"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Executive Overview</span>
                </Link>
                <Link
                  href="/admin/users"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-sm hover:bg-neutral-100 hover:text-black transition font-medium"
                >
                  <Users className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Partner Moderation</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-sm hover:bg-neutral-100 hover:text-black transition font-medium"
                >
                  <Settings className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Settlement Governance</span>
                </Link>
              </div>

              <div className="border-t border-neutral-100 my-1 pt-1">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-sm transition cursor-pointer text-left"
                  >
                    <LogOut className="h-3.5 w-3.5 text-rose-600" />
                    <span>Sign Out from Admin</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Second row: Clean Tabs Navigation with underline when active, no black card */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-6 overflow-x-auto scrollbar-none" aria-label="Admin Tabs">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.href === '/admin' ? pathname === '/admin' : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`group relative flex items-center gap-2 py-3 text-xs sm:text-sm transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-black font-bold'
                    : 'text-neutral-500 hover:text-black font-medium'
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-black' : 'text-neutral-400 group-hover:text-black'
                  }`}
                />
                <span>{tab.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-t-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
