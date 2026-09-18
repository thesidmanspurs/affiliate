'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  Download,
  HelpCircle,
  ExternalLink,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface CommissionRecord {
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

export interface FinancialSummary {
  availableBalance: number;
  pendingBuffer: number;
  totalSettled: number;
}

export interface AffiliateProfile {
  id: string;
  email: string;
  code: string;
  status: string;
  commissionRate: number;
  onboardingData?: {
    tax?: {
      formType?: string;
      taxClassification?: string;
      legalName?: string;
      taxId?: string;
      taxResidenceCountry?: string;
      certificationAccepted?: boolean;
    };
    payout?: {
      method?: string;
      beneficiaryName?: string;
      bankName?: string;
      accountNumberOrIban?: string;
      currency?: string;
    };
  } | null;
}

export function CommissionsClient({
  initialSummary,
  profile,
  initialCommissions = [],
  initialPrograms = [],
}: {
  initialSummary?: FinancialSummary | null;
  profile: AffiliateProfile;
  initialCommissions?: CommissionRecord[];
  initialPrograms?: any[];
}) {
  const summary: FinancialSummary = {
    availableBalance: initialSummary?.availableBalance || 0,
    pendingBuffer: initialSummary?.pendingBuffer || 0,
    totalSettled: initialSummary?.totalSettled || 0,
  };

  const [activeSubTab, setActiveSubTab] = useState<'rewards' | 'withdrawals'>('rewards');

  // Check if partner has certified tax info
  const tax = profile.onboardingData?.tax;
  const hasTaxInfo = Boolean(
    tax?.taxId || tax?.certificationAccepted || tax?.taxResidenceCountry
  );

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  return (
    <div className="space-y-5 text-[#09090B] pb-16 max-w-6xl mx-auto font-sans bg-white">
      
      {/* 1. Header */}
      <div className="space-y-0.5">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          INNOTEK GLOBAL
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#09090B]">
          Rewards &amp; withdrawals
        </h1>
      </div>

      {/* 2. Notice Alert Banner */}
      {!hasTaxInfo ? (
        <div className="rounded-none border border-rose-300 bg-rose-50/80 p-4 text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Tax certification required: </strong>
              <span>Under HMRC / IRS compliance standards, you must certify your tax declaration before receiving automated payouts.</span>
            </div>
          </div>

          <Link
            href="/settings?tab=tax"
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-950 bg-rose-200/80 hover:bg-rose-200 px-3 py-1.5 rounded-none transition shrink-0 self-start sm:self-auto"
          >
            <span>Complete tax info &rarr;</span>
          </Link>
        </div>
      ) : null}

      {/* 3. Three Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Card 1: Available Rewards */}
        <div className="rounded-none border border-neutral-300 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Available rewards
              </span>
              <span className="rounded-none bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 text-[10px] font-bold">
                USD
              </span>
            </div>

            <p className="text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
              {formatMoney(summary.availableBalance)}
            </p>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Available rewards can be withdrawn to your verified payout rail anytime.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <Link
              href="/settings?tab=payout"
              className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1"
            >
              <span>Payout settings &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Lifetime Withdrawn */}
        <div className="rounded-none border border-neutral-300 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Lifetime withdrawn
              </span>
              <span className="rounded-none bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 text-[10px] font-bold">
                Cleared
              </span>
            </div>

            <p className="text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
              {formatMoney(summary.totalSettled)}
            </p>

            <p className="text-xs text-neutral-500 leading-relaxed">
              All lifetime withdrawals transferred to your bank wire, PayPal, or Stripe rail.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Settled payouts: <strong>100%</strong></span>
            <span className="text-emerald-700 font-bold">Verified</span>
          </div>
        </div>

        {/* Card 3: Pending Approval */}
        <div className="rounded-none border border-neutral-300 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Pending approval
              </span>
              <span className="rounded-none bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 text-[10px] font-bold">
                Buffer
              </span>
            </div>

            <p className="text-2xl sm:text-3xl font-extrabold text-neutral-400 tracking-tight">
              {formatMoney(summary.pendingBuffer)}
            </p>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Pending rewards during 14-day anti-fraud buffer window before automated settlement.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-500">
            <span>Hold window: 14 days</span>
            <span className="text-emerald-700 font-bold">Auto-clearing</span>
          </div>
        </div>

      </div>

      {/* 4. Isolated Product Revenue Streams Breakdown Table ("mỗi product là một nguồn thu riêng, không gộp") */}
      {initialPrograms && initialPrograms.length > 0 && (
        <div className="rounded-none border border-neutral-300 bg-white shadow-2xs overflow-hidden">
          <div className="border-b border-neutral-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-black" />
                <h3 className="text-sm sm:text-base font-extrabold text-[#09090B]">
                  Sourced Revenue &amp; Earnings by Program
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-none">
                  Isolated Streams
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Each product is an isolated revenue source with independent conversion attribution and commission settlements.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-black hover:underline self-start sm:self-auto"
            >
              Browse all programs &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Enrollment Status</th>
                  <th className="py-3 px-4 text-right">Commission Rate</th>
                  <th className="py-3 px-4 text-right">Attributed Sales</th>
                  <th className="py-3 px-4 text-right">Sourced Revenue</th>
                  <th className="py-3 px-4 text-right">Earned Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {initialPrograms.map((p) => {
                  const isEnrolled = p.status === 'ACTIVE';
                  const perf = p.performance || { conversionsCount: 0, sourcedRevenue: 0, earnedCommission: 0 };
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/70 transition">
                      <td className="py-3.5 px-4">
                        <strong className="text-xs font-bold text-neutral-900 block">{p.name}</strong>
                        <span className="text-[10px] text-neutral-400">{p.category}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isEnrolled ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-none">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-300 px-2 py-0.5 rounded-none">
                            <span>Available</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-neutral-700">
                        {(p.defaultCommissionRate * 100).toFixed(0)}% {p.commissionType === 'recurring' ? 'Rec.' : 'Sale'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-neutral-900">
                        {perf.conversionsCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-neutral-900">
                        ${(perf.sourcedRevenue / 100).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                        ${(perf.earnedCommission / 100).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Sub-tabs & Filter Toolbar */}
      <div className="rounded-none border border-neutral-300 bg-white shadow-2xs overflow-hidden">
        
        {/* Tab Strip */}
        <div className="border-b border-neutral-200 px-6 pt-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setActiveSubTab('rewards')}
              className={`relative pb-3 text-xs sm:text-[13px] transition cursor-pointer ${
                activeSubTab === 'rewards' ? 'font-bold text-black' : 'font-medium text-neutral-500 hover:text-black'
              }`}
            >
              <span>Rewards Activity</span>
              {activeSubTab === 'rewards' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />}
            </button>
            <button
              onClick={() => setActiveSubTab('withdrawals')}
              className={`relative pb-3 text-xs sm:text-[13px] transition cursor-pointer ${
                activeSubTab === 'withdrawals' ? 'font-bold text-black' : 'font-medium text-neutral-500 hover:text-black'
              }`}
            >
              <span>Withdrawals History</span>
              {activeSubTab === 'withdrawals' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-500 pb-2">
            <button className="hover:text-black inline-flex items-center gap-1 font-medium cursor-pointer">
              <span>Export CSV</span>
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-neutral-50 border-b border-neutral-200 font-medium text-neutral-500 text-[11px]">
              <tr>
                <th className="px-6 py-3 font-semibold">Earned &darr;</th>
                <th className="px-6 py-3 font-semibold">Program</th>
                <th className="px-6 py-3 font-semibold">Source / Event</th>
                <th className="px-6 py-3 font-semibold">Reward status</th>
                <th className="px-6 py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {initialCommissions.length > 0 ? (
                initialCommissions.map((c) => (
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
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold border ${
                        c.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : c.status === 'PAID'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-black">
                      {formatMoney(c.commissionAmount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                    <p className="text-xs font-bold text-neutral-600">No reward transactions recorded yet</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">When customers purchase via your links, transaction events will clear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
