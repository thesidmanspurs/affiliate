'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  AlertCircle,
  ChevronDown,
  Download,
  HelpCircle,
  ExternalLink,
  FileText,
} from 'lucide-react';

interface CommissionRecord {
  id: string;
  productName: string;
  referralId: string;
  saleAmount: number;
  rate: number;
  commissionAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  createdAt: string;
  clearedAt: string;
}

interface FinancialSummary {
  availableBalance: number;
  pendingBuffer: number;
  totalSettled: number;
}

export default function CommissionsPage() {
  const [summary, setSummary] = useState<FinancialSummary>({
    availableBalance: 0,
    pendingBuffer: 0,
    totalSettled: 0,
  });

  const [hasTaxInfo, setHasTaxInfo] = useState(false);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);

  useEffect(() => {
    fetch('http://localhost:4100/api/affiliates/me/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSummary({
            availableBalance: data.approvedCommission || 0,
            pendingBuffer: data.pendingCommission || 0,
            totalSettled: data.paidCommission || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  return (
    <div className="space-y-5 text-[#09090B] pb-16 max-w-6xl mx-auto font-sans">
      
      {/* 1. Header (Screenshot 2: INNOTEK GLOBAL -> Rewards & withdrawals) */}
      <div className="space-y-0.5">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          INNOTEK GLOBAL
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#09090B]">
          Rewards &amp; withdrawals
        </h1>
      </div>

      {/* 2. Notice Alert Banner (Screenshot 2: Tax requirement alert) */}
      {!hasTaxInfo ? (
        <div className="rounded-xl border border-rose-300 bg-rose-50/70 p-4 text-xs text-rose-900 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Tax registration location required: </strong>
            <span>We need your tax registration location for compliance purposes before we can continue processing rewards for you.</span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-900 flex items-start gap-2.5">
          <FileText className="h-4 w-4 text-black shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Tax Declaration On File: </strong>
            <span>Your W-8BEN/W-9 certification is recorded. Withdrawals settle automatically on monthly NET-15 cadence.</span>
          </div>
        </div>
      )}

      {/* 3. Two Main Top KPI Cards (Screenshot 2: Total Available Balance & Projected Earnings) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Card: Total Available Balance (Col 7) */}
        <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-2xs space-y-4">
          <span className="text-xs font-medium text-neutral-600 block">
            Total available balance
          </span>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#09090B]">
            {formatMoney(summary.availableBalance)} USD
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-center">
            {/* Breakdown Table */}
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between py-1">
                <span>Total rewards</span>
                <span className="font-semibold text-neutral-800">{formatMoney(summary.availableBalance)} USD</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Processing fee</span>
                <span className="font-normal text-neutral-400">&mdash;</span>
              </div>
              <div className="border-t border-neutral-200 pt-1.5 flex justify-between font-bold text-neutral-900">
                <span>Total</span>
                <span className="font-mono">{formatMoney(summary.availableBalance)} USD</span>
              </div>
            </div>

            {/* Action Box */}
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-center space-y-2">
              <Link
                href="/settings"
                className="w-full inline-flex items-center justify-center rounded-lg bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs"
              >
                <span>{hasTaxInfo ? 'Request withdrawal' : 'Complete tax info to withdraw'}</span>
              </Link>
              <p className="text-[11px] text-neutral-500">
                Choose direct deposit, PayPal, Wise or USDT
              </p>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 pt-1">
            *Exchange rates may fluctuate at the time of withdrawal
          </p>
        </div>

        {/* Right Card: Projected Earnings (Col 5) */}
        <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1 text-xs text-neutral-600 cursor-pointer">
              <span>Projected earnings for</span>
              <strong className="text-black">this month</strong>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </div>

            <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#09090B]">
              {formatMoney(summary.pendingBuffer)} USD
            </p>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Total pending and approved rewards &amp; pending processing for Sep 2026.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-500">
            <span>Clearance hold: 14 days</span>
            <span className="text-emerald-700 font-bold">Auto-clearing</span>
          </div>
        </div>

      </div>

      {/* 4. Spotlight Banner in Rewards (Screenshot 2: ✦ NETWORK SPOTLIGHT - Monochrome Style) */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white border border-neutral-200 p-2.5 flex items-center justify-center shadow-xs shrink-0">
              <img src="/logos/headshot.png" alt="Headshot" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  ✦ NETWORK SPOTLIGHT
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#09090B] mt-0.5 flex items-center gap-2 flex-wrap">
                <span>Headshoot AI</span>
                <span className="text-xs text-neutral-600 font-normal">
                  &rarr; 30% Per Sale commission on all portrait packs
                </span>
              </h2>
              <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                Studio-grade 4K executive portrait generator for LinkedIn professionals, corporate teams, and creators.
              </p>
              <div className="mt-1">
                <a
                  href="https://headshot.innotek.global"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-500 hover:text-black inline-flex items-center gap-1 hover:underline font-medium"
                >
                  <span>headshot.innotek.global</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800 transition shadow-xs cursor-pointer"
            >
              <span>Join program</span>
            </Link>
            <button className="text-xs text-neutral-500 hover:text-neutral-800 hover:underline cursor-pointer">
              Dismiss
            </button>
          </div>
        </div>
      </div>

      {/* 5. Sub-tabs & Filter Toolbar (Screenshot 2: Rewards / Withdrawals) */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-2xs overflow-hidden">
        
        {/* Tab Strip */}
        <div className="border-b border-neutral-200 px-6 pt-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button className="relative pb-3 text-xs sm:text-[13px] font-bold text-black cursor-pointer">
              <span>Rewards</span>
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
            </button>
            <button className="relative pb-3 text-xs sm:text-[13px] font-medium text-neutral-500 hover:text-black cursor-pointer">
              <span>Withdrawals</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-500 pb-2">
            <a href="#reward-status" className="hover:text-black hidden sm:flex items-center gap-1">
              <span>Learn about reward statuses</span>
              <HelpCircle className="h-3.5 w-3.5" />
            </a>
            <button className="hover:text-black inline-flex items-center gap-1 font-medium cursor-pointer">
              <span>Export rewards</span>
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Filters Row (Screenshot 2) */}
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/40 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center justify-between rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-700">
            <span>Earned: <strong>All</strong></span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-700">
            <span>Program: <strong>All</strong></span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-700">
            <span>Reward status: <strong>All</strong></span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-700">
            <span>Estimated withdrawal date: <strong>All</strong></span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          </div>
        </div>

        {/* Ledger Table (Screenshot 2) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-neutral-50 border-b border-neutral-200 font-medium text-neutral-500 text-[11px]">
              <tr>
                <th className="px-6 py-3 font-semibold">Earned &darr;</th>
                <th className="px-6 py-3 font-semibold">Program</th>
                <th className="px-6 py-3 font-semibold">Source</th>
                <th className="px-6 py-3 font-semibold">Reward status</th>
                <th className="px-6 py-3 font-semibold flex items-center gap-1">
                  <span>Estimated withdrawal date</span>
                  <HelpCircle className="h-3 w-3 text-neutral-400" />
                </th>
                <th className="px-6 py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {commissions.length > 0 ? (
                commissions.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4 font-mono text-neutral-700">
                      {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-black">
                      {c.productName}
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-500">
                      {c.referralId}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : c.status === 'PAID'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-500">
                      {c.clearedAt ? new Date(c.clearedAt).toLocaleDateString('en-US') : 'Immediate'}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-right text-emerald-700">
                      {formatMoney(c.commissionAmount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-neutral-500">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-neutral-800">No items to display</p>
                      <p className="text-xs text-neutral-400">
                        Commission rewards will appear here automatically when referred customers purchase.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer (Screenshot 2) */}
        <div className="p-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-500">
          <span>0 to {commissions.length} displayed</span>
          <div className="flex items-center gap-3">
            <button disabled className="text-neutral-300 cursor-not-allowed">&lsaquo; Previous</button>
            <button disabled className="text-neutral-300 cursor-not-allowed">Next &rsaquo;</button>
          </div>
          <div className="flex items-center gap-1.5">
            <span>25 per page</span>
            <ChevronDown className="h-3 w-3 text-neutral-400" />
          </div>
        </div>

      </div>

    </div>
  );
}
