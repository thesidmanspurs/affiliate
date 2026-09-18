'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Building,
  CreditCard,
  Landmark,
  ExternalLink,
  DollarSign,
  TrendingUp,
  MousePointer,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Save,
  Percent,
  Sliders,
  RefreshCw,
  Sparkles,
  Check,
  User,
  MapPin,
  Calendar,
  Lock,
  Minus,
  Plus,
} from 'lucide-react';

interface AffiliateDetail {
  id: string;
  email: string;
  code: string;
  status: 'ONBOARDING_REQUIRED' | 'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  commissionRate: number;
  merchantName: string;
  productId: string;
  totalClicks: number;
  totalConversions: number;
  totalEarned: number;
  paidEarned: number;
  availableBalance: number;
  payoutMethod?: any;
  onboardingData?: {
    promotional?: any;
    tax?: any;
    payout?: any;
  };
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  reapplyAfter?: string;
  createdAt: string;
}

export default function AffiliateInfoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<AffiliateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Commission Rate State
  const [ratePercent, setRatePercent] = useState<number>(20);
  const [savingRate, setSavingRate] = useState(false);
  const [rateToast, setRateToast] = useState<string | null>(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchAffiliate = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4100/api/admin/affiliates/${id}`);
      if (!res.ok) {
        throw new Error('Failed to load affiliate partner details.');
      }
      const json: AffiliateDetail = await res.json();
      setData(json);
      setRatePercent(Math.round((json.commissionRate || 0.2) * 100));
    } catch (err: any) {
      console.error('Error loading affiliate info:', err);
      setError(err.message || 'Error loading partner data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliate();
  }, [id]);

  const handleSaveCommissionRate = async (newRateVal?: number) => {
    const targetPercent = newRateVal !== undefined ? newRateVal : ratePercent;
    if (isNaN(targetPercent) || targetPercent < 1 || targetPercent > 100) {
      alert('Please specify a valid commission rate between 1% and 100%.');
      return;
    }

    setSavingRate(true);
    try {
      const res = await fetch(`http://localhost:4100/api/admin/affiliates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commissionRate: targetPercent / 100,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to update commission rate.');
      }

      setRatePercent(targetPercent);
      if (data) {
        setData({ ...data, commissionRate: targetPercent / 100 });
      }
      setRateToast(`Commission rate successfully updated to ${targetPercent}%.`);
      setTimeout(() => setRateToast(null), 3500);
    } catch (err: any) {
      console.error('Update commission error:', err);
      alert(err.message || 'Failed to update commission rate.');
    } finally {
      setSavingRate(false);
    }
  };

  const handleDeletePartner = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:4100/api/admin/affiliates/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to remove partner.');
      }
      router.push('/admin/users');
    } catch (err: any) {
      console.error('Delete partner error:', err);
      alert(err.message || 'Failed to remove affiliate partner.');
      setDeleting(false);
    }
  };

  const formatMoney = (cents: number) => {
    return '$' + (cents / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3 font-sans">
        <RefreshCw className="h-7 w-7 animate-spin mx-auto text-neutral-500" />
        <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
          Loading partner profile &amp; ledger data...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-16 text-center space-y-4 font-sans">
        <div className="mx-auto h-12 w-12 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-base font-bold text-black">Partner Not Found</h2>
        <p className="text-xs text-neutral-500">{error || 'Could not retrieve affiliate account.'}</p>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Partner Directory</span>
        </Link>
      </div>
    );
  }

  const promo = data.onboardingData?.promotional || {};
  const tax = data.onboardingData?.tax || {};
  const payout = data.onboardingData?.payout || {};

  const conversionRate = data.totalClicks > 0
    ? ((data.totalConversions / data.totalClicks) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 text-[#09090B] pb-20 font-sans">
      
      {/* Toast Notification */}
      {rateToast && (
        <div className="fixed top-5 right-5 z-50 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-lg flex items-center gap-2.5 text-emerald-900 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{rateToast}</span>
        </div>
      )}

      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Partner Directory</span>
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="font-mono text-xs font-semibold text-neutral-600">
            {data.email}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Statutory Tax Dossier Button */}
          <Link
            href={`/admin/users/${data.id}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition shadow-2xs"
            title="View Official Statutory Tax Declaration (A4 Printable Document)"
          >
            <FileText className="h-3.5 w-3.5 text-neutral-600" />
            <span>View Statutory Tax Dossier</span>
          </Link>

          {/* Remove Partner Button */}
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-bold text-neutral-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition shadow-2xs cursor-pointer"
            title="Remove Partner Account"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="rounded-md border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {promo.companyLogoUrl ? (
              <div className="h-14 w-14 rounded-md border border-neutral-200 bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                <img
                  src={promo.companyLogoUrl}
                  alt={promo.companyName || data.email}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-14 w-14 rounded-md bg-neutral-900 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-xs">
                {data.email.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#09090B]">
                  {promo.companyName || tax.legalName || data.email}
                </h1>
                
                {/* Status Indicator */}
                <div className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-bold">
                  {data.status === 'ACTIVE' && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                      <span className="text-emerald-800">Active Partner</span>
                    </>
                  )}
                  {data.status === 'PENDING_REVIEW' && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-500 ring-2 ring-amber-200 animate-pulse" />
                      <span className="text-amber-800">Pending Review</span>
                    </>
                  )}
                  {data.status === 'REJECTED' && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                      <span className="text-rose-800">Ineligible / Rejected</span>
                    </>
                  )}
                  {data.status === 'ONBOARDING_REQUIRED' && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-neutral-400" />
                      <span className="text-neutral-600">Incomplete Onboarding</span>
                    </>
                  )}
                  {data.status === 'SUSPENDED' && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-red-600" />
                      <span className="text-red-800">Suspended</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-1 flex items-center gap-4 text-xs text-neutral-500 flex-wrap font-mono">
                <span>Account: <strong className="text-neutral-800">{data.email}</strong></span>
                <span>&bull;</span>
                <span>Referral Code: <strong className="text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded-sm">{data.code}</strong></span>
                <span>&bull;</span>
                <span>Joined: {new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Available Balance</span>
            <div className="font-mono text-2xl font-black text-emerald-700 mt-0.5">
              {formatMoney(data.availableBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* ── COMMISSION RATE MANAGER CARD (KEY USER REQUIREMENT) ── */}
      <div className="rounded-md border-2 border-black bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-black text-white">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-sm font-extrabold text-black uppercase tracking-tight">
                Commission Rate Allocation
              </h2>
              <p className="text-xs text-neutral-600">
                Override default tier rate for this specific partner. Commission applies automatically to all future conversions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-500 font-semibold">Active Rate:</span>
            <span className="font-mono text-lg font-black text-black bg-neutral-100 px-2.5 py-0.5 rounded-md border border-neutral-300">
              {(data.commissionRate * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Rate Controls & Quick Presets */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 flex items-center gap-2">
            <div className="relative flex-1">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="number"
                min={1}
                max={100}
                value={ratePercent}
                onChange={(e) => setRatePercent(parseInt(e.target.value) || 0)}
                className="w-full rounded-md border border-neutral-300 bg-white pl-9 pr-3 py-2 text-sm font-mono font-bold text-black outline-none focus:border-black shadow-2xs"
                placeholder="20"
              />
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setRatePercent((prev) => Math.max(1, prev - 1))}
                className="h-8 w-8 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-md transition flex items-center justify-center cursor-pointer"
                title="Decrease"
              >
                <Minus className="h-4 w-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => setRatePercent((prev) => Math.min(100, prev + 1))}
                className="h-8 w-8 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-md transition flex items-center justify-center cursor-pointer"
                title="Increase"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="md:col-span-4 flex items-center gap-1.5 flex-wrap">
            {[10, 15, 20, 25, 30, 40, 50].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setRatePercent(preset);
                  handleSaveCommissionRate(preset);
                }}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md border transition cursor-pointer ${
                  ratePercent === preset
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveCommissionRate()}
              disabled={savingRate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md bg-black px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-xs cursor-pointer"
            >
              {savingRate ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>Save Rate</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 KEY METRICS TILES ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Referral Clicks</span>
            <MousePointer className="h-4 w-4" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-black mt-1">
            {data.totalClicks.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">Unique promotional visits</span>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Conversions</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-black mt-1">
            {data.totalConversions.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold mt-0.5 block">
            {conversionRate}% conversion rate
          </span>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Earned</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-black mt-1">
            {formatMoney(data.totalEarned)}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">Lifetime gross liability</span>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Disbursed</span>
            <Check className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-neutral-800 mt-1">
            {formatMoney(data.paidEarned)}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">Paid via Stripe Payouts</span>
        </div>
      </div>

      {/* ── 2-COLUMN SECTION: MARKETING & TAX/PAYOUT ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Marketing & Promotional Channels */}
        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-neutral-100 pb-2.5 flex items-center justify-between">
            <h3 className="font-display text-sm font-extrabold text-black uppercase tracking-tight flex items-center gap-2">
              <Building className="h-4 w-4 text-neutral-600" />
              <span>Promotional Channels &amp; Reach</span>
            </h3>
            <span className="text-[10px] font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded-sm">
              CAP CODE #AD COMPLIANT
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-neutral-500 font-bold block uppercase text-[10px]">Primary Promotional URL:</span>
              <div className="mt-1">
                {promo.channelUrl || promo.primaryUrl ? (
                  <a
                    href={promo.channelUrl || promo.primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-blue-700 hover:underline inline-flex items-center gap-1 break-all"
                  >
                    <span>{promo.channelUrl || promo.primaryUrl}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : (
                  <span className="font-mono text-neutral-400">Direct referral link distribution</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-neutral-500 font-bold block uppercase text-[10px]">Media Formats / Types:</span>
              <div className="text-black font-semibold mt-0.5">
                {promo.channels?.join(', ') || promo.channelTypes?.join(', ') || 'General Digital Promotion'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-neutral-500 font-bold block uppercase text-[10px]">Monthly Reach:</span>
                <span className="text-black font-bold mt-0.5 block">{promo.monthlyReach || 'Unspecified'}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold block uppercase text-[10px]">Target Regions:</span>
                <span className="text-black font-semibold mt-0.5 block">
                  {promo.audienceRegions?.join(', ') || promo.targetRegions?.join(', ') || 'UK & Global'}
                </span>
              </div>
            </div>

            {promo.strategyNotes && (
              <div className="pt-2 border-t border-neutral-100">
                <span className="text-neutral-500 font-bold block uppercase text-[10px] mb-1">Method Statement:</span>
                <p className="p-2.5 rounded-md bg-neutral-50 border border-neutral-200 text-neutral-800 text-[11px] leading-relaxed">
                  {promo.strategyNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Remittance & Stripe Payout Configuration */}
        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-neutral-100 pb-2.5 flex items-center justify-between">
            <h3 className="font-display text-sm font-extrabold text-black uppercase tracking-tight flex items-center gap-2">
              <Landmark className="h-4 w-4 text-neutral-600" />
              <span>Stripe Remittance &amp; Payout Rails</span>
            </h3>
            <span className="text-[10px] font-mono font-bold bg-[#635BFF]/10 text-[#635BFF] px-2 py-0.5 rounded-sm border border-[#635BFF]/30">
              STRIPE CONNECT READY
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-neutral-500 font-bold block uppercase text-[10px]">Settlement Disbursal Rail:</span>
              <div className="font-bold text-black mt-0.5">
                {payout.method === 'debit_card' ? (
                  <span className="inline-flex items-center gap-1.5 text-blue-900">
                    <CreditCard className="h-3.5 w-3.5" />
                    Stripe Instant Payouts (Visa/Mastercard Debit)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-neutral-900">
                    <Landmark className="h-3.5 w-3.5" />
                    Stripe Direct Bank Transfer (BACS / Faster Payments / SEPA)
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-neutral-500 font-bold block uppercase text-[10px]">Beneficiary Account Name:</span>
              <div className="font-mono font-bold text-black mt-0.5">
                {payout.beneficiaryName || payout.accountName || tax.legalName || 'N/A'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-neutral-500 font-bold block uppercase text-[10px]">Settlement Currency:</span>
                <span className="font-mono font-bold text-black mt-0.5 block">{payout.currency || 'GBP'}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold block uppercase text-[10px]">Clearing Rail:</span>
                <span className="font-mono text-neutral-700 mt-0.5 block">
                  {payout.method === 'debit_card' ? 'Instant (~30m)' : 'Standard (T+2 Days)'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <span className="text-neutral-500 font-bold block uppercase text-[10px]">Routing / Destination Identifier:</span>
              <div className="font-mono font-bold text-black break-all mt-1 p-2.5 rounded-md bg-neutral-50 border border-neutral-200">
                {payout.method === 'debit_card' ? (
                  <span>
                    {payout.cardBrand || 'Debit Card'} ending in •••• {payout.cardNumberLast4 || '****'} (Exp: {payout.cardExpiry || 'N/A'})
                  </span>
                ) : (
                  <span>
                    {payout.bankName && <span>{payout.bankName} &bull; </span>}
                    {payout.accountNumberOrIban || payout.accountNumber || payout.iban || 'Configured on File'}
                    {payout.sortCode && <span> (Sort: {payout.sortCode})</span>}
                    {payout.swiftBic && <span> (SWIFT: {payout.swiftBic})</span>}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── STATUTORY TAX DECLARATION OVERVIEW ── */}
      <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
        <div className="border-b border-neutral-100 pb-2.5 flex items-center justify-between">
          <h3 className="font-display text-sm font-extrabold text-black uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-neutral-600" />
            <span>Statutory Tax &amp; Identity Profile</span>
          </h3>
          <Link
            href={`/admin/users/${data.id}`}
            className="text-xs text-blue-700 hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>Full Legal Dossier</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-neutral-500 font-bold block uppercase text-[10px]">Full Legal Tax Name:</span>
            <div className="font-bold text-black mt-0.5">{tax.legalName || 'Pending Declaration'}</div>
          </div>

          <div>
            <span className="text-neutral-500 font-bold block uppercase text-[10px]">Tax Residency Jurisdiction:</span>
            <div className="font-bold text-black mt-0.5">
              {tax.taxResidenceCountry || tax.taxCountry || 'United Kingdom'} ({tax.taxClassification || 'UK_DOMESTIC'})
            </div>
          </div>

          <div>
            <span className="text-neutral-500 font-bold block uppercase text-[10px]">Tax ID (UTR / NINO / TIN):</span>
            <div className="font-mono font-bold text-black mt-0.5">{tax.taxId || tax.utrOrNino || 'N/A'}</div>
          </div>

          <div>
            <span className="text-neutral-500 font-bold block uppercase text-[10px]">VAT Status:</span>
            <div className="font-semibold text-black mt-0.5">
              {tax.vatRegistered ? `Registered (${tax.vatNumber})` : 'Below Threshold / Non-VAT'}
            </div>
          </div>

          <div className="sm:col-span-2">
            <span className="text-neutral-500 font-bold block uppercase text-[10px]">Permanent Registered Address:</span>
            <div className="text-black font-medium mt-0.5">
              {typeof tax.address === 'object'
                ? [tax.address?.street, tax.address?.city, tax.address?.state, tax.address?.postalCode, tax.address?.country].filter(Boolean).join(', ')
                : tax.address || 'Address pending'}
            </div>
          </div>
        </div>
      </div>

      {/* ── DELETE MODAL ── */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg border border-neutral-300 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-rose-100 text-rose-800 shrink-0">
                <Trash2 className="h-5 w-5 text-rose-700" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[#09090B]">
                  Permanently Remove Affiliate
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Account: <strong className="text-black">{data.email}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed">
              Are you sure you want to permanently remove this affiliate account? All tracking links, referral clicks, and active sessions will be revoked.
            </p>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePartner}
                disabled={deleting}
                className="rounded-md bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {deleting && <RefreshCw className="h-3 w-3 animate-spin" />}
                <span>Confirm &amp; Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
