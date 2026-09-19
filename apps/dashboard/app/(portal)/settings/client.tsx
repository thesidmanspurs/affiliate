'use client';

import { useState, useTransition, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Landmark,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Lock,
  RefreshCw,
} from 'lucide-react';
import {
  updateTaxDeclarationAction,
  updatePayoutRailAction,
  updatePartnerProfileAction,
} from './actions';
import {
  TaxComplianceForm,
  TaxDeclarationData,
} from '@/components/compliance/tax-compliance-form';
import {
  PayoutRailsForm,
  PayoutRailData,
} from '@/components/compliance/payout-rails-form';

export interface AffiliateProfile {
  id: string;
  email: string;
  code: string;
  status: string;
  commissionRate: number;
  payoutMethod?: {
    type: 'bank' | 'bank_account' | 'debit_card' | 'momo' | 'paypal';
    details: Record<string, string>;
  } | null;
  onboardingData?: {
    tax?: {
      formType?: string;
      taxClassification?: string;
      legalName?: string;
      businessType?: string;
      taxId?: string;
      utrOrNino?: string;
      taxResidenceCountry?: string;
      vatRegistered?: boolean;
      vatNumber?: string;
      companiesHouseCrn?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        postalCode?: string;
        country?: string;
      };
      dateOfBirth?: string;
      signerCapacity?: string;
      electronicSignature?: string;
      signedAt?: string;
      certificationAccepted?: boolean;
    };
    promotional?: {
      companyName?: string;
      companyLogoUrl?: string;
      channels?: string[];
      channelTypes?: string[];
      primaryUrl?: string;
      monthlyReach?: string;
      targetRegions?: string[];
      niche?: string;
      promotionalStrategy?: string;
    };
    payout?: {
      method?: string;
      beneficiaryName?: string;
      accountName?: string;
      bankName?: string;
      accountNumberOrIban?: string;
      accountNumber?: string;
      swiftBic?: string;
      sortCode?: string;
      cardNumber?: string;
      cardNumberLast4?: string;
      cardBrand?: string;
      cardExpiry?: string;
      currency?: string;
    };
  } | null;
}

