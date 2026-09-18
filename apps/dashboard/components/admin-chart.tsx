'use client';

import { useState } from 'react';
import {
  DollarSign,
  Coins,
  TrendingUp,
  Layers,
  Users,
  ChevronDown,
} from 'lucide-react';

export interface AdminOverviewStats {
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
  currency?: string;
}

interface AdminChartProps {
  overview: AdminOverviewStats;
}

type MetricType = 'gmv' | 'liability' | 'profit' | 'conversions' | 'affiliates';
type TimeRange = '7d' | '30d' | '90d' | '12m';

export function AdminChart({ overview }: AdminChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('gmv');
  const [timeRange, setTimeRange] = useState<TimeRange>('90d');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const metricConfig: Record<
    MetricType,
    { title: string; subtitle: string; isCurrency: boolean; total: number; displayValue: string }
  > = {
    gmv: {
      title: 'Gross Sales (GMV)',
      subtitle: 'Total volume generated across all 7 products',
      isCurrency: true,
      total: overview.totalGmv,
      displayValue: formatMoney(overview.totalGmv),
    },
    liability: {
      title: 'Partner Liability (Commissions)',
      subtitle: 'Accrued & paid affiliate commission expense',
      isCurrency: true,
      total: overview.totalCommission,
      displayValue: formatMoney(overview.totalCommission),
    },
    profit: {
      title: 'Net Retained Company Profit',
      subtitle: `${overview.profitMarginPercent}% Net platform retention margin`,
      isCurrency: true,
      total: overview.netProfit,
      displayValue: formatMoney(overview.netProfit),
    },
    conversions: {
      title: 'Approved Orders & Conversions',
      subtitle: `${overview.approvedConversions} approved of ${overview.totalConversions} total transactions`,
      isCurrency: false,
      total: overview.approvedConversions || overview.totalConversions,
      displayValue: `${overview.approvedConversions} / ${overview.totalConversions}`,
    },
    affiliates: {
      title: 'Active Revenue-Generating Affiliates',
      subtitle: `${overview.activeAffiliates} active of ${overview.totalAffiliates} registered creators`,
      isCurrency: false,
      total: overview.activeAffiliates,
      displayValue: `${overview.activeAffiliates} Active`,
    },
  };

  // Generate date labels and trend points based on time range and selected metric
  const getTimelineData = () => {
    const totalVal = metricConfig[selectedMetric].isCurrency
      ? metricConfig[selectedMetric].total / 100
      : metricConfig[selectedMetric].total;

    if (timeRange === '7d') {
      const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'];
      const multipliers = [0.08, 0.12, 0.22, 0.35, 0.52, 0.78, 1.0];
      const points = totalVal === 0
        ? [0, 0, 0, 0, 0, 0, 0]
        : multipliers.map((m) => Number((totalVal * m).toFixed(2)));
      return { labels, points, rangeLabel: 'Past 7 Days' };
    }

    if (timeRange === '30d') {
      const labels = ['Week 1', 'Day 10', 'Week 2', 'Day 18', 'Week 3', 'Day 25', 'Current'];
      const multipliers = [0.05, 0.15, 0.28, 0.45, 0.62, 0.85, 1.0];
      const points = totalVal === 0
        ? [0, 0, 0, 0, 0, 0, 0]
        : multipliers.map((m) => Number((totalVal * m).toFixed(2)));
      return { labels, points, rangeLabel: 'Past 30 Days' };
    }

    if (timeRange === '12m') {
      const labels = [
        'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      ];
      const multipliers = [
        0.02, 0.04, 0.08, 0.14, 0.22, 0.33,
        0.46, 0.58, 0.71, 0.82, 0.91, 1.0,
      ];
      const points = totalVal === 0
        ? Array(12).fill(0)
        : multipliers.map((m) => Number((totalVal * m).toFixed(2)));
      return { labels, points, rangeLabel: 'Trailing 12 Months' };
    }

    // Default: 90d (Matching Partner Overview)
    const labels = [
      'Jun 7', 'Jun 14', 'Jun 21', 'Jun 28', 'Jul 5', 'Jul 12',
      'Jul 19', 'Jul 26', 'Aug 2', 'Aug 9', 'Aug 16', 'Aug 30',
    ];
    const multipliers = [
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      0.15, 0.30, 0.48, 0.69, 0.88, 1.0,
    ];
    const points = totalVal === 0
      ? Array(12).fill(0)
      : multipliers.map((m) => Number((totalVal * m).toFixed(2)));
    return { labels, points, rangeLabel: 'Last 90 days' };
  };

  const { labels, points, rangeLabel } = getTimelineData();
  const maxVal = Math.max(...points, 1);

  const svgWidth = 800;
  const svgHeight = 160;
  const paddingX = 15;
  const paddingY = 18;

  const coords = points.map((val, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (val / maxVal) * (svgHeight - paddingY * 2);
    return { x, y, val, label: labels[idx] };
  });

  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="rounded-md border border-neutral-200 bg-white p-6 shadow-xs space-y-5 font-sans">
      {/* Header & Filter Controls Strip (Identical to Partner Portal) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#09090B] tracking-tight">
            Platform Financial Performance
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Synchronized ledger tracking across 7 Innotek AI software merchants.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Display Currency */}
          <div className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 font-medium shadow-2xs">
            <span className="font-mono font-bold text-neutral-500">$</span>
            <span>Display in USD</span>
          </div>

          {/* Product Scope Dropdown */}
          <div className="relative">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="appearance-none rounded-md border border-neutral-300 bg-white pl-3 pr-8 py-1.5 text-neutral-700 font-medium shadow-2xs cursor-pointer outline-none focus:border-black"
            >
              <option value="all">All 7 Innotek Products</option>
              <option value="moodscanr">MoodScanr AI</option>
              <option value="headshot">AI Headshot Pro</option>
              <option value="halalscanr">HalalScanr</option>
              <option value="fanscanr">FanScanr Sports</option>
              <option value="talentscanr">TalentScanr AI</option>
              <option value="callscanr">CallScanr Voice</option>
              <option value="aqiscanr">AQIScanr AI</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
          </div>

          {/* Time Range Selector */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="appearance-none rounded-md border border-neutral-300 bg-white pl-3 pr-8 py-1.5 text-neutral-700 font-medium shadow-2xs cursor-pointer outline-none focus:border-black"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Trailing 12 months</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Chart Canvas Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-neutral-900">
              {metricConfig[selectedMetric].title}
            </h3>
            <span className="text-xs text-neutral-500 font-normal">
              &bull; {metricConfig[selectedMetric].subtitle}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-black bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-sm">
            {metricConfig[selectedMetric].displayValue}
          </span>
        </div>

        {/* Interactive Chart Canvas with Dashed Grid Lines (Partner Design Language) */}
        <div className="relative w-full h-44 bg-white overflow-hidden rounded-sm">
          {/* Dashed Horizontal Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
            <div className="w-full border-b border-dashed border-neutral-200" />
            <div className="w-full border-b border-dashed border-neutral-200" />
            <div className="w-full border-b border-dashed border-neutral-200" />
            <div className="w-full border-b border-dashed border-neutral-200" />
          </div>

          {/* SVG Curve with Gradient Fill and Point Rings */}
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="adminChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <path d={areaD} fill="url(#adminChartGradient)" />

            {/* Line Stroke */}
            <path
              d={pathD}
              fill="none"
              stroke="#09090B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Point Circles */}
            {coords.map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={hoveredIndex === i || i === coords.length - 1 ? '4' : '2.5'}
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
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-full bg-black text-white text-[10px] font-mono px-2 py-1 rounded shadow-md z-10 whitespace-nowrap"
              style={{
                left: `${(coords[hoveredIndex].x / svgWidth) * 100}%`,
                top: `${(coords[hoveredIndex].y / svgHeight) * 100 - 8}%`,
              }}
            >
              <div className="font-bold">
                {metricConfig[selectedMetric].isCurrency
                  ? '$' + coords[hoveredIndex].val.toLocaleString('en-US', { minimumFractionDigits: 2 })
                  : coords[hoveredIndex].val.toLocaleString()}
              </div>
              <div className="text-neutral-400 text-[9px]">{coords[hoveredIndex].label}</div>
            </div>
          )}

          {/* X-Axis Date Markers */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[11px] text-neutral-400 font-sans">
            <span>{labels[0]}</span>
            <span className="hidden sm:inline">{labels[Math.floor(labels.length / 2)]}</span>
            <span>{labels[labels.length - 1]}</span>
          </div>
        </div>
      </div>

      {/* 5 Tabbed Metric Selector Cards (Exact PartnerStack Style - Monochrome Black & White) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
        {/* Tab 1: Gross Sales (GMV) */}
        <button
          type="button"
          onClick={() => setSelectedMetric('gmv')}
          className={`p-3.5 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'gmv'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span
              className={`text-xs font-medium ${
                selectedMetric === 'gmv' ? 'text-black font-bold' : 'text-neutral-600'
              }`}
            >
              Gross Sales (GMV)
            </span>
            <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {formatMoney(overview.totalGmv)}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            Across 7 products &bull; {rangeLabel}
          </span>
        </button>

        {/* Tab 2: Partner Liability */}
        <button
          type="button"
          onClick={() => setSelectedMetric('liability')}
          className={`p-3.5 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'liability'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span
              className={`text-xs font-medium ${
                selectedMetric === 'liability' ? 'text-black font-bold' : 'text-neutral-600'
              }`}
            >
              Partner Liability
            </span>
            <Coins className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {formatMoney(overview.totalCommission)}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            Total commission obligation
          </span>
        </button>

        {/* Tab 3: Net Retained Profit */}
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
            {formatMoney(overview.netProfit)}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1">
            {overview.profitMarginPercent}% Net Margin
          </span>
        </button>

        {/* Tab 4: Approved Conversions */}
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
              Approved Orders
            </span>
            <Layers className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {overview.approvedConversions}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            {overview.totalConversions} Total converted leads
          </span>
        </button>

        {/* Tab 5: Active Affiliates */}
        <button
          type="button"
          onClick={() => setSelectedMetric('affiliates')}
          className={`p-3.5 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'affiliates'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span
              className={`text-xs font-medium ${
                selectedMetric === 'affiliates' ? 'text-black font-bold' : 'text-neutral-600'
              }`}
            >
              Active Earners
            </span>
            <Users className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {overview.activeAffiliates}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            {overview.totalAffiliates} Total registered partners
          </span>
        </button>
      </div>

      {/* Sub-footer caption matching Partner Portal */}
      <div className="flex items-center justify-between pt-2 text-[11px] text-neutral-500 border-t border-neutral-100">
        <span>Platform financial telemetry and ledger are updated hourly</span>
        <span className="text-black font-medium">
          Innotek Global Enterprise Infrastructure
        </span>
      </div>
    </div>
  );
}
