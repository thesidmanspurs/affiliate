'use client';

export interface Conversion {
  id: string;
  orderId: string;
  type: string;
  amount: number;
  currency?: string;
  status: string;
  createdAt: string;
}

interface ConversionsTableProps {
  conversions: Conversion[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending Clearance',
  APPROVED: 'Approved',
  REJECTED: 'Declined',
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-rose-100 text-rose-800',
};

export function ConversionsTable({ conversions }: ConversionsTableProps) {
  if (conversions.length === 0) {
    return (
      <p className="mt-6 text-sm text-neutral-500">
        No conversions tracked yet. Share your referral links to begin earning commissions.
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          <tr>
            <th className="pb-3">Order Ref</th>
            <th className="pb-3">Type</th>
            <th className="pb-3">Gross Sale</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {conversions.map((row) => (
            <tr key={row.id}>
              <td className="py-3.5 font-mono text-xs font-medium text-neutral-900">{row.orderId}</td>
              <td className="py-3.5 text-neutral-600 font-medium">
                {row.type === 'RENEWAL' ? 'Recurring Renewal' : 'New Subscription'}
              </td>
              <td className="py-3.5 font-semibold text-neutral-900">
                {(row.amount / 100).toLocaleString('en-US', { style: 'currency', currency: row.currency || 'USD' })}
              </td>
              <td className="py-3.5">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    STATUS_CLASSES[row.status] || 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {STATUS_LABELS[row.status] || row.status}
                </span>
              </td>
              <td className="py-3.5 text-xs text-neutral-500">
                {new Date(row.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
