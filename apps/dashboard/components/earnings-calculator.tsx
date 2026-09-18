'use client';

import { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProductData {
  id: string;
  name: string;
  category: string;
  pricePerUnit: number;
  rate: number;
  isRecurring: boolean;
  rateLabel: string;
  icon: string;
}

const PRODUCTS: ProductData[] = [
  { id: 'moodscanr', name: 'MoodScanr AI', category: 'Video Sentiment AI', pricePerUnit: 29, rate: 0.20, isRecurring: true, rateLabel: '20% Rec.', icon: '/logos/moodscanr.png' },
  { id: 'headshot', name: 'AI Headshot Pro', category: 'Generative 4K Studio', pricePerUnit: 35, rate: 0.30, isRecurring: false, rateLabel: '30% Per Sale', icon: '/logos/headshot.png' },
  { id: 'halalscanr', name: 'HalalScanr', category: 'Dietary & Food OCR', pricePerUnit: 10, rate: 0.25, isRecurring: true, rateLabel: '25% Rec.', icon: '/logos/halalscanr.png' },
  { id: 'fanscanr', name: 'FanScanr Sports', category: 'Sports & Media AI', pricePerUnit: 19, rate: 0.20, isRecurring: true, rateLabel: '20% Rec.', icon: '/logos/fanscanr.png' },
  { id: 'talentscanr', name: 'TalentScanr AI', category: 'HR Tech & ATS', pricePerUnit: 99, rate: 0.20, isRecurring: true, rateLabel: '20% Rec.', icon: '/logos/talentscanr.png' },
  { id: 'callscanr', name: 'CallScanr', category: 'Voice AI Telephony', pricePerUnit: 149, rate: 0.15, isRecurring: true, rateLabel: '15% Rec.', icon: '/logos/callscanr.png' },
  { id: 'aqiscanr', name: 'AQIScanr AI', category: 'Climate & CleanTech', pricePerUnit: 8, rate: 0.20, isRecurring: true, rateLabel: '20% Rec.', icon: '/logos/aqiscanr.svg' },
];

export function EarningsCalculator() {
  const [selectedProductId, setSelectedProductId] = useState('moodscanr');
  const [referralCount, setReferralCount] = useState(50);

  const product = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  const monthlyEarnings = Math.round(referralCount * product.pricePerUnit * product.rate);
  const annualEarnings = monthlyEarnings * 12;

  return (
    <section className="py-20 sm:py-28 bg-transparent border-b border-neutral-200 relative overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-semibold text-[#09090B] mb-3 shadow-2xs">
            <Calculator className="h-4 w-4 text-black" />
            <span>Interactive Revenue Simulator</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#09090B] tracking-tight">
            Calculate Your Recurring Payouts
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600">
            Select an AI product and slide to simulate your monthly and annual recurring income.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Calculator Controls & Sliders (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm space-y-6 flex flex-col justify-between">
            
            {/* 1. Product Selector */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-2.5">
                1. Choose Software Application:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRODUCTS.map((p) => {
                  const isSelected = p.id === selectedProductId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProductId(p.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition ${
                        isSelected
                          ? 'border-black bg-neutral-900 text-white shadow-xs font-semibold'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="h-7 w-7 flex items-center justify-center shrink-0">
                        <img src={p.icon} alt={p.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{p.name}</p>
                        <p className="text-[11px] opacity-80">{p.rateLabel}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Referral Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-neutral-800">
                  2. Active Paying Customers:
                </label>
                <span className="font-display font-bold text-2xl text-[#09090B]">
                  {referralCount} <span className="text-xs font-medium text-neutral-500">subscribers</span>
                </span>
              </div>

              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={referralCount}
                onChange={(e) => setReferralCount(Number(e.target.value))}
                className="w-full h-3 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
              />

              <div className="flex justify-between text-xs text-neutral-400 font-medium">
                <span>5 referrals</span>
                <span>100 referrals</span>
                <span>250 referrals</span>
                <span>500+ referrals</span>
              </div>
            </div>

            {/* 3. Specs Summary */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-xs sm:text-sm flex items-center justify-between font-medium">
              <span className="text-neutral-600">Commission Model: <strong className="text-black font-semibold">{product.rateLabel}</strong></span>
              <span className="text-neutral-600">Avg Plan Price: <strong className="text-black font-semibold">£{product.pricePerUnit} / unit</strong></span>
            </div>

          </div>

          {/* Right: Output Card (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-neutral-900 bg-black text-white p-6 sm:p-10 flex flex-col justify-between text-center shadow-xl relative overflow-hidden">
            
            <div className="space-y-4 my-auto">
              <span className="inline-block text-xs font-semibold tracking-wider text-neutral-300 uppercase bg-neutral-800 border border-neutral-700 px-3.5 py-1 rounded-full">
                Projected Recurring Yield
              </span>

              <div className="py-4">
                <span className="text-xs text-neutral-400 block uppercase font-medium">Estimated Monthly Payout</span>
                <p className="font-display text-5xl sm:text-6xl font-extrabold text-white mt-1">
                  £{monthlyEarnings.toLocaleString()}
                  <span className="text-base font-normal text-neutral-400"> /mo</span>
                </p>
                <p className="text-sm text-emerald-400 mt-2 font-semibold">
                  Equivalent to £{annualEarnings.toLocaleString()} / year
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 space-y-2 text-left font-medium">
                <div className="flex justify-between">
                  <span>Selected App:</span>
                  <strong className="text-white font-semibold">{product.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Commission Rate:</span>
                  <strong className="text-emerald-400 font-semibold">{product.rateLabel}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Holding Buffer:</span>
                  <strong className="text-white font-semibold">14 Days Auto Clearance</strong>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800 space-y-2">
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm sm:text-base font-bold text-black hover:bg-neutral-100 transition shadow-md"
              >
                <span>Claim Your Partner Access</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-xs text-neutral-400 font-medium">
                Automated NET-15 disbursement straight to bank
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
