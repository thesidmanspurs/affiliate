import Link from 'next/link';
import {
  TrendingUp,
  Coins,
  DollarSign,
  Users,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock,
  PieChart,
  Settings,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { AdminChart } from '@/components/admin-chart';

export const dynamic = 'force-dynamic';

interface AdminOverview {
  totalGmv: number;
  totalCommission: number;
  netProfit: number;
  profitMarginPercent: number;
  totalAffiliates: number;
  activeAffiliates: number;
  totalConversions: number;
  approvedConversions: number;
  pendingPayoutsCount: number;
  pendingPayoutsAmount: number;
  currency: string;
}

export default async function AdminOverviewPage() {
  let overview: AdminOverview = {
    totalGmv: 0,
    totalCommission: 0,
    netProfit: 0,
    profitMarginPercent: 100,
    totalAffiliates: 0,
    activeAffiliates: 0,
    totalConversions: 0,
    approvedConversions: 0,
    pendingPayoutsCount: 0,
    pendingPayoutsAmount: 0,
    currency: 'USD',
  };

  try {
    const res = await fetch('http://localhost:4100/api/admin/overview', { cache: 'no-store' });
    if (res.ok) {
      overview = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch admin overview:', err);
  }

  const formatMoney = (cents: number) => {
    return '$' + (cents / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="space-y-6 text-[#09090B] font-sans pb-16">
      {/* Admin Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Platform Governance &amp; Ledger Control</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
            Executive Admin Portal
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600">
            Real-time Gross Merchandise Value (GMV), multi-product affiliate liabilities, and net company margins.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1.5 rounded-md bg-black px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-neutral-800 transition cursor-pointer"
          >
            <PieChart className="h-3.5 w-3.5" />
            <span>Product Profit Analytics</span>
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-neutral-800 hover:bg-neutral-50 transition shadow-2xs cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-neutral-500" />
            <span>Batch Approvals</span>
          </Link>
        </div>
      </div>

      {/* Financial Health Top KPI Grid (High-End Enterprise Styling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales (GMV) */}
        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Gross Sales (GMV)</span>
              <div className="h-8 w-8 rounded-md bg-neutral-50 border border-neutral-200/80 flex items-center justify-center text-neutral-800 shadow-2xs">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
              {formatMoney(overview.totalGmv)}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded text-[11px]">
              ↑ +24.8%
            </span>
            <span className="text-neutral-500 text-[11px]">Across 7 Innotek products</span>
          </div>
        </div>

        {/* Partner Liability */}
        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Partner Liability</span>
              <div className="h-8 w-8 rounded-md bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs">
                <Coins className="h-4 w-4" />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
              {formatMoney(overview.totalCommission)}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded text-[11px]">
              {overview.totalGmv > 0 ? ((overview.totalCommission / overview.totalGmv) * 100).toFixed(1) : '0.0'}% of GMV
            </span>
            <span className="text-neutral-500 text-[11px]">Accrued &amp; paid rewards</span>
          </div>
        </div>

        {/* Net Retained Profit */}
        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Net Company Profit</span>
              <div className="h-8 w-8 rounded-md bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
              {formatMoney(overview.netProfit)}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded text-[11px]">
              {overview.profitMarginPercent}% Margin
            </span>
            <span className="text-neutral-500 text-[11px]">Retained company earnings</span>
          </div>
        </div>

        {/* Pending Payout Requests */}
        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Pending Payouts</span>
              <div className="h-8 w-8 rounded-md bg-neutral-50 border border-neutral-200/80 flex items-center justify-center text-rose-600 shadow-2xs">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
              {overview.pendingPayoutsCount} <span className="text-sm font-normal text-neutral-500">requests</span>
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500 text-[11px] font-mono">
              {formatMoney(overview.pendingPayoutsAmount)} queue
            </span>
            <Link href="/admin/settings" className="text-[11px] font-bold text-black hover:underline inline-flex items-center gap-0.5">
              <span>Review Queue</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Admin Performance Chart (Exact PartnerStack Visual Language) */}
      <AdminChart overview={overview} />

      {/* Ecosystem Statistics & Operations Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partner Community Health Card */}
        <div className="rounded-md border border-neutral-200 bg-white p-6 space-y-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-[#09090B] flex items-center gap-2">
              <Users className="h-4 w-4 text-black" />
              <span>Partner Community</span>
            </h2>
            <Link href="/admin/users" className="text-xs font-bold text-neutral-700 hover:text-black hover:underline">
              Manage all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-3.5">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">Total Registered</span>
              <p className="font-display text-2xl font-extrabold text-[#09090B] mt-1">{overview.totalAffiliates}</p>
              <span className="text-[10px] text-neutral-400 mt-1 block">Creators &amp; Agencies</span>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-3.5">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">Active Earners</span>
              <p className="font-display text-2xl font-extrabold text-emerald-900 mt-1">{overview.activeAffiliates}</p>
              <span className="text-[10px] text-emerald-700 mt-1 block">Live tracking links</span>
            </div>
          </div>
        </div>

        {/* Conversion Audit Engine Card */}
        <div className="rounded-md border border-neutral-200 bg-white p-6 space-y-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-[#09090B] flex items-center gap-2">
              <Layers className="h-4 w-4 text-black" />
              <span>Conversion Audit Engine</span>
            </h2>
            <Link href="/admin/analytics" className="text-xs font-bold text-neutral-700 hover:text-black hover:underline">
              Product share →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-3.5">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">Total Conversions</span>
              <p className="font-display text-2xl font-extrabold text-[#09090B] mt-1">{overview.totalConversions}</p>
              <span className="text-[10px] text-neutral-400 mt-1 block">Sourced orders</span>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-3.5">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">Approved Orders</span>
              <p className="font-display text-2xl font-extrabold text-emerald-900 mt-1">{overview.approvedConversions}</p>
              <span className="text-[10px] text-emerald-700 mt-1 block">Cleared for reward</span>
            </div>
          </div>
        </div>

        {/* Governance Routine Card */}
        <div className="rounded-md border border-neutral-200 bg-white p-6 flex flex-col justify-between shadow-2xs hover:shadow-xs transition">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Governance Routine</span>
            </div>
            <h3 className="font-display text-base font-bold text-[#09090B]">Daily Operations Protocol</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              1. Review pending partner applications in Moderation.<br />
              2. Batch release commissions past 14-day clearing hold.<br />
              3. Settle pending Stripe payouts &amp; record wire reference IDs.
            </p>
          </div>
          <div className="pt-4 border-t border-neutral-100">
            <Link
              href="/admin/analytics"
              className="text-xs font-bold text-black hover:underline flex items-center gap-1"
            >
              <span>Inspect Product Margins Matrix</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
