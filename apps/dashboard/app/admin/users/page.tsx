'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  CheckCircle2,
  UserCheck,
  UserX,
  Mail,
  FileText,
  ShieldCheck,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  DollarSign,
  Building2,
  Landmark,
  Globe,
  Sparkles,
  Check,
  X,
  RefreshCw,
  Trash2,
  Info,
} from 'lucide-react';

interface AffiliateItem {
  id: string;
  email: string;
  code: string;
  status: 'ONBOARDING_REQUIRED' | 'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  commissionRate: number;
  merchantName: string;
  totalClicks: number;
  totalConversions: number;
  totalEarned: number;
  paidEarned: number;
  availableBalance: number;
  payoutMethod?: any;
  onboardingData?: {
    promotional?: {
      channels?: string[];
      channelUrl?: string;
      monthlyReach?: string;
      audienceRegions?: string[];
      strategyNotes?: string;
      ftcCompliant?: boolean;
      antiSpamAgreed?: boolean;
    };
    tax?: {
      formType?: 'W9' | 'W8BEN' | 'W8BENE';
      legalName?: string;
      businessName?: string;
      taxId?: string;
      taxCountry?: string;
      address?: string;
      city?: string;
      postalCode?: string;
      country?: string;
      treatyClaim?: boolean;
      certifiedUnderPerjury?: boolean;
      signedName?: string;
      signedDate?: string;
    };
    payout?: {
      method?: string;
      accountName?: string;
      bankName?: string;
      accountNumber?: string;
      routingOrSwift?: string;
      iban?: string;
      paypalEmail?: string;
      wiseEmail?: string;
      cryptoAddress?: string;
      currency?: string;
      country?: string;
    };
  };
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  reapplyAfter?: string;
  createdAt: string;
}

const PRESET_REJECTION_REASONS = [
  'Insufficient promotional channel reach (minimum audience requirement not met).',
  'Primary promotional website or channel URL could not be verified or is inaccessible.',
  'Tax declaration information incomplete or legal name mismatch on IRS tax form.',
  'Promotional methodology does not adhere to Innotek FTC disclosure or brand guidelines.',
  'Payout banking details or beneficiary verification incomplete.',
];

