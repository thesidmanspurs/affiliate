'use client';

import { useState } from 'react';
import {
  MousePointerClick,
  Users,
  Store,
  Wallet,
  Receipt,
} from 'lucide-react';

interface PerformanceChartProps {
  stats: {
    totalClicks?: number;
    totalConversions: number;
    pendingCommission: number;
    approvedCommission: number;
    paidCommission: number;
    sourcedRevenue?: number;
  };
  isActive: boolean;
}

type MetricType = 'clicks' | 'signups' | 'revenue' | 'pending' | 'paid';

export function PerformanceChart({ stats, isActive }: PerformanceChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('paid');

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const totalClicks = stats.totalClicks ?? 0;
  const totalConversions = stats.totalConversions ?? 0;
  const sourcedRevenue = stats.sourcedRevenue ?? 0;
  const pendingBuffer = stats.pendingCommission ?? 0;
  const paidEarnings = stats.paidCommission ?? stats.approvedCommission ?? 0;

  const metricTitles: Record<MetricType, string> = {
    clicks: 'Total Clicks',
    signups: 'Signups & Orders',
    revenue: 'Sourced Gross Revenue',
    pending: 'Pending Holding Rewards',
    paid: 'Paid commissions',
  };

  // Generate chart points based on real selected metric value
  const getPoints = () => {
    let currentVal = 0;
    if (selectedMetric === 'clicks') currentVal = totalClicks;
    else if (selectedMetric === 'signups') currentVal = totalConversions;
    else if (selectedMetric === 'revenue') currentVal = sourcedRevenue / 100;
    else if (selectedMetric === 'pending') currentVal = pendingBuffer / 100;
    else if (selectedMetric === 'paid') currentVal = paidEarnings / 100;

    if (currentVal === 0) {
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    const p1 = Math.round(currentVal * 0.15);
    const p2 = Math.round(currentVal * 0.3);
    const p3 = Math.round(currentVal * 0.5);
    const p4 = Math.round(currentVal * 0.75);
    const p5 = Math.round(currentVal * 0.9);
    return [0, 0, 0, 0, 0, 0, p1, p2, p3, p4, p5, currentVal];
  };

  const points = getPoints();
  const maxVal = Math.max(...points, 1);

  const svgWidth = 800;
  const svgHeight = 160;
  const paddingX = 15;
  const paddingY = 15;

  const getCoordinates = () => {
    return points.map((val, idx) => {
      const x = paddingX + (idx / (points.length - 1)) * (svgWidth - paddingX * 2);
      const y = svgHeight - paddingY - (val / maxVal) * (svgHeight - paddingY * 2);
      return { x, y, val };
    });
  };

  const coords = getCoordinates();
  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="space-y-4">
      {/* Metric Title */}
      <h3 className="text-sm font-semibold text-neutral-800">
        {metricTitles[selectedMetric]}
      </h3>

      {/* Interactive Chart Canvas with Dashed Grid Lines (Screenshot 2 / 3) */}
      <div className="relative w-full h-44 bg-white overflow-hidden">
        {/* Dashed Horizontal Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
          <div className="w-full border-b border-dashed border-neutral-200" />
          <div className="w-full border-b border-dashed border-neutral-200" />
          <div className="w-full border-b border-dashed border-neutral-200" />
          <div className="w-full border-b border-dashed border-neutral-200" />
        </div>

        {/* SVG Curve */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Fill Area */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#09090B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={i === coords.length - 1 ? '4' : '2.5'}
              className="fill-black stroke-white stroke-2"
            />
          ))}
        </svg>

        {/* X-Axis Dates */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[11px] text-neutral-400 font-sans">
          <span>Jun 7, 2026</span>
          <span>Aug 30, 2026</span>
        </div>
      </div>

      {/* 5 Tabbed Metric Selector Cards (Exact PartnerStack Style - Monochrome Black & White) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
        
        {/* Tab 1: Clicks */}
        <button
          type="button"
          onClick={() => setSelectedMetric('clicks')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'clicks'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className={`text-xs font-medium ${selectedMetric === 'clicks' ? 'text-black font-bold' : 'text-neutral-600'}`}>Clicks</span>
            <MousePointerClick className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {totalClicks}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            0% Previous 90 days
          </span>
        </button>

        {/* Tab 2: Signups */}
        <button
          type="button"
          onClick={() => setSelectedMetric('signups')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'signups'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className={`text-xs font-medium ${selectedMetric === 'signups' ? 'text-black font-bold' : 'text-neutral-600'}`}>Signups</span>
            <Users className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {totalConversions}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            0% Previous 90 days
          </span>
        </button>

        {/* Tab 3: Revenue */}
        <button
          type="button"
          onClick={() => setSelectedMetric('revenue')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'revenue'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className={`text-xs font-medium ${selectedMetric === 'revenue' ? 'text-black font-bold' : 'text-neutral-600'}`}>Revenue</span>
            <Store className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {formatMoney(sourcedRevenue)}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            0% Previous 90 days
          </span>
        </button>

        {/* Tab 4: Pending Buffer Rewards */}
        <button
          type="button"
          onClick={() => setSelectedMetric('pending')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'pending'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className={`text-xs font-medium ${selectedMetric === 'pending' ? 'text-black font-bold' : 'text-neutral-600'}`}>Pending rewards</span>
            <Receipt className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {formatMoney(pendingBuffer)}
          </p>
          <span className="text-[10px] text-neutral-400 font-normal mt-1">
            0% Previous 90 days
          </span>
        </button>

        {/* Tab 5: Paid Rewards */}
        <button
          type="button"
          onClick={() => setSelectedMetric('paid')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'paid'
              ? 'border-2 border-black bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-700 mb-1">
            <span className={`text-xs font-medium ${selectedMetric === 'paid' ? 'text-black font-bold' : 'text-neutral-600'}`}>Paid rewards</span>
            <Wallet className="h-3.5 w-3.5 text-neutral-600" />
          </div>
          <p className="font-display text-xl font-bold text-[#09090B]">
            {formatMoney(paidEarnings)}
          </p>
          <span className="text-[10px] text-neutral-500 font-medium mt-1">
            0% Previous 90 days
          </span>
        </button>

      </div>

      {/* Sub-footer caption */}
      <div className="flex items-center justify-between pt-2 text-[11px] text-neutral-500 border-t border-neutral-100">
        <span>Statistics are updated hourly</span>
        <a href="#learn-more" className="text-black font-medium hover:underline">
          Learn more about statistics
        </a>
      </div>
    </div>
  );
}