export function SettingsClient({ profile }: { profile: AffiliateProfile }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');

  // Tabs: 'tax' | 'payout' | 'profile' | 'standing'
  const [activeTab, setActiveTab] = useState<'tax' | 'payout' | 'profile' | 'standing'>(
    tabParam === 'tax' ? 'tax' : tabParam === 'profile' ? 'profile' : tabParam === 'standing' ? 'standing' : 'payout'
  );

  useEffect(() => {
    if (tabParam === 'tax') setActiveTab('tax');
    else if (tabParam === 'payout') setActiveTab('payout');
    else if (tabParam === 'profile') setActiveTab('profile');
    else if (tabParam === 'standing') setActiveTab('standing');
  }, [tabParam]);

  const [isPending, startTransition] = useTransition();
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extract existing data
  const existingTax = profile.onboardingData?.tax;
  const existingPromo = profile.onboardingData?.promotional;
  const existingPayout = profile.onboardingData?.payout;
  const pm = profile.payoutMethod as any;
  const pmDetails: Record<string, string> = pm?.details || {};

  const hasTaxInfo = Boolean(
    existingTax?.taxId ||
    existingTax?.certificationAccepted ||
    existingTax?.taxResidenceCountry
  );

  // Edit mode for Tax tab if already certified
  const [isEditingTax, setIsEditingTax] = useState(!hasTaxInfo);

  // Pre-fill Tax Data
  const initialTaxData: Partial<TaxDeclarationData> = {
    formType: existingTax?.formType || 'W-8BEN',
    taxClassification: (existingTax?.taxClassification as any) || 'INTERNATIONAL',
    legalName: existingTax?.legalName || existingPayout?.beneficiaryName || pmDetails.beneficiaryName || '',
    businessType: existingTax?.businessType || 'Individual / Sole Trader',
    taxId: existingTax?.taxId || existingTax?.utrOrNino || '',
    taxResidenceCountry: existingTax?.taxResidenceCountry || 'Vietnam',
    vatRegistered: Boolean(existingTax?.vatRegistered),
    vatNumber: existingTax?.vatNumber || '',
    companiesHouseCrn: existingTax?.companiesHouseCrn || '',
    street: existingTax?.address?.street || '',
    city: existingTax?.address?.city || '',
    stateProv: existingTax?.address?.state || '',
    postalCode: existingTax?.address?.postalCode || existingTax?.address?.zip || '',
    dateOfBirth: existingTax?.dateOfBirth || '',
    signerCapacity: existingTax?.signerCapacity || 'Individual Beneficial Owner',
    electronicSignature: existingTax?.electronicSignature || existingTax?.legalName || '',
    taxCertAccepted: existingTax?.certificationAccepted ?? true,
  };

  // Pre-fill Payout Data (Beneficiary name defaults to legal tax name if not filled)
  const initialPayoutData: Partial<PayoutRailData> = {
    method: existingPayout?.method === 'debit_card' || pm?.type === 'debit_card' ? 'debit_card' : 'bank_account',
    beneficiaryName:
      existingPayout?.beneficiaryName ||
      existingPayout?.accountName ||
      pmDetails.beneficiaryName ||
      pmDetails.accountName ||
      existingTax?.legalName ||
      '',
    bankName: existingPayout?.bankName || pmDetails.bankName || '',
    accountNumberOrIban:
      existingPayout?.accountNumberOrIban ||
      existingPayout?.accountNumber ||
      pmDetails.accountNumber ||
      pmDetails.iban ||
      '',
    sortCode: existingPayout?.sortCode || pmDetails.sortCode || '',
    swiftBic: existingPayout?.swiftBic || pmDetails.swiftBic || '',
    cardNumber:
      existingPayout?.cardNumber ||
      pmDetails.cardNumber ||
      (existingPayout?.cardNumberLast4 ? `•••• •••• •••• ${existingPayout.cardNumberLast4}` : '') ||
      (pmDetails.cardNumberLast4 ? `•••• •••• •••• ${pmDetails.cardNumberLast4}` : '') ||
      '',
    cardExpiry: existingPayout?.cardExpiry || pmDetails.cardExpiry || '',
    cardBrand: existingPayout?.cardBrand || pmDetails.cardBrand || '',
    currency:
      existingPayout?.currency ||
      pmDetails.currency ||
      (existingTax?.taxClassification === 'UK_DOMESTIC' ? 'GBP' : 'USD'),
  };

  // Form states - Profile
  const [companyName, setCompanyName] = useState(existingPromo?.companyName || '');
  const [primaryUrl, setPrimaryUrl] = useState(existingPromo?.primaryUrl || '');
  const [companyLogoUrl, setCompanyLogoUrl] = useState(existingPromo?.companyLogoUrl || '');
  const [niche, setNiche] = useState(existingPromo?.niche || 'AI & B2B SaaS Software');
  const [promotionalStrategy, setPromotionalStrategy] = useState(existingPromo?.promotionalStrategy || '');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(profile.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTabChange = (tab: 'tax' | 'payout' | 'profile' | 'standing') => {
    setActiveTab(tab);
    setErrorMessage(null);
    router.replace(`/settings?tab=${tab}`, { scroll: false });
  };

  // Save Tax Declaration
  const handleTaxSave = (data: TaxDeclarationData) => {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        await updateTaxDeclarationAction({
          formType: data.formType,
          taxClassification: data.taxClassification,
          legalName: data.legalName,
          businessType: data.businessType,
          taxId: data.taxId,
          taxResidenceCountry: data.taxResidenceCountry,
          vatRegistered: data.vatRegistered,
          vatNumber: data.vatNumber,
          companiesHouseCrn: data.companiesHouseCrn,
          street: data.street,
          city: data.city,
          stateProv: data.stateProv,
          postalCode: data.postalCode,
          dateOfBirth: data.dateOfBirth,
          signerCapacity: data.signerCapacity,
          electronicSignature: data.electronicSignature,
        });
        showToast('Tax declaration certified and saved successfully! Auto-settlement active.');
        setIsEditingTax(false);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to save tax declaration.');
      }
    });
  };

  // Save Payout Rails
  const handlePayoutSave = (data: PayoutRailData) => {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        await updatePayoutRailAction({
          method: data.method,
          beneficiaryName: data.beneficiaryName,
          bankName: data.bankName,
          accountNumberOrIban: data.accountNumberOrIban,
          sortCode: data.sortCode,
          swiftBic: data.swiftBic,
          cardNumber: data.cardNumber,
          cardExpiry: data.cardExpiry,
          cardBrand: data.cardBrand,
          currency: data.currency,
        });
        showToast('Beneficiary disbursal preferences updated successfully.');
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to update payout settings.');
      }
    });
  };

  // Save Profile
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      try {
        await updatePartnerProfileAction({
          companyName,
          companyLogoUrl,
          primaryUrl,
          niche,
          promotionalStrategy,
        });
        showToast('Partner media profile updated successfully.');
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to update partner profile.');
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-[#09090B] pb-24 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-black text-white px-5 py-3 text-xs font-bold shadow-2xl flex items-center gap-2 border border-neutral-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. HIGH-POLISH HEADER WITH BREADCRUMB & STATUS BADGES ── */}
      <div className="border-b border-neutral-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              <span>INNOTEK GLOBAL</span>
              <span>/</span>
              <span>PARTNER PORTAL</span>
              <span>/</span>
              <span className="text-black font-bold">SETTINGS</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
              Account Settings &amp; Regulatory Compliance
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
              Manage your statutory tax residency declaration, disbursement banking rails, verified promotional media channels, and network standing.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Tax Standing Badge */}
            {hasTaxInfo ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-900 shadow-2xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Tax Certified ({existingTax?.formType || 'W-8BEN/W-9'})</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-900 shadow-2xs animate-pulse">
                <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span>Tax Action Required</span>
              </div>
            )}

            {/* Account Status Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-100 px-3.5 py-1.5 text-xs font-bold text-neutral-800 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="uppercase">{profile.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-300 bg-rose-50/80 p-4 text-xs font-semibold text-rose-900 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Error Updating Preferences: </strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* ── 2. SEGMENTED NAVIGATION TABS ── */}
      <div className="border-b border-neutral-200">
        <nav className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar">
          
          <button
            type="button"
            onClick={() => handleTabChange('tax')}
            className={`relative flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'tax'
                ? 'text-black font-bold border-b-2 border-black'
                : 'text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-t-lg'
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span>Tax &amp; Compliance</span>
            {!hasTaxInfo ? (
              <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold">
                Action Required
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[10px] font-bold">
                ✓
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('payout')}
            className={`relative flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'payout'
                ? 'text-black font-bold border-b-2 border-black'
                : 'text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-t-lg'
            }`}
          >
            <Landmark className="h-4 w-4 shrink-0" />
            <span>Payout Rails &amp; Banking</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={`relative flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'text-black font-bold border-b-2 border-black'
                : 'text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-t-lg'
            }`}
          >
            <User className="h-4 w-4 shrink-0" />
            <span>Partner Media Profile</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('standing')}
            className={`relative flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'standing'
                ? 'text-black font-bold border-b-2 border-black'
                : 'text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-t-lg'
            }`}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Account Standing &amp; Referral Codes</span>
          </button>

        </nav>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 1: TAX & STATUTORY REGULATORY COMPLIANCE
         ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tax' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Statutory Advisory Notice */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white shrink-0">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-[#09090B]">
                  HMRC &amp; International Tax Withholding Requirements (SI 2023/1263)
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Under UK HMRC Digital Platform Regulations and international tax treaties (IRS Chapter 3), Innotek Global Ltd is legally required to verify taxpayer identification and permanent tax residency before releasing commission rewards. Certified declarations qualify for <strong>0% statutory withholding</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* If Tax is on File and NOT in Edit Mode -> Display Official Certificate */}
          {hasTaxInfo && !isEditingTax ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    VERIFIED &bull; TAX DECLARATION ON FILE
                  </span>
                  <h2 className="font-display text-xl font-bold text-[#09090B] mt-2">
                    {existingTax?.formType || 'W-8BEN'} Statutory Certification
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Document Reference: <span className="font-mono font-bold text-black">{profile.id.substring(0, 12).toUpperCase()}-TAX-CERT</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingTax(true)}
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100 hover:border-black transition cursor-pointer shadow-2xs"
                >
                  Update Tax Declaration
                </button>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-1">
                  <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    Beneficial Owner Legal Name
                  </span>
                  <p className="text-black font-bold text-sm truncate">
                    {existingTax?.legalName || initialTaxData.legalName}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-1">
                  <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    Tax Classification
                  </span>
                  <p className="text-black font-bold text-sm">
                    {existingTax?.taxClassification === 'UK_DOMESTIC'
                      ? 'UK Domestic Resident'
                      : existingTax?.taxClassification === 'US_PERSON'
                      ? 'US Taxpayer (W-9)'
                      : 'International (W-8BEN)'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-1">
                  <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    Permanent Tax Residence
                  </span>
                  <p className="text-black font-bold text-sm">
                    {existingTax?.taxResidenceCountry || initialTaxData.taxResidenceCountry}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-1">
                  <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    Tax Identification (TIN / UTR / NINO)
                  </span>
                  <p className="text-black font-bold font-mono text-sm">
                    {initialTaxData.taxId ? `••••••${initialTaxData.taxId.slice(-4)}` : 'ON RECORD'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-1">
                  <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    Withholding Treaty Rate
                  </span>
                  <p className="text-emerald-700 font-bold text-sm font-mono">
                    0.0% (Treaty Exempt)
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-1">
                  <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    Electronic Execution Nonce
                  </span>
                  <p className="text-black font-medium text-xs truncate font-mono">
                    {existingTax?.electronicSignature || initialTaxData.legalName} &bull; Signed
                  </p>
                </div>

              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Certified under statutory penalties of perjury (UK Fraud Act 2006 / IRS regulations).</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Auto-settlement Active
                </span>
              </div>

            </div>
          ) : (
            /* Unified Government Standard Form Sheet */
            <div className="rounded-2xl border-2 border-black bg-white p-6 sm:p-8 shadow-md">
              <TaxComplianceForm
                initialData={initialTaxData}
                onSave={handleTaxSave}
                onCancel={hasTaxInfo ? () => setIsEditingTax(false) : undefined}
                isPending={isPending}
                submitButtonLabel="Save & Certify Statutory Tax Declaration"
                mode="standalone"
              />
            </div>
          )}

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 2: PAYOUT RAILS & BANKING SETTLEMENT
         ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'payout' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="rounded-2xl border-2 border-black bg-white p-6 sm:p-8 shadow-md">
            <PayoutRailsForm
              initialData={initialPayoutData}
              legalNameFallback={existingTax?.legalName || initialTaxData.legalName || ''}
              taxResidenceCountry={existingTax?.taxResidenceCountry || initialTaxData.taxResidenceCountry || 'United Kingdom'}
              taxClassification={existingTax?.taxClassification || initialTaxData.taxClassification || 'INTERNATIONAL'}
              onSave={handlePayoutSave}
              isPending={isPending}
              submitButtonLabel="Save Beneficiary Preferences"
              mode="standalone"
            />
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 3: PARTNER MEDIA PROFILE & PROMOTIONAL CHANNELS
         ═════════════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3.5 border-b border-neutral-200 pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 text-black">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-[#09090B]">
                  Verified Media Profile &amp; Channels
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update your brand information, primary promotional URL, and audience focus.
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5">
                    Brand / Company / Creator Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. TechInsights UK or Oliver Vance"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#09090B] outline-none focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5">
                    Primary Channel or Website URL
                  </label>
                  <input
                    type="url"
                    value={primaryUrl}
                    onChange={(e) => setPrimaryUrl(e.target.value)}
                    placeholder="https://youtube.com/@techinsights or https://techinsights.co.uk"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#09090B] font-mono outline-none focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5">
                    Brand Logo or Avatar URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={companyLogoUrl}
                    onChange={(e) => setCompanyLogoUrl(e.target.value)}
                    placeholder="https://innotek.global/assets/your-logo.png"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#09090B] font-mono outline-none focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5">
                    Primary Audience Vertical &amp; Niche
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g. AI Video Creation, HR Tech, Sports Analytics"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#09090B] outline-none focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5">
                    Promotional Strategy Notes
                  </label>
                  <textarea
                    rows={3}
                    value={promotionalStrategy}
                    onChange={(e) => setPromotionalStrategy(e.target.value)}
                    placeholder="Describe how you promote Innotek AI applications (e.g. YouTube tutorial deep-dives, blog comparison reviews, LinkedIn creator audience)..."
                    className="w-full rounded-xl border border-neutral-300 bg-white p-3.5 text-xs sm:text-sm text-[#09090B] outline-none focus:border-black focus:ring-1 focus:ring-black shadow-2xs leading-relaxed"
                  />
                </div>

              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-black px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
                  <span>Save Partner Profile</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 4: ACCOUNT STANDING & SECURITY
         ═════════════════════════════════════════════ */}
      {activeTab === 'standing' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3.5 border-b border-neutral-200 pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 text-black">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-[#09090B]">
                  Network Standing &amp; Tracking Security
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Verified partner identity, unique tracking parameters, and legal compliance history.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
              
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-1">
                <span className="text-neutral-500 uppercase text-[10px] font-semibold block tracking-wider">
                  Unique Partner Code
                </span>
                <div className="flex items-center justify-between pt-0.5">
                  <p className="text-black font-bold font-mono text-base">{profile.code}</p>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-700 hover:text-black hover:underline cursor-pointer"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-1">
                <span className="text-neutral-500 uppercase text-[10px] font-semibold block tracking-wider">
                  Network Standing
                </span>
                <p className="text-emerald-700 font-bold uppercase text-sm mt-1">
                  {profile.status} &bull; IN GOOD STANDING
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-1">
                <span className="text-neutral-500 uppercase text-[10px] font-semibold block tracking-wider">
                  Cookie Attribution Window
                </span>
                <p className="text-black font-bold text-sm mt-1 font-mono">
                  60-Day First-Party
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-1">
                <span className="text-neutral-500 uppercase text-[10px] font-semibold block tracking-wider">
                  Base Commission Rate
                </span>
                <p className="text-black font-bold text-sm mt-1">
                  {(profile.commissionRate * 100).toFixed(0)}% Lifetime Recurring
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-1">
                <span className="text-neutral-500 uppercase text-[10px] font-semibold block tracking-wider">
                  Partner Email
                </span>
                <p className="text-black font-semibold text-xs mt-1 truncate">
                  {profile.email}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-1">
                <span className="text-neutral-500 uppercase text-[10px] font-semibold block tracking-wider">
                  Legal Agreements
                </span>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <Link href="/affiliate-agreement" target="_blank" className="text-black hover:underline font-bold">
                    Agreement v2.4 ↗
                  </Link>
                  <span>&bull;</span>
                  <Link href="/terms" target="_blank" className="text-black hover:underline font-bold">
                    Terms ↗
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