export default function AdminUsersPage() {
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDossier, setSelectedDossier] = useState<AffiliateItem | null>(null);
  const [declineTarget, setDeclineTarget] = useState<AffiliateItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AffiliateItem | null>(null);
  const [declineReason, setDeclineReason] = useState(PRESET_REJECTION_REASONS[0]);
  const [customDeclineReason, setCustomDeclineReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAffiliates = () => {
    setLoading(true);
    fetch('http://localhost:4100/api/admin/affiliates')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAffiliates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load affiliates:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const handleReviewAction = async (
    affiliateId: string,
    action: 'APPROVE' | 'REJECT',
    reason?: string
  ) => {
    setActionLoading(affiliateId);
    try {
      const res = await fetch(`http://localhost:4100/api/admin/affiliates/${affiliateId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          rejectionReason: reason || undefined,
          cooldownDays: 7,
        }),
      });
      if (res.ok) {
        setSuccessToast(
          action === 'APPROVE'
            ? 'Partner application approved! Congratulatory notification dispatched.'
            : 'Partner application declined. 7-day cooldown initiated.'
        );
        setTimeout(() => setSuccessToast(null), 4000);
        setSelectedDossier(null);
        setDeclineTarget(null);
        fetchAffiliates();
      }
    } catch (err) {
      console.error('Review action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAffiliate = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`http://localhost:4100/api/admin/affiliates/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to remove affiliate account.');
      }
      setSuccessToast(`Affiliate account ${deleteTarget.email} permanently removed.`);
      setTimeout(() => setSuccessToast(null), 4000);
      setDeleteTarget(null);
      fetchAffiliates();
    } catch (err: any) {
      console.error('Delete affiliate error:', err);
      alert(err.message || 'Failed to remove affiliate.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatMoney = (cents: number) => {
    return '$' + (cents / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const filtered = affiliates.filter((a) => {
    const matchQuery =
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const pendingCount = affiliates.filter((a) => a.status === 'PENDING_REVIEW').length;
  const activeCount = affiliates.filter((a) => a.status === 'ACTIVE').length;
  const rejectedCount = affiliates.filter((a) => a.status === 'REJECTED').length;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedList = filtered.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 text-[#09090B] pb-16">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 rounded-md border border-emerald-300 bg-emerald-50 p-4 shadow-lg flex items-center gap-3 text-emerald-900 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-700 uppercase tracking-wider mb-1">
            <Users className="h-4 w-4" />
            <span>AFFILIATE PARTNER COMPLIANCE MODERATION</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B]">
            Partner &amp; Compliance Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600">
            Audit promotional channels, verify IRS tax certificates (W-8/W-9), and moderate partner campaign access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAffiliates}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards (Crisp Modern Style with Subtle Corner Radius) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Registered</span>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] mt-1">{affiliates.length}</p>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Pending Review</span>
            {pendingCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] mt-1">{pendingCount}</p>
          <span className="text-[11px] text-amber-700 font-medium">Requires moderation action</span>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Active Earners</span>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">{activeCount}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Tracking links live</span>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ineligible / Rejected</span>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-600 mt-1">{rejectedCount}</p>
          <span className="text-[11px] text-neutral-500">Subject to 7-day cooldown</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by partner email or code..."
            className="w-full rounded-md border border-neutral-300 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-[#09090B] placeholder-neutral-400 outline-none focus:border-black shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-[#09090B] outline-none shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Statuses ({affiliates.length})</option>
            <option value="PENDING_REVIEW">Pending Review ({pendingCount})</option>
            <option value="ACTIVE">Active ({activeCount})</option>
            <option value="REJECTED">Ineligible / Rejected ({rejectedCount})</option>
            <option value="ONBOARDING_REQUIRED">Onboarding Incomplete</option>
          </select>
        </div>
      </div>

      {/* Partners Table */}
      <div className="rounded-md border border-neutral-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/70 flex items-center justify-between">
          <span className="font-display text-sm font-bold text-[#09090B]">
            Affiliate Partner Dossiers ({filtered.length})
          </span>
          <span className="font-mono text-xs text-neutral-500">
            Real-time Database Sync
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading partner compliance records…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            No partner records found matching your filter criteria.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Partner Identity</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Rate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Available Balance</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginatedList.map((a) => (
                  <tr key={a.id} className="hover:bg-neutral-50/70 transition">
                    <td className="py-3.5 px-4 font-medium text-[#09090B]">
                      <div className="flex items-center gap-2.5">
                        {(a.onboardingData?.promotional as any)?.companyLogoUrl ? (
                          <div className="h-7 w-7 rounded-full bg-white border border-neutral-300 overflow-hidden flex items-center justify-center shrink-0">
                            <img
                              src={(a.onboardingData?.promotional as any)?.companyLogoUrl}
                              alt="Logo"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold shrink-0 text-xs">
                            {a.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate">
                            {(a.onboardingData?.promotional as any)?.companyName || a.email}
                          </p>
                          <p className="font-mono text-[10px] text-neutral-500 truncate">
                            {(a.onboardingData?.promotional as any)?.companyName ? a.email : (a.onboardingData?.tax?.legalName || 'Legal name pending')}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-800">
                      {a.code}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-neutral-700">
                      {(a.commissionRate * 100).toFixed(0)}%
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center">
                        {a.status === 'ACTIVE' && (
                          <span
                            title="Active Partner"
                            className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 cursor-default inline-block"
                          />
                        )}
                        {a.status === 'PENDING_REVIEW' && (
                          <span
                            title="Review Required"
                            className="relative flex h-2.5 w-2.5 cursor-default"
                          >
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 ring-4 ring-amber-100" />
                          </span>
                        )}
                        {a.status === 'REJECTED' && (
                          <span
                            title="Ineligible / Rejected"
                            className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-4 ring-rose-100 cursor-default inline-block"
                          />
                        )}
                        {a.status === 'ONBOARDING_REQUIRED' && (
                          <span
                            title="Onboarding Incomplete"
                            className="h-2.5 w-2.5 rounded-full bg-neutral-400 ring-4 ring-neutral-100 cursor-default inline-block"
                          />
                        )}
                        {a.status === 'SUSPENDED' && (
                          <span
                            title="Suspended"
                            className="h-2.5 w-2.5 rounded-full bg-red-600 ring-4 ring-red-100 cursor-default inline-block"
                          />
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {formatMoney(a.availableBalance)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500">
                      {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : new Date(a.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Legal Dossier button */}
                        <Link
                          href={`/admin/users/${a.id}`}
                          className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-[11px] font-bold text-neutral-800 hover:bg-neutral-100 hover:text-black transition shadow-2xs cursor-pointer"
                          title="Open Official Statutory Legal & Tax Dossier"
                        >
                          <FileText className="h-3 w-3 text-neutral-600" />
                          <span>Legal Dossier</span>
                        </Link>

                        {/* Full User Information button */}
                        <Link
                          href={`/admin/users/${a.id}/info`}
                          className="inline-flex items-center justify-center h-6 w-6 rounded-md border border-neutral-300 bg-white text-neutral-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition shadow-2xs cursor-pointer"
                          title="View Full Partner Information & Adjust Commission"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </Link>

                        {/* Non-Active: show Approve button */}
                        {a.status !== 'ACTIVE' && (
                          <button
                            onClick={() => handleReviewAction(a.id, 'APPROVE')}
                            disabled={actionLoading === a.id}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition shadow-2xs cursor-pointer"
                          >
                            <UserCheck className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {/* Active users: Decline becomes Remove with ONLY Trash Icon */}
                        {a.status === 'ACTIVE' ? (
                          <button
                            onClick={() => setDeleteTarget(a)}
                            className="inline-flex items-center justify-center h-6 w-6 rounded-md border border-neutral-300 bg-white text-neutral-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition shadow-2xs cursor-pointer"
                            title="Remove Affiliate Account"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          /* Non-Active users: standard Decline button */
                          a.status !== 'REJECTED' && a.status !== 'SUSPENDED' && (
                            <button
                              onClick={() => setDeclineTarget(a)}
                              disabled={actionLoading === a.id}
                              className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-800 hover:bg-rose-100 transition shadow-2xs cursor-pointer"
                            >
                              <UserX className="h-3 w-3 text-rose-700" />
                              <span>Decline</span>
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="border-t border-neutral-200 bg-neutral-50/70 px-4 py-3.5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600 font-medium">
            <div className="flex items-center gap-3">
              <span>
                Showing <strong className="text-black">{totalItems > 0 ? startIndex + 1 : 0}</strong> to{' '}
                <strong className="text-black">{endIndex}</strong> of{' '}
                <strong className="text-black">{totalItems}</strong> partners
              </span>

              <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-neutral-200">
                <span className="text-neutral-500 text-[11px]">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-xs text-black font-semibold shadow-2xs outline-none focus:border-black cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Navigation Page Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={safeCurrentPage <= 1}
                className="rounded-lg border border-neutral-300 bg-white p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={safeCurrentPage <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    return (
                      p === 1 ||
                      p === totalPages ||
                      (p >= safeCurrentPage - 1 && p <= safeCurrentPage + 1)
                    );
                  })
                  .map((page, idx, arr) => {
                    const prevPage = arr[idx - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <div key={page} className="flex items-center gap-1">
                        {showEllipsis && <span className="px-1 text-neutral-400">…</span>}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer ${
                            safeCurrentPage === page
                              ? 'bg-black text-white'
                              : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={safeCurrentPage >= totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                title="Next Page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={safeCurrentPage >= totalPages}
                className="rounded-lg border border-neutral-300 bg-white p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>

      {/* 1. Full Compliance Dossier Inspection Modal */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-md border border-neutral-300 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center font-display font-extrabold text-lg text-black shrink-0">
                  {selectedDossier.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg font-extrabold text-[#09090B]">
                      {selectedDossier.email}
                    </h3>
                    <span className="font-mono text-[11px] font-bold bg-neutral-100 px-2 py-0.2 rounded border border-neutral-200">
                      Code: {selectedDossier.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-neutral-500">
                      Registered: {new Date(selectedDossier.createdAt).toLocaleDateString()} &bull; Current Status: <strong>{selectedDossier.status}</strong>
                    </p>
                    <Link
                      href={`/admin/users/${selectedDossier.id}`}
                      className="text-xs text-blue-700 hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      <span>Open Official Legal Dossier</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDossier(null)}
                className="rounded-md border border-neutral-200 p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 text-xs sm:text-sm">
              
              {/* Section 1: Promotional Channels */}
              <div className="rounded-md border border-neutral-200 bg-neutral-50/60 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 font-display font-bold text-[#09090B]">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span>1. Promotional Methods &amp; Channel Verification</span>
                </div>

                {((selectedDossier.onboardingData?.promotional as any)?.companyLogoUrl || (selectedDossier.onboardingData?.promotional as any)?.companyName) && (
                  <div className="flex items-center gap-3 p-2.5 bg-white rounded-md border border-neutral-200">
                    {(selectedDossier.onboardingData?.promotional as any)?.companyLogoUrl ? (
                      <div className="h-10 w-10 rounded border border-neutral-200 bg-white p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={(selectedDossier.onboardingData?.promotional as any)?.companyLogoUrl}
                          alt="Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : null}
                    <div>
                      <span className="text-[10px] text-neutral-500 font-mono block uppercase">Brand / Creator Trading Identity:</span>
                      <strong className="text-black text-xs font-sans">
                        {(selectedDossier.onboardingData?.promotional as any)?.companyName || 'Individual Creator'}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 font-mono block">Primary Channels:</span>
                    <strong className="text-black">
                      {selectedDossier.onboardingData?.promotional?.channels?.join(', ') || ((selectedDossier.onboardingData?.promotional as any)?.channelTypes)?.join(', ') || 'Not specified'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-mono block">Monthly Reach:</span>
                    <strong className="text-black">
                      {selectedDossier.onboardingData?.promotional?.monthlyReach || 'Not specified'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-mono block">Target Audience Regions:</span>
                    <strong className="text-black">
                      {selectedDossier.onboardingData?.promotional?.audienceRegions?.join(', ') || ((selectedDossier.onboardingData?.promotional as any)?.targetRegions)?.join(', ') || 'Global'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-mono block">Primary URL:</span>
                    {selectedDossier.onboardingData?.promotional?.channelUrl || (selectedDossier.onboardingData?.promotional as any)?.primaryUrl ? (
                      <a
                        href={selectedDossier.onboardingData?.promotional?.channelUrl || (selectedDossier.onboardingData?.promotional as any)?.primaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 font-mono font-bold"
                      >
                        <span>{selectedDossier.onboardingData?.promotional?.channelUrl || (selectedDossier.onboardingData?.promotional as any)?.primaryUrl}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-neutral-400">None provided</span>
                    )}
                  </div>
                </div>

                {(selectedDossier.onboardingData?.promotional?.strategyNotes || (selectedDossier.onboardingData?.promotional as any)?.promotionalStrategy) && (
                  <div className="pt-2 border-t border-neutral-200 text-xs">
                    <span className="text-neutral-500 font-mono block mb-1">Promotional Strategy Plan:</span>
                    <p className="text-neutral-700 bg-white p-2.5 rounded border border-neutral-200 leading-relaxed font-mono">
                      {selectedDossier.onboardingData?.promotional?.strategyNotes || (selectedDossier.onboardingData?.promotional as any)?.promotionalStrategy}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs font-mono text-emerald-800 pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>FTC 16 CFR § 255.5 Covenants Confirmed</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Anti-Spam &amp; Brand Safety Agreed</span>
                  </span>
                </div>
              </div>

              {/* Section 2: Tax Declaration */}
              <div className="rounded-md border border-neutral-200 bg-neutral-50/60 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display font-bold text-[#09090B]">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    <span>2. International Tax &amp; Entity Declaration</span>
                  </div>
                  <span className="rounded bg-white border border-neutral-200 px-2 py-0.5 font-mono text-xs font-bold text-neutral-800">
                    Form: {selectedDossier.onboardingData?.tax?.formType || (selectedDossier.onboardingData?.tax as any)?.taxForm || 'W-8BEN'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 font-mono block">Legal Tax Name:</span>
                    <strong className="text-black">
                      {selectedDossier.onboardingData?.tax?.legalName || 'N/A'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-mono block">Tax Identification (TIN / SSN / EIN):</span>
                    <strong className="text-black font-mono">
                      {selectedDossier.onboardingData?.tax?.taxId || 'N/A'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-mono block">Country of Tax Residence:</span>
                    <strong className="text-black">
                      {selectedDossier.onboardingData?.tax?.taxCountry || (selectedDossier.onboardingData?.tax as any)?.taxResidenceCountry || 'N/A'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-mono block">Permanent Address:</span>
                    <strong className="text-black">
                      {typeof selectedDossier.onboardingData?.tax?.address === 'object'
                        ? `${(selectedDossier.onboardingData?.tax?.address as any)?.street || ''}, ${(selectedDossier.onboardingData?.tax?.address as any)?.city || ''} (${(selectedDossier.onboardingData?.tax?.address as any)?.country || ''})`
                        : `${selectedDossier.onboardingData?.tax?.address || 'N/A'}${selectedDossier.onboardingData?.tax?.city ? ', ' + selectedDossier.onboardingData?.tax?.city : ''}${selectedDossier.onboardingData?.tax?.country ? ' (' + selectedDossier.onboardingData?.tax?.country + ')' : ''}`}
                    </strong>
                  </div>
                  {(selectedDossier.onboardingData?.tax as any)?.dateOfBirth && (
                    <div>
                      <span className="text-neutral-500 font-mono block">Date of Birth (W-8BEN Line 8):</span>
                      <strong className="text-black font-mono">{(selectedDossier.onboardingData?.tax as any).dateOfBirth}</strong>
                    </div>
                  )}
                  {(selectedDossier.onboardingData?.tax as any)?.signerCapacity && (
                    <div>
                      <span className="text-neutral-500 font-mono block">Signer Legal Capacity:</span>
                      <strong className="text-black font-mono">{(selectedDossier.onboardingData?.tax as any).signerCapacity}</strong>
                    </div>
                  )}
                </div>

                {/* Audit Trail & Cryptographic Non-Repudiation Box */}
                <div className="p-3.5 bg-white rounded-md border border-neutral-200 font-mono text-xs text-neutral-600 space-y-2">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                    <span className="font-bold text-neutral-900">Legal Audit Trail (ESIGN Act / IRS Rev. Proc. 98-9):</span>
                    <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      {(selectedDossier.onboardingData?.tax as any)?.auditTrail?.documentReferenceId || 'AUDIT-PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Electronic Signature:</span>
                    <strong className="text-black">{selectedDossier.onboardingData?.tax?.signedName || (selectedDossier.onboardingData?.tax as any)?.electronicSignature || 'Pending'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Signer IP Address:</span>
                    <span className="text-black font-bold">{(selectedDossier.onboardingData?.tax as any)?.auditTrail?.signerIp || 'Local Verified'}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                    <span>Timestamp:</span>
                    <span>{selectedDossier.onboardingData?.tax?.signedDate || (selectedDossier.onboardingData?.tax as any)?.signedAt ? new Date(selectedDossier.onboardingData?.tax?.signedDate || (selectedDossier.onboardingData?.tax as any)?.signedAt).toLocaleString() : 'Pending'}</span>
                  </div>
                  {(selectedDossier.onboardingData?.tax as any)?.auditTrail?.integrityHash && (
                    <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-100 break-all">
                      <span className="block text-neutral-500 font-semibold">SHA-256 Tamper-Proof Fingerprint:</span>
                      <span className="text-neutral-700 select-all">{(selectedDossier.onboardingData?.tax as any).auditTrail.integrityHash}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Payout Rails */}
              <div className="rounded-md border border-neutral-200 bg-neutral-50/60 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display font-bold text-[#09090B]">
                    <Landmark className="h-4 w-4 text-purple-600" />
                    <span>3. Payout Beneficiary Rails</span>
                  </div>
                  <span className="rounded bg-white border border-neutral-200 px-2 py-0.5 font-mono text-xs font-bold text-purple-800 uppercase">
                    Rail: {selectedDossier.onboardingData?.payout?.method || 'bank_wire'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 font-mono block">Account Holder:</span>
                    <strong className="text-black">{selectedDossier.onboardingData?.payout?.accountName || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-mono block">Settlement Currency:</span>
                    <strong className="text-black">{selectedDossier.onboardingData?.payout?.currency || 'USD'}</strong>
                  </div>
                  <div className="col-span-2 font-mono">
                    <span className="text-neutral-500 block">Banking / Destination Details:</span>
                    <strong className="text-black break-all">
                      {selectedDossier.onboardingData?.payout?.iban ||
                       selectedDossier.onboardingData?.payout?.accountNumber ||
                       selectedDossier.onboardingData?.payout?.paypalEmail ||
                       selectedDossier.onboardingData?.payout?.wiseEmail ||
                       selectedDossier.onboardingData?.payout?.cryptoAddress ||
                       'N/A'}
                    </strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedDossier(null)}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
              >
                Close Inspection
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = selectedDossier;
                    setSelectedDossier(null);
                    setDeclineTarget(target);
                  }}
                  className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100 transition cursor-pointer"
                >
                  Decline Application
                </button>

                <button
                  onClick={() => handleReviewAction(selectedDossier.id, 'APPROVE')}
                  disabled={actionLoading === selectedDossier.id}
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs cursor-pointer"
                >
                  Approve Partner Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Decline Dialog Modal with 7-Day Cooldown */}
      {declineTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg border border-neutral-300 bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-rose-100 text-rose-800 shrink-0">
                <UserX className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[#09090B]">
                  Decline Partner Application
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Partner: <strong className="text-black">{declineTarget.email}</strong> (Code: {declineTarget.code})
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Declining will preserve the partner&apos;s account in an ineligible state and initiate a <strong>7-day cooldown</strong> before they may update and resubmit their compliance dossier.
            </p>

            <div className="space-y-3 text-xs">
              <label className="font-mono font-bold text-neutral-700 block">
                Select Compliance Feedback Reason:
              </label>

              <div className="space-y-2">
                {PRESET_REJECTION_REASONS.map((r) => (
                  <label
                    key={r}
                    onClick={() => { setDeclineReason(r); setCustomDeclineReason(''); }}
                    className={`flex items-start gap-2.5 p-2.5 rounded-md border cursor-pointer text-xs transition ${
                      declineReason === r && !customDeclineReason
                        ? 'border-rose-400 bg-rose-50/50 text-rose-950 font-medium'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="presetReason"
                      checked={declineReason === r && !customDeclineReason}
                      onChange={() => { setDeclineReason(r); setCustomDeclineReason(''); }}
                      className="mt-0.5"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="font-mono font-bold text-neutral-700 block mb-1">
                  Or Specify Custom Feedback:
                </label>
                <textarea
                  value={customDeclineReason}
                  onChange={(e) => setCustomDeclineReason(e.target.value)}
                  placeholder="Enter specific guidance for this partner..."
                  rows={2}
                  className="w-full rounded-md border border-neutral-300 p-2.5 text-xs text-[#09090B] outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeclineTarget(null)}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleReviewAction(
                    declineTarget.id,
                    'REJECT',
                    customDeclineReason.trim() || declineReason
                  )
                }
                disabled={actionLoading === declineTarget.id}
                className="rounded-md bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs cursor-pointer"
              >
                Confirm &amp; Decline Partner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete / Remove Affiliate Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg border border-neutral-300 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-rose-100 text-rose-800 shrink-0">
                <Trash2 className="h-5 w-5 text-rose-700" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[#09090B]">
                  Remove Affiliate Partner
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Account: <strong className="text-black">{deleteTarget.email}</strong>
                </p>
              </div>
            </div>

            <div className="rounded-md border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-900 space-y-1">
              <p className="font-bold">Permanent Account Purge Warning:</p>
              <p className="text-[11px] leading-relaxed text-rose-800">
                This action will permanently delete the affiliate profile, revoke referral code <strong className="font-mono">{deleteTarget.code}</strong>, and purge all active sessions.
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAffiliate}
                disabled={deleteLoading}
                className="rounded-md bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {deleteLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
                <span>Confirm &amp; Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
