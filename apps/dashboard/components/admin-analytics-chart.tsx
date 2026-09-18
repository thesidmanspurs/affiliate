'use client';

import { useState } from 'react';
import {
  DollarSign,
  Coins,
  TrendingUp,
  Layers,
  MousePointerClick,
  ChevronDown,
} from 'lucide-react';

export interface ProductAnalyticsItem {
  merchantId: string;
  productId: string;
  name: string;
  totalSales: number;
  totalCommission: number;
  netProfit: number;
  profitMarginPercent: number;
  conversionCount: number;
  clickCount: number;
  activeAffiliatesCount: number;
  currency: string;
}

interface AdminAnalyticsChartProps {
  products: ProductAnalyticsItem[];
}

type MetricType = 'sales' | 'commission' | 'profit' | 'conversions' | 'clicks';

export function AdminAnalyticsChart({ products }: AdminAnalyticsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('sales');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const totalSales = products.reduce((sum, p) => sum + p.totalSales, 0);
  const totalCommission = products.reduce((sum, p) => sum + p.totalCommission, 0);
  const totalProfit = totalSales - totalCommission;
  const totalConversions = products.reduce((sum, p) => sum + p.conversionCount, 0);
  const totalClicks = products.reduce((sum, p) => sum + p.clickCount, 0);
  const overallMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : '100.0';

  const metricTitles: Record<MetricType, { title: string; subtitle: string; isCurrency: boolean }> = {
    sales: {
      title: 'Gross Merchandise Value (GMV) per Product',
      subtitle: 'Comparative billing revenue across 7 Innotek software titles',
      isCurrency: true,
    },
    commission: {
      title: 'Affiliate Commission Overhead per Product',
      subtitle: 'Cumulative partner payout liability per product line',
      isCurrency: true,
    },
    profit: {
      title: 'Net Retained Enterprise Margin per Product',
      subtitle: 'Retained gross profit after subtracting affiliate rev-share',
      isCurrency: true,
    },
    conversions: {
      title: 'Conversion Order Volume per Product',
      subtitle: 'Total completed subscriber purchases and tier upgrades',
      isCurrency: false,
    },
    clicks: {
      title: 'Promotional Inbound Traffic per Product',
      subtitle: 'Unique customer clicks routed through partner referral tracking',
      isCurrency: false,
    },
  };

  const currentMeta = metricTitles[selectedMetric];

  // Map products into data points
  const pointsData = products.map((p) => {
    let val = 0;
    if (selectedMetric === 'sales') val = p.totalSales / 100;
    else if (selectedMetric === 'commission') val = p.totalCommission / 100;
    else if (selectedMetric === 'profit') val = p.netProfit / 100;
    else if (selectedMetric === 'conversions') val = p.conversionCount;
    else if (selectedMetric === 'clicks') val = p.clickCount;
    return {
      product: p,
      val,
      name: p.name.replace(' AI', '').replace(' Sports', ''),
      fullName: p.name,
    };
  });

  const maxVal = Math.max(...pointsData.map((d) => d.val), 1);

  const svgWidth = 800;
  const svgHeight = 160;
  const paddingX = 35;
  const paddingY = 20;

  const coords = pointsData.map((item, idx) => {
    const x = paddingX + (idx / Math.max(pointsData.length - 1, 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (item.val / maxVal) * (svgHeight - paddingY * 2);
    return { x, y, ...item };
  });

  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`
    : '';

  return (
    <div className="rounded-md border border-neutral-200 bg-white p-6 shadow-xs space-y-5 font-sans">
      {/* Header & Filter Controls Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#09090B] tracking-tight">
            Multi-Product Unit Economics &amp; Margin Chart
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cross-product portfolio distribution and financial liability analysis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 font-medium shadow-2xs">
            <span className="font-mono font-bold text-neutral-500">$</span>
            <span>Display in USD</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 font-medium shadow-2xs">
            <span>7 Products Matrix</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-neutral-900">{currentMeta.title}</h3>
            <span className="text-xs text-neutral-500 font-normal hidden sm:inline">
              &bull; {currentMeta.subtitle}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-black bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-sm">
            {selectedMetric === 'sales' && formatMoney(totalSales)}
            {selectedMetric === 'commission' && formatMoney(totalCommission)}
            {selectedMetric === 'profit' && formatMoney(totalProfit)}
            {selectedMetric === 'conversions' && `${totalConversions} Orders`}
            {selectedMetric === 'clicks' && `${totalClicks} Clicks`}
          </span>
        </div>

        {/* Interactive SVG Chart Canvas */}
        <div className="relative w-full h-44 bg-white overflow-hidden rounded-sm">
          {/* Dashed Horizontal Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
            <div className="w-full border-b border-dashed border-neutral-200" />
            <div className="w-full border-b border-dashed border-neutral-200" />
            <div className="w-full border-b border-dashed border-neutral-200" />
            <div className="w-full border-b border-dashed border-neutral-200" />
          </div>

          {/* SVG Elements */}
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="analyticsChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Fill */}
            {areaD && <path d={areaD} fill="url(#analyticsChartGradient)" />}

            {/* Line Stroke */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#09090B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {coords.map((c, i) => (
              <circle
                key={c.product.productId}
                cx={c.x}
                cy={c.y}
                r={hoveredIndex === i ? '4.5' : '3'}
                className={`fill-black stroke-white stroke-2 cursor-pointer transition-all ${
                  hoveredIndex === i ? 'scale-125' : ''
                }`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </svg>

          {/* Hover Tooltip */}
          {hoveredIndex !== null && coords[hoveredIndex] && (
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-full bg-black text-white text-[10px] font-mono px-2.5 py-1.5 rounded shadow-md z-10 whitespace-nowrap"
              style={{
                left: `${(coords[hoveredIndex].x / svgWidth) * 100}%`,
                top: `${(coords[hoveredIndex].y / svgHeight) * 100 - 8}%`,
              }}
            >
              <div className="font-bold text-white">{coords[hoveredIndex].fullName}</div>
              <div className="text-neutral-300">
                {currentMeta.isCurrency
                  ? '$' + coords[hoveredIndex].val.toLocaleString('en-US', { minimumFractionDigits: 2 })
                  : coords[hoveredIndex].val.toLocaleString()}{' '}
                ({coords[hoveredIndex].product.profitMarginPercent}% Margin)
              </div>
            </div>
          )}

          {/* X-Axis Product Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-[10px] text-neutral-400 font-sans">
            {coords.map((c) => (
              <span key={c.product.productId} className="truncate max-w-[80px] text-center">
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5 Tabbed Metric Selector Cards (Exact PartnerStack Style) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
        {/* Tab 1: Total Sales */}
        <button
          type="button"
          onClick={() => setSelectedMetric('sales')}
          className={`p-3.5 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'sales'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span
              className={`text-xs font-medium ${
                selectedMetric === 'sales' ? 'text-black font-bold' : 'text-neutral-600'
              }`}
            >
              Total Portfolio GMV
            </span>
            <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {formatMoney(totalSales)}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            7 active software products
          </span>
        </button>

        {/* Tab 2: Affiliate Commission */}
        <button
          type="button"
          onClick={() => setSelectedMetric('commission')}
          className={`p-3.5 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'commission'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span
              className={`text-xs font-medium ${
                selectedMetric === 'commission' ? 'text-black font-bold' : 'text-neutral-600'
              }`}
            >
              Commission Overhead
            </span>
            <Coins className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {formatMoney(totalCommission)}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            Total partner compensation
          </span>
        </button>

        {/* Tab 3: Net Portfolio Profit */}
        <button
          type="button"
          onClick={() => setSelectedMetric('profit')}
          className={`p-3.5 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'profit'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span
              className={`text-xs font-medium ${
                selectedMetric === 'profit' ? 'text-black font-bold' : 'text-neutral-600'
              }`}
            >
              Net Company Profit
            </span>
            <TrendingUp className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {formatMoney(totalProfit)}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1">
            {overallMargin}% Portfolio Margin
          </span>
        </button>

        {/* Tab 4: Conversions */}
        <button
          type="button"
          onClick={() => setSelectedMetric('conversions')}
          className={`p-3.5 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'conversions'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span
              className={`text-xs font-medium ${
                selectedMetric === 'conversions' ? 'text-black font-bold' : 'text-neutral-600'
              }`}
            >
              Conversion Volume
            </span>
            <Layers className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {totalConversions}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            Approved purchases &amp; billings
          </span>
        </button>

        {/* Tab 5: Traffic Clicks */}
        <button
          type="button"
          onClick={() => setSelectedMetric('clicks')}
          className={`p-3.5 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'clicks'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span
              className={`text-xs font-medium ${
                selectedMetric === 'clicks' ? 'text-black font-bold' : 'text-neutral-600'
              }`}
            >
              Traffic Clicks
            </span>
            <MousePointerClick className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {totalClicks}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            Referral clicks mapped
          </span>
        </button>
      </div>

      {/* Sub-footer */}
      <div className="flex items-center justify-between pt-2 text-[11px] text-neutral-500 border-t border-neutral-100">
        <span>Analytics synchronized across 7 product APIs</span>
        <span className="text-black font-medium">Innotek Multi-Tenant Ledger</span>
      </div>
    </div>
  );
}
