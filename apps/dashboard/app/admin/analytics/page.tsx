import Link from 'next/link';
import {
  PieChart,
  DollarSign,
  Coins,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { AdminAnalyticsChart, ProductAnalyticsItem } from '@/components/admin-analytics-chart';

export const dynamic = 'force-dynamic';

const LOGO_MAP: Record<string, string> = {
  moodscanr: '/logos/moodscanr.png',
  halalscanr: '/logos/halalscanr.png',
  fanscanr: '/logos/fanscanr.png',
  headshot: '/logos/headshot.png',
  talentscanr: '/logos/talentscanr.png',
  'voice-agent': '/logos/callscanr.png',
  aqiscanr: '/logos/aqiscanr.svg',
};

export default async function AdminAnalyticsPage() {
  let analytics: ProductAnalyticsItem[] = [];

  try {
    const res = await fetch('http://localhost:4100/api/admin/products/analytics', {
      cache: 'no-store',
    });
    if (res.ok) {
      analytics = await res.json();
    }
  } catch (err) {
    console.error('Failed to load product analytics:', err);
  }

  const formatMoney = (cents: number) => {
    return '$' + (cents / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalPlatformSales = analytics.reduce((sum, p) => sum + p.totalSales, 0);
  const totalPlatformCommission = analytics.reduce((sum, p) => sum + p.totalCommission, 0);
  const totalPlatformProfit = totalPlatformSales - totalPlatformCommission;
  const overallMargin = totalPlatformSales > 0 ? ((totalPlatformProfit / totalPlatformSales) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-6 text-[#09090B] font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1.5">
            <PieChart className="h-4 w-4" />
            <span>Multi-Product Unit Economics</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
            Revenue - Commission - Profit per Product
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600">
            Compare financial performance, affiliate commission overhead, and net retained margins across all 7 Innotek software products.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-xs shadow-2xs">
            <span className="text-neutral-500">Platform Margin: </span>
            <strong className="text-emerald-700 font-extrabold">{overallMargin}%</strong>
          </div>

          <Link
            href="/admin/analytics/report"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 hover:text-black transition shadow-2xs cursor-pointer"
            title="Open Statutory Financial Statement & Operating Margin Ledger"
          >
            <FileText className="h-3.5 w-3.5 text-neutral-600" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Aggregate Cards (High-End Enterprise Format) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Portfolio GMV</span>
              <div className="h-8 w-8 rounded-md bg-neutral-50 border border-neutral-200/80 flex items-center justify-center text-neutral-800 shadow-2xs">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
              {formatMoney(totalPlatformSales)}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded text-[11px]">
              ↑ Active
            </span>
            <span className="text-neutral-500 text-[11px]">Gross subscriber billings</span>
          </div>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Total Affiliate Payouts</span>
              <div className="h-8 w-8 rounded-md bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs">
                <Coins className="h-4 w-4" />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
              {formatMoney(totalPlatformCommission)}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded text-[11px]">
              {totalPlatformSales > 0 ? ((totalPlatformCommission / totalPlatformSales) * 100).toFixed(1) : '0.0'}% of GMV
            </span>
            <span className="text-neutral-500 text-[11px]">Commissions disbursed &amp; accrued</span>
          </div>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Net Portfolio Profit</span>
              <div className="h-8 w-8 rounded-md bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
              {formatMoney(totalPlatformProfit)}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded text-[11px]">
              {overallMargin}% Margin
            </span>
            <span className="text-neutral-500 text-[11px]">Net retained margin after affiliate costs</span>
          </div>
        </div>
      </div>

      {/* Multi-Product Performance Curve Chart (Partner Design Language) */}
      <AdminAnalyticsChart products={analytics} />

      {/* Deep Multi-Product Analytics Table */}
      <div className="rounded-md border border-neutral-200 bg-white shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <h2 className="font-display text-base font-bold text-[#09090B]">
            7 Innotek Products Financial Comparison
          </h2>
          <Link
            href="/admin/analytics/report"
            className="text-xs font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Statutory Details &rarr;</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-6">Product Name</th>
                <th className="py-3 px-4">Gross Sales (GMV)</th>
                <th className="py-3 px-4">Commission Expense</th>
                <th className="py-3 px-4">Net Company Profit</th>
                <th className="py-3 px-4">Profit Margin</th>
                <th className="py-3 px-4">Conversions</th>
                <th className="py-3 px-6">Traffic Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {analytics.map((p) => {
                const logoPath = LOGO_MAP[p.productId] || '/logos/innotek.png';
                return (
                  <tr key={p.merchantId} className="hover:bg-neutral-50/70 transition">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center shrink-0">
                          <img src={logoPath} alt={p.name} className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-[#09090B]">{p.name}</div>
                          <code className="text-[10px] text-neutral-500 font-mono">{p.productId}</code>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#09090B] font-mono">{formatMoney(p.totalSales)}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-700 font-mono">{formatMoney(p.totalCommission)}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono">{formatMoney(p.netProfit)}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-bold text-[11px]">
                        {p.profitMarginPercent}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#09090B] font-mono">{p.conversionCount}</td>
                    <td className="py-3.5 px-6 text-neutral-600 font-mono font-medium">{p.clickCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
