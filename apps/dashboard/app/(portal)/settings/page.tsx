import { requireAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api-client';
import { Settings, Landmark, User, ShieldCheck } from 'lucide-react';
import { revalidatePath } from 'next/cache';

interface AffiliateProfile {
  id: string;
  email: string;
  code: string;
  status: string;
  commissionRate: number;
  payoutMethod?: {
    type: 'bank' | 'momo' | 'paypal';
    details: Record<string, string>;
  } | null;
}

export default async function SettingsPage() {
  const token = await requireAuth();

  let profile: AffiliateProfile = {
    id: '',
    email: 'affiliate@innotek.global',
    code: 'INNOTEK',
    status: 'ACTIVE',
    commissionRate: 0.20,
    payoutMethod: null,
  };

  try {
    const fetched = await apiFetch<AffiliateProfile>('/affiliates/me/profile', token);
    if (fetched) profile = fetched;
  } catch (err) {
    console.error('Failed to load profile in settings:', err);
  }

  async function updatePayoutMethodAction(formData: FormData) {
    'use server';
    const currentToken = await requireAuth();
    const type = String(formData.get('type') || 'bank') as 'bank' | 'momo' | 'paypal';
    const bankName = String(formData.get('bankName') || '');
    const accountNumber = String(formData.get('accountNumber') || '');
    const accountName = String(formData.get('accountName') || '');
    const sortCode = String(formData.get('sortCode') || '');

    const details: Record<string, string> = {
      bankName,
      accountNumber,
      accountName,
      sortCode,
    };

    try {
      await apiFetch('/affiliates/me/payout-method', currentToken, {
        method: 'PATCH',
        body: JSON.stringify({ type, details }),
      });
      revalidatePath('/settings');
    } catch (err) {
      console.error('Failed to update payout method:', err);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl text-[#09090B] pb-16 font-sans">
      
      {/* Header */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Partner Account &amp; Settlement Preferences
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#09090B] mt-1 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
          Configure your beneficiary disbursement rails, banking information, and partner profile details.
        </p>
      </div>

      {/* Beneficiary Payout Form Card (PartnerStack Style) */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 text-black">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-[#09090B]">
              Payout Beneficiary Account
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Direct settlement via UK Faster Payments, SWIFT Wire, Momo, or PayPal.
            </p>
          </div>
        </div>

        <form action={updatePayoutMethodAction} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5">
                Disbursement Rail (Powered by Stripe)
              </label>
              <select
                name="type"
                defaultValue={profile.payoutMethod?.type || 'bank'}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#09090B] outline-none transition focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
              >
                <option value="bank">Direct Bank Transfer (BACS / Faster Payments / SEPA / SWIFT)</option>
                <option value="debit_card">Debit Card (Stripe Instant Payouts - Visa &amp; Mastercard)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5">
                Bank / Provider Name
              </label>
              <input
                type="text"
                name="bankName"
                defaultValue={profile.payoutMethod?.details?.bankName || ''}
                placeholder="e.g. Barclays Bank UK, HSBC UK, NatWest, Lloyds Bank"
                required
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#09090B] placeholder-neutral-400 outline-none transition focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5">
                Account Holder Name (Full Legal Name)
              </label>
              <input
                type="text"
                name="accountName"
                defaultValue={profile.payoutMethod?.details?.accountName || ''}
                placeholder="e.g. Oliver Vance / Apex Media UK Limited"
                required
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#09090B] placeholder-neutral-400 outline-none transition focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5">
                Account Number / IBAN
              </label>
              <input
                type="text"
                name="accountNumber"
                defaultValue={profile.payoutMethod?.details?.accountNumber || ''}
                placeholder="e.g. 8-digit UK Account Number or GB29NWBK60161331926819"
                required
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#09090B] placeholder-neutral-400 outline-none transition focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5">
                UK Sort Code / SWIFT BIC (Optional)
              </label>
              <input
                type="text"
                name="sortCode"
                defaultValue={profile.payoutMethod?.details?.sortCode || ''}
                placeholder="e.g. 20-00-00 or BARCGB22"
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#09090B] placeholder-neutral-400 outline-none transition focus:border-black focus:ring-1 focus:ring-black shadow-2xs uppercase"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="rounded-xl bg-black px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition"
            >
              Save Beneficiary Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Partner Identity Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="font-display text-base font-bold text-[#09090B] flex items-center gap-2">
          <User className="h-5 w-5 text-black" />
          <span>Partner Identity &amp; Standing</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs sm:text-sm">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <span className="text-neutral-500 uppercase text-[11px] font-semibold block tracking-wider">Account Email</span>
            <p className="text-[#09090B] font-semibold mt-1 truncate">{profile.email}</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <span className="text-neutral-500 uppercase text-[11px] font-semibold block tracking-wider">Unique Partner Code</span>
            <p className="text-black font-bold text-sm mt-1 font-mono">{profile.code}</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <span className="text-neutral-500 uppercase text-[11px] font-semibold block tracking-wider">Account Status</span>
            <p className="text-emerald-700 font-semibold mt-1 uppercase">{profile.status}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
