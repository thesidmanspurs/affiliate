'use client';

import { useState, useEffect, useMemo } from 'react';
import { Landmark, CreditCard, Lock, AlertCircle, Check, RefreshCw } from 'lucide-react';

export interface PayoutRailData {
  method: 'bank_account' | 'debit_card';
  beneficiaryName: string;
  bankName?: string;
  accountNumberOrIban?: string;
  sortCode?: string;
  swiftBic?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardBrand?: string;
  currency: string;
}

interface PayoutRailsFormProps {
  initialData?: Partial<PayoutRailData>;
  legalNameFallback?: string;
  taxResidenceCountry?: string;
  taxClassification?: string;
  onSave?: (data: PayoutRailData) => Promise<void> | void;
  isPending?: boolean;
  submitButtonLabel?: string;
  mode?: 'standalone' | 'embedded';
  onChange?: (data: PayoutRailData) => void;
}

export function PayoutRailsForm({
  initialData,
  legalNameFallback = '',
  taxResidenceCountry = 'United Kingdom',
  taxClassification = 'INTERNATIONAL',
  onSave,
  isPending = false,
  submitButtonLabel = 'Save Beneficiary Preferences',
  mode = 'standalone',
  onChange,
}: PayoutRailsFormProps) {
  const [payoutMethod, setPayoutMethod] = useState<'bank_account' | 'debit_card'>(
    initialData?.method || 'bank_account'
  );

  // Beneficiary Name falls back to legal name certified on tax form if empty
  const [beneficiaryName, setBeneficiaryName] = useState(
    initialData?.beneficiaryName || legalNameFallback || ''
  );

  const [bankName, setBankName] = useState(initialData?.bankName || '');
  const [accountNumberOrIban, setAccountNumberOrIban] = useState(initialData?.accountNumberOrIban || '');
  const [sortCode, setSortCode] = useState(initialData?.sortCode || '');
  const [swiftBic, setSwiftBic] = useState(initialData?.swiftBic || '');
  const [cardNumber, setCardNumber] = useState(initialData?.cardNumber || '');
  const [cardExpiry, setCardExpiry] = useState(initialData?.cardExpiry || '');
  const [currency, setCurrency] = useState(
    initialData?.currency || (taxClassification === 'UK_DOMESTIC' ? 'GBP' : 'USD')
  );
  const [error, setError] = useState<string | null>(null);

  // Format card number with spaces (#### #### #### ####)
  const handleCardNumberChange = (value: string) => {
    const rawDigits = value.replace(/\D/g, '').slice(0, 16);
    const formatted = rawDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format card expiry date (MM/YY)
  const handleCardExpiryChange = (value: string) => {
    const rawDigits = value.replace(/\D/g, '').slice(0, 4);
    if (rawDigits.length >= 3) {
      setCardExpiry(`${rawDigits.slice(0, 2)}/${rawDigits.slice(2)}`);
    } else {
      setCardExpiry(rawDigits);
    }
  };

  // Dynamically resolve card brand for Stripe Instant Payouts
  const cardBrand = useMemo<'Visa' | 'Mastercard' | 'Debit Card'>(() => {
    const clean = cardNumber.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard';
    return 'Debit Card';
  }, [cardNumber]);

  // Sync state upward if embedded
  useEffect(() => {
    if (onChange) {
      onChange({
        method: payoutMethod,
        beneficiaryName,
        bankName,
        accountNumberOrIban,
        sortCode,
        swiftBic,
        cardNumber,
        cardExpiry,
        cardBrand,
        currency,
      });
    }
  }, [
    payoutMethod,
    beneficiaryName,
    bankName,
    accountNumberOrIban,
    sortCode,
    swiftBic,
    cardNumber,
    cardExpiry,
    cardBrand,
    currency,
    onChange,
  ]);

  const validate = (): boolean => {
    if (!beneficiaryName.trim()) {
      setError('Please provide the beneficiary account holder name (must match your legal tax name).');
      return false;
    }
    if (payoutMethod === 'bank_account') {
      if (!bankName.trim() || !accountNumberOrIban.trim()) {
        setError('Please provide your bank name and Account Number or IBAN.');
        return false;
      }
      if (taxClassification === 'UK_DOMESTIC' && !sortCode.trim()) {
        setError('Please provide your 6-digit UK Bank Sort Code (e.g. 20-00-00).');
        return false;
      }
    } else if (payoutMethod === 'debit_card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15 || cleanNum.length > 16) {
        setError('Please enter a valid 16-digit debit card number for Stripe Instant Payouts.');
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardExpiry.trim())) {
        setError('Please enter a valid card expiration date in MM/YY format (e.g. 12/28).');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (onSave) {
      onSave({
        method: payoutMethod,
        beneficiaryName,
        bankName: payoutMethod === 'bank_account' ? bankName : undefined,
        accountNumberOrIban: payoutMethod === 'bank_account' ? accountNumberOrIban : undefined,
        sortCode: payoutMethod === 'bank_account' ? sortCode : undefined,
        swiftBic: payoutMethod === 'bank_account' ? swiftBic : undefined,
        cardNumber: payoutMethod === 'debit_card' ? cardNumber : undefined,
        cardExpiry: payoutMethod === 'debit_card' ? cardExpiry : undefined,
        cardBrand: payoutMethod === 'debit_card' ? cardBrand : undefined,
        currency,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Crown Banner */}
      <div className="h-2 bg-black w-full" />

      {/* Header */}
      <div className="border-b border-black pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-[11px] font-mono tracking-widest text-neutral-600 uppercase font-bold">
            PART III &bull; DISBURSAL RAILS &amp; STRIPE CONNECT COMPLIANCE
          </div>
          <span className="inline-flex items-center gap-1 bg-[#635BFF]/10 text-[#635BFF] text-[10px] font-mono font-bold px-2 py-0.5 border border-[#635BFF]/30">
            <Lock className="h-2.5 w-2.5" />
            POWERED BY STRIPE PAYOUTS
          </span>
        </div>
        <h1 className="font-sans font-black text-xl sm:text-2xl text-black uppercase tracking-tight mt-1">
          Commission Disbursal &amp; Payout Rails
        </h1>
        <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
          Select your preferred settlement rail supported natively by Stripe. Automated commission disbursements occur on a rolling statutory schedule directly to your verified bank or debit card.
        </p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="border-l-4 border-rose-600 bg-rose-50 border border-rose-300 p-4 text-xs font-semibold text-rose-900 flex items-start gap-3 shadow-2xs font-sans">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <strong className="block text-xs uppercase tracking-wider font-extrabold">Remittance Requirement Incomplete:</strong>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Payment Rail Selectors - 2 Stripe-Native Options */}
      <div>
        <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
          Select Stripe Settlement Rail <span className="text-rose-600">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Rail 1: Direct Bank Transfer */}
          <button
            type="button"
            onClick={() => setPayoutMethod('bank_account')}
            className={`p-4 border-2 text-left transition cursor-pointer flex flex-col justify-between min-h-[110px] ${
              payoutMethod === 'bank_account'
                ? 'border-black bg-neutral-100 text-black shadow-xs'
                : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 border ${payoutMethod === 'bank_account' ? 'border-black bg-black text-white' : 'border-neutral-300 bg-neutral-50 text-neutral-600'}`}>
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-black text-sm text-black block">Direct Bank Transfer</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 mt-0.5 inline-block">
                    0% FEE &bull; STANDARD (1-2 DAYS)
                  </span>
                </div>
              </div>
              <div
                className={`h-4 w-4 border flex items-center justify-center shrink-0 mt-1 ${
                  payoutMethod === 'bank_account' ? 'bg-black border-black text-white' : 'border-neutral-400 bg-white'
                }`}
              >
                {payoutMethod === 'bank_account' && <Check className="h-3 w-3" />}
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-neutral-200">
              <span className="text-[11px] text-neutral-600 block leading-snug">
                Direct clearing via <strong>UK Faster Payments / BACS</strong>, European <strong>SEPA</strong>, or International <strong>SWIFT</strong>.
              </span>
            </div>
          </button>

          {/* Rail 2: Stripe Instant Payouts via Debit Card */}
          <button
            type="button"
            onClick={() => setPayoutMethod('debit_card')}
            className={`p-4 border-2 text-left transition cursor-pointer flex flex-col justify-between min-h-[110px] ${
              payoutMethod === 'debit_card'
                ? 'border-black bg-neutral-100 text-black shadow-xs'
                : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 border ${payoutMethod === 'debit_card' ? 'border-black bg-black text-white' : 'border-neutral-300 bg-neutral-50 text-neutral-600'}`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-black text-sm text-black block">Debit Card (Instant Payout)</span>
                  <span className="text-[10px] font-mono font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 mt-0.5 inline-block">
                    INSTANT &bull; ~30 MIN DISBURSAL
                  </span>
                </div>
              </div>
              <div
                className={`h-4 w-4 border flex items-center justify-center shrink-0 mt-1 ${
                  payoutMethod === 'debit_card' ? 'bg-black border-black text-white' : 'border-neutral-400 bg-white'
                }`}
              >
                {payoutMethod === 'debit_card' && <Check className="h-3 w-3" />}
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-neutral-200">
              <span className="text-[11px] text-neutral-600 block leading-snug">
                Stripe Instant Payouts to eligible <strong>Visa &amp; Mastercard debit cards</strong>. Available 24/7/365.
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* Beneficiary Name (AML Mandatory) */}
      <div>
        <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
          Line 18. Beneficiary Account Holder Name <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          value={beneficiaryName}
          onChange={(e) => setBeneficiaryName(e.target.value)}
          placeholder="Must match legal tax declaration name (e.g. Oliver Vance or Apex Media UK Limited)"
          className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black font-bold placeholder-neutral-400 outline-hidden focus:border-black"
        />
        <span className="text-[11px] text-neutral-500 mt-1 block">
          Under UK Anti-Money Laundering (AML) regulations and Stripe Payout rules, the recipient name must exactly match your registered legal identity.
        </span>
      </div>

      {/* Details: Direct Bank Account */}
      {payoutMethod === 'bank_account' && (
        <div className="border border-black bg-white p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
              <Landmark className="h-3.5 w-3.5" />
              Direct Bank Transfer Account Details
            </span>
            <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 border border-neutral-300">
              STRIPE BACS / FASTER PAYMENTS / SEPA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                Bank / Institution Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Barclays Bank UK, HSBC UK, Vietcombank, Revolut"
                className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black placeholder-neutral-400 outline-hidden focus:border-black font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                Account Number or IBAN <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={accountNumberOrIban}
                onChange={(e) => setAccountNumberOrIban(e.target.value)}
                placeholder="e.g. 8-digit UK Account Number, IBAN, or National Bank Account No."
                className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-mono text-black font-bold placeholder-neutral-400 outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                UK Sort Code (for UK Bank Accounts)
              </label>
              <input
                type="text"
                value={sortCode}
                onChange={(e) => setSortCode(e.target.value)}
                placeholder="e.g. 20-00-00 or 40-47-84"
                className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-mono text-black placeholder-neutral-400 outline-hidden focus:border-black font-bold"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                6-digit branch code for UK Faster Payments settlement.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                SWIFT / BIC Code (for International Wire)
              </label>
              <input
                type="text"
                value={swiftBic}
                onChange={(e) => setSwiftBic(e.target.value)}
                placeholder="e.g. BARCGB22 (Barclays UK) or BFTVVNVX (Vietcombank)"
                className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-mono text-black uppercase font-bold placeholder-neutral-400 outline-hidden focus:border-black"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Required for cross-border Stripe wire transfers.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Details: Stripe Instant Payout Debit Card */}
      {payoutMethod === 'debit_card' && (
        <div className="border border-black bg-white p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              Eligible Debit Card Details (Stripe Instant Payouts)
            </span>
            <span className="text-[10px] font-mono font-bold bg-[#635BFF]/10 text-[#635BFF] px-2 py-0.5 border border-[#635BFF]/30">
              VISA / MASTERCARD DEBIT ONLY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                16-Digit Debit Card Number <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="4000 1234 5678 9010"
                  maxLength={19}
                  className="w-full border border-neutral-400 bg-white px-3 py-2.5 text-sm font-mono text-black font-bold placeholder-neutral-400 outline-hidden focus:border-black tracking-wider"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 border ${
                    cardBrand === 'Visa'
                      ? 'bg-blue-900 text-white border-blue-900'
                      : cardBrand === 'Mastercard'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                  }`}>
                    {cardBrand}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Credit cards and prepaid cards are not eligible for Stripe Instant Payouts. Must be an authentic Visa or Mastercard debit card.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                Card Expiration Date <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => handleCardExpiryChange(e.target.value)}
                placeholder="MM/YY (e.g. 10/28)"
                maxLength={5}
                className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-mono text-black font-bold placeholder-neutral-400 outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                Card Issuing Country / Origin
              </label>
              <input
                type="text"
                disabled
                value={taxResidenceCountry || 'United Kingdom'}
                className="w-full border border-neutral-300 bg-neutral-100 px-3 py-2 text-xs font-sans text-neutral-700 font-semibold cursor-not-allowed"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Synced with your official tax residence jurisdiction.
              </span>
            </div>
          </div>

          <div className="border border-neutral-200 bg-neutral-50 p-3 flex items-start gap-2.5">
            <Lock className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
            <p className="text-[11px] text-neutral-700 leading-relaxed font-sans">
              <strong>Stripe End-to-End Encryption:</strong> Card numbers are transmitted via TLS 1.3 encryption directly to Stripe's Level 1 PCI-DSS compliant vault. Innotek Global Ltd does not store raw Primary Account Numbers (PANs).
            </p>
          </div>
        </div>
      )}

      {/* Settlement Currency Preference */}
      <div>
        <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
          Settlement Currency Preference (Stripe Multi-Currency Disbursal)
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black font-semibold outline-hidden focus:border-black cursor-pointer"
        >
          <option value="GBP">GBP (£) &ndash; British Pound Sterling (Default UK Statutory Settlement)</option>
          <option value="USD">USD ($) &ndash; United States Dollar (Global Platform Currency)</option>
          <option value="EUR">EUR (€) &ndash; Euro (Single Euro Payments Area - SEPA)</option>
        </select>
        <span className="text-[11px] text-neutral-500 mt-1 block">
          Stripe will automatically convert and disburse earnings in your chosen currency at live mid-market interbank exchange rates.
        </span>
      </div>

      {/* Settlement Protocol Notice Card */}
      <div className="border border-neutral-300 bg-neutral-50 p-4 text-xs text-neutral-700 space-y-1.5">
        <div className="flex items-center justify-between font-bold text-black text-xs">
          <span>Settlement Cadence: Monthly NET-15</span>
          <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 border border-emerald-300">
            Auto-clearing Active
          </span>
        </div>
        <p className="leading-relaxed">
          Commissions clear following an automated 14-day anti-chargeback window and disburse automatically on the 15th of each month once your balance exceeds <strong>$50.00 USD</strong>.
        </p>
      </div>

      {/* Standalone Submit Action */}
      {mode === 'standalone' && (
        <div className="pt-2 border-t border-neutral-200">
          <button
            type="submit"
            disabled={isPending}
            className="border-2 border-black bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition cursor-pointer flex items-center gap-2 shadow-xs"
          >
            {isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>{submitButtonLabel}</span>
          </button>
        </div>
      )}
    </form>
  );
}
