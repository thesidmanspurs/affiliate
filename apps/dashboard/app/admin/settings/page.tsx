'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react';

interface PayoutItem {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  createdAt: string;
  affiliate?: {
    email: string;
    code: string;
    payoutMethod?: any;
  };
}

export default function AdminSettingsPage() {
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchMsg, setBatchMsg] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchPayouts = () => {
    fetch('http://localhost:4100/api/admin/payouts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPayouts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load payouts:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleBatchApprove = async () => {
    setBatchLoading(true);
    setBatchMsg(null);
    try {
      const res = await fetch('http://localhost:4100/api/admin/conversions/batch-approve', {
        method: 'POST',
      });
      const data = await res.json();
      setBatchMsg(data.message || 'Batch conversion approval completed.');
    } catch (err) {
      setBatchMsg('Failed to run batch approval.');
    } finally {
      setBatchLoading(false);
    }
  };

  const handleApprovePayout = async (id: string) => {
    setApprovingId(id);
    try {
      await fetch(`http://localhost:4100/api/admin/payouts/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ externalRef: `TX-HMRC-${Date.now()}` }),
      });
      fetchPayouts();
    } catch (err) {
      console.error('Failed to approve payout:', err);
    } finally {
      setApprovingId(null);
    }
  };

  const formatMoney = (cents: number, cur = 'USD') => {
    if (cur.toUpperCase() === 'USD') {
      return '$' + (cents / 100).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: cur,
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="space-y-8 text-[#09090B] font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1.5">
            <Settings className="h-4 w-4" />
            <span>Settlement Rules &amp; Approvals</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
            Settlements &amp; Platform Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600">
            Batch-process buffer conversions and settle pending partner withdrawal requests.
          </p>
        </div>

        {/* Batch Approve Conversion Trigger */}
        <div>
          <button
            onClick={handleBatchApprove}
            disabled={batchLoading}
            className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-neutral-800 disabled:opacity-60 transition cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{batchLoading ? 'Processing Batch…' : 'Run 14-Day Buffer Auto-Approval'}</span>
          </button>
        </div>
      </div>

      {batchMsg && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 p-4 text-xs sm:text-sm text-emerald-900 font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{batchMsg}</span>
        </div>
      )}

      {/* Payout Approval Queue */}
      <div className="rounded-md border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-[#09090B]">
            Partner Withdrawal Queue
          </h2>
          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
            {payouts.length} payout records
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-neutral-500 font-mono">Loading payout queue…</div>
        ) : payouts.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500 font-medium">No payout requests in the queue.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-semibold">
                  <th className="py-3.5 px-6">Date Requested</th>
                  <th className="py-3.5 px-4">Partner Email</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method &amp; Beneficiary</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Settlement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition">
                    <td className="py-4 px-6 font-mono text-neutral-500 text-xs">{formatDate(p.createdAt)}</td>
                    <td className="py-4 px-4 font-bold text-[#09090B]">
                      {p.affiliate?.email || 'Unknown Partner'}
                      <code className="block text-[11px] text-neutral-500 font-mono font-normal">{p.affiliate?.code}</code>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-[#09090B] font-mono">{formatMoney(p.amount, p.currency)}</td>
                    <td className="py-4 px-4">
                      <span className="capitalize font-semibold text-neutral-800">{p.method.replace('_', ' ')}</span>
                      {p.affiliate?.payoutMethod?.details && (
                        <div className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                          {p.affiliate.payoutMethod.details.bankName} • {p.affiliate.payoutMethod.details.accountNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                          p.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {p.status === 'REQUESTED' ? (
                        <button
                          onClick={() => handleApprovePayout(p.id)}
                          disabled={approvingId === p.id}
                          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs cursor-pointer"
                        >
                          <Send className="h-3 w-3" />
                          <span>{approvingId === p.id ? 'Settling…' : 'Approve & Mark Paid'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-mono font-bold">Settled ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Global Platform Policies Info */}
      <div className="rounded-md border border-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-neutral-100 flex items-center justify-center text-black">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h3 className="font-display text-base font-bold text-[#09090B]">
            Configured Global Governance Policies
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
          <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
            <span className="text-[11px] text-neutral-500 uppercase font-semibold">Refund Clearance Buffer</span>
            <p className="font-bold text-[#09090B] text-base mt-1 font-display">14 Calendar Days</p>
            <p className="text-[11px] text-neutral-500 mt-1">Protects against credit card chargebacks</p>
          </div>

          <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
            <span className="text-[11px] text-neutral-500 uppercase font-semibold">First-Party Cookie Window</span>
            <p className="font-bold text-[#09090B] text-base mt-1 font-display">90 Days</p>
            <p className="text-[11px] text-neutral-500 mt-1">Client-side domain cookie duration</p>
          </div>

          <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
            <span className="text-[11px] text-neutral-500 uppercase font-semibold">Minimum Withdrawal Threshold</span>
            <p className="font-bold text-[#09090B] text-base mt-1 font-display">£20.00 / $25.00</p>
            <p className="text-[11px] text-neutral-500 mt-1">Automatic threshold enforcement</p>
          </div>
        </div>
      </div>
    </div>
  );
}
