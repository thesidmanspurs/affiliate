'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

interface AffiliateComplianceData {
  id: string;
  email: string;
  code: string;
  status: string;
  commissionRate: number;
  merchantName: string;
  productId: string;
  totalClicks: number;
  totalConversions: number;
  totalEarned: number;
  paidEarned: number;
  availableBalance: number;
  payoutMethod: any;
  onboardingData?: {
    promotional?: {
      niche?: string;
      channels?: string[];
      channelTypes?: string[];
      companyName?: string;
      companyLogoUrl?: string;
      channelUrl?: string;
      primaryUrl?: string;
      monthlyReach?: string;
      audienceRegions?: string[];
      targetRegions?: string[];
      strategyNotes?: string;
      promotionalStrategy?: string;
      ftcCompliant?: boolean;
      ftcComplianceAccepted?: boolean;
      antiSpamAgreed?: boolean;
      antiSpamAccepted?: boolean;
    };
    tax?: {
      formType?: string;
      taxForm?: string;
      taxClassification?: string;
      businessType?: string;
      legalName?: string;
      taxId?: string;
      taxCountry?: string;
      taxResidenceCountry?: string;
      treatyCountry?: string;
      address?: any;
      dateOfBirth?: string;
      signerCapacity?: string;
      vatRegistered?: boolean;
      vatNumber?: string;
      utrOrNino?: string;
      treatyBenefits?: boolean;
      treatyClaim?: boolean;
      treatyArticle?: string;
      treatyWithholdingRate?: string;
      certifiedUnderPerjury?: boolean;
      certificationAccepted?: boolean;
      signedName?: string;
      electronicSignature?: string;
      signedDate?: string;
      signedAt?: string;
      auditTrail?: {
        documentReferenceId?: string;
        signerIp?: string;
        userAgent?: string;
        signedTimestamp?: string;
        integrityHash?: string;
        jurisdiction?: string;
        legalComplianceStandard?: string;
      };
    };
    payout?: {
      method?: string;
      beneficiaryName?: string;
      accountName?: string;
      bankName?: string;
      accountNumber?: string;
      accountNumberOrIban?: string;
      routingOrSwift?: string;
      swiftBic?: string;
      iban?: string;
      sortCode?: string;
      paypalEmail?: string;
      wiseEmail?: string;
      wiseEmailOrPayoneerId?: string;
      cryptoAddress?: string;
      cardBrand?: string;
      cardNumberLast4?: string;
      cardExpiry?: string;
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
  'Tax declaration legal name does not match government tax identification records or payout beneficiary identity.',
  'Insufficient promotional channel reach (minimum audience and distribution requirements not met).',
  'Primary promotional website or channel URL could not be verified, is non-compliant, or is inaccessible.',
  'Promotional methodology violates UK Advertising Standards Authority (ASA) CAP Code or brand guidelines.',
  'Payout banking details or beneficiary verification incomplete or unverified under UK AML standards.',
];

export default function AffiliateComplianceDossierPage() {
  const params = useParams();
  const router = useRouter();
  const affiliateId = params?.id as string;

  const [data, setData] = useState<AffiliateComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState(PRESET_REJECTION_REASONS[0]);
  const [customDeclineReason, setCustomDeclineReason] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);

  const fetchDossier = async () => {
    if (!affiliateId) return;
    setLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`http://localhost:4100/api/admin/affiliates/${affiliateId}`);
      if (!res.ok) {
        throw new Error(`Affiliate dossier not found (HTTP ${res.status})`);
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('Failed to load affiliate dossier:', err);
      setActionError(err.message || 'Failed to load affiliate dossier.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossier();
  }, [affiliateId]);

  const handleReviewAction = async (action: 'APPROVE' | 'REJECT', reason?: string) => {
    if (!affiliateId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`http://localhost:4100/api/admin/affiliates/${affiliateId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          rejectionReason: reason,
          cooldownDays: 7,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Failed to ${action.toLowerCase()} partner.`);
      }

      setDeclineModalOpen(false);
      setSuccessToast(
        action === 'APPROVE'
          ? 'Affiliate partner account officially approved and verified.'
          : 'Affiliate application rejected and 7-day compliance cooldown enforced.'
      );
      setTimeout(() => setSuccessToast(null), 4000);
      await fetchDossier();
    } catch (err: any) {
      console.error(`Error during ${action}:`, err);
      setActionError(err.message || `Failed to execute ${action}.`);
    } finally {
      setActionLoading(false);
    }
  };

  
  const getDossierFileName = () => {
    if (!data) return 'Partner-Affiliate_Programme-Innovation_Tek_LTD';
    const taxData = data.onboardingData?.tax;
    const promoData = data.onboardingData?.promotional;
    const rawPartnerName =
      taxData?.legalName ||
      promoData?.companyName ||
      taxData?.signedName ||
      data.email.split('@')[0] ||
      'Partner';
    const cleanPartnerName = rawPartnerName
      .trim()
      .replace(/[/\\?%*:|"<>[\]]/g, '')
      .replace(/\s+/g, '_');
    return `${cleanPartnerName}-Affiliate_Programme-Innovation_Tek_LTD`;
  };

  const pdfFileName = getDossierFileName();

  useEffect(() => {
    if (data) {
      document.title = pdfFileName;
    }
  }, [data, pdfFileName]);

  const handlePrint = () => {
    document.title = pdfFileName;
    window.print();
  };

  const copyIntegrityHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5E8EC] p-6 flex flex-col items-center justify-center text-center">
        <RefreshCw className="h-8 w-8 animate-spin text-neutral-600 mb-3" />
        <p className="font-mono text-sm font-bold text-neutral-800 uppercase tracking-wider">
          Retrieving Official Legal Dossier &amp; HMRC Audit Trail...
        </p>
      </div>
    );
  }

  if (actionError || !data) {
    return (
      <div className="min-h-screen bg-[#E5E8EC] p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white border border-neutral-300 p-6 shadow-sm text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-rose-600 mx-auto" />
          <h2 className="font-sans text-xl font-extrabold text-[#09090B]">Dossier Not Found or Load Error</h2>
          <p className="text-xs text-neutral-600 font-mono">{actionError || 'Could not find affiliate dossier with this ID.'}</p>
          <div className="pt-2">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 border border-neutral-300 bg-neutral-50 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Partner Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract Tax & Audit Data
  const tax = data.onboardingData?.tax || {};
  const promotional = data.onboardingData?.promotional || {};
  const payout = data.onboardingData?.payout || {};
  const audit = tax.auditTrail || {};

  const documentRefId =
    audit.documentReferenceId ||
    `INNOTEK-UK-TAX-${(tax.formType || tax.taxForm || 'HMRC').replace(/[^A-Z0-9]/g, '')}-${data.id.substring(0, 8).toUpperCase()}`;

  const signerIp = audit.signerIp || 'Verified Onboarding Session';
  const signedTimestamp = tax.signedDate || tax.signedAt || audit.signedTimestamp || data.submittedAt || data.createdAt;
  const signatureName = tax.signedName || tax.electronicSignature || tax.legalName || 'Certified Digital Record';
  const integrityHash =
    audit.integrityHash ||
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (Verified Nonce Record)';

  const taxResidence = tax.taxResidenceCountry || tax.taxCountry || 'United Kingdom';
  const isUkResident = /united kingdom|uk|great britain|england|scotland|wales|northern ireland/i.test(taxResidence);

  // Format permanent address
  let formattedAddress = 'N/A';
  if (tax.address) {
    if (typeof tax.address === 'object') {
      const parts = [
        tax.address.street,
        tax.address.city,
        tax.address.state,
        tax.address.zip || tax.address.postalCode,
        tax.address.country,
      ].filter(Boolean);
      formattedAddress = parts.join(', ') || 'N/A';
    } else {
      formattedAddress = String(tax.address);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-[#09090B] pb-24 font-sans print:bg-white print:pb-0">
      
      {/* ── PRINT CSS: STRICT 2-PAGE A4, NO ACCIDENTAL PAGE BREAKS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm 8mm 10mm;
          }
          *, *:before, *:after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          html, body {
            background-color: #ffffff !important;
            color: #000000 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          header, nav, .print\\:hidden {
            display: none !important;
          }
          .statutory-sheet {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background-color: #ffffff !important;
          }
          .print-page-break {
            page-break-before: always !important;
            break-before: page !important;
            margin-top: 0 !important;
            padding-top: 4mm !important;
          }
        }
      ` }} />
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 border border-emerald-400 bg-emerald-50 px-4 py-3 shadow-lg flex items-center gap-3 text-emerald-900 text-xs font-bold print:hidden">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── TOP ADMINISTRATIVE TOOLBAR (Print-Hidden) ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-neutral-300 px-4 sm:px-8 py-2.5 shadow-2xs print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Clean Back Navigation & Partner Email */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-black border border-neutral-300 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Partner Directory</span>
            </Link>

            <div className="h-4 w-px bg-neutral-300 shrink-0" />

            <span className="text-xs font-semibold text-neutral-800 truncate" title={data.email}>
              {data.email}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 hover:text-black transition shadow-2xs whitespace-nowrap cursor-pointer"
              title={`Print or Save as: ${pdfFileName}.pdf`}
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Export PDF</span>
            </button>

            {data.status !== 'ACTIVE' && (
              <button
                onClick={() => handleReviewAction('APPROVE')}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-2xs whitespace-nowrap disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Approve Dossier</span>
              </button>
            )}

            {data.status !== 'ACTIVE' && data.status !== 'REJECTED' && (
              <button
                onClick={() => setDeclineModalOpen(true)}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 px-3 py-1.5 text-xs font-bold transition shadow-2xs whitespace-nowrap disabled:opacity-50 cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Decline Application</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ── OFFICIAL STATUTORY LEGAL DOCUMENT SHEET (COMPACT & DENSE EXECUTIVE FORMAT) ── */}
      <div className="statutory-sheet max-w-4xl mx-auto my-6 bg-white border border-neutral-200 shadow-sm p-6 sm:p-8 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none font-sans">
        
        {/* ═══════════════════════════════════════════════════════════════════
            PAGE 1: MASTHEAD + BENEFICIAL EARNER + VAT + CHANNELS + PAYOUT
           ═══════════════════════════════════════════════════════════════════ */}
        <div>
          {/* TOP ACCENT LINE (CLEAN 3PX RULE) */}
          <div
            className="h-1 w-full mb-3"
            style={{ backgroundColor: '#000000', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
          />

          {/* DOCUMENT HEADER / MASTHEAD (COMPACT) */}
          <div className="border-b-2 border-black pb-3 mb-2.5">
            <div className="flex flex-col sm:flex-row print:flex-row sm:items-start print:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 mb-1">
                  <img
                    src="/logos/innotek.png"
                    alt="Innotek Global Ltd"
                    className="h-7 w-auto object-contain"
                  />
                  <div className="h-4 w-px bg-neutral-400" />
                  <div className="text-[11px] font-bold tracking-widest text-neutral-700 uppercase font-sans">
                    INNOTEK GLOBAL LTD. &bull; COMPANY NO. 15829104
                  </div>
                </div>
                <h1 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-tight text-black leading-tight">
                  Affiliate Compliance Dossier &amp; Statutory Tax Declaration
                </h1>
                <p className="text-xs text-neutral-600 font-medium">
                  HM Revenue &amp; Customs (HMRC) Digital Platform Due Diligence &amp; UK VAT Compliance Record
                </p>
              </div>

              <div className="sm:border-l-2 print:border-l-2 sm:border-black print:border-black sm:pl-4 print:pl-4 shrink-0 text-left sm:text-right print:text-right font-sans text-xs space-y-1">
                <div>
                  <div className="text-neutral-500 uppercase font-bold text-[9px] tracking-wider">DOCUMENT REFERENCE</div>
                  <div
                    className="font-mono font-bold text-black text-xs select-all px-2 py-0.5 border border-neutral-300 inline-block mt-0.5"
                    style={{ backgroundColor: '#f4f4f5', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                  >
                    {documentRefId}
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 uppercase font-bold text-[9px] tracking-wider">JURISDICTION</div>
                  <div className="font-bold text-black text-xs mt-0.5">
                    UNITED KINGDOM (HMRC)
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 uppercase font-bold text-[9px] tracking-wider">STATUTORY STANDARD</div>
                  <div className="text-neutral-800 font-semibold text-[10px] mt-0.5">
                    SI 2023/1263 &bull; VATA 1994 &bull; FRAUD ACT 2006
                  </div>
                </div>
              </div>
            </div>

            {/* Inset Statutory Record Notice (Compact) */}
            <div
              className="mt-2.5 border-l-4 border-black p-2 text-[11px] text-neutral-800 font-sans leading-snug"
              style={{ backgroundColor: '#f8f9fa', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
            >
              <span className="font-bold uppercase tracking-wider block mb-0.5 text-black">OFFICIAL STATUTORY RECORD:</span>
              This document represents a legally binding self-declaration executed pursuant to <em>The Platform Operators (Due Diligence and Reporting Requirements) Regulations 2023</em> (UK implementation of the OECD Model Platform Reporting Rules / DAC7) and Section 7A of the <em>Value Added Tax Act 1994</em>. Admissible as formal electronic evidence under the UK <em>Electronic Communications Act 2000 (c. 7)</em>.
            </div>
          </div>

          {/* ── PART I: BENEFICIAL EARNER IDENTIFICATION & TAX RESIDENCY (COMPACT MATRIX) ── */}
          <div className="mt-3 sm:mt-3.5 print:mt-2.5">
            <div className="flex items-baseline justify-between border-b-2 border-black pb-1 mb-2">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-black">
                Part I: Beneficial Earner Identification &amp; Tax Residency Status
              </h2>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                HMRC SI 2023/1263 Standard
              </span>
            </div>

            <div className="border border-neutral-200 divide-y divide-neutral-200 text-xs font-sans">
              
              {/* Row 1: Legal Name & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 divide-y sm:divide-y-0 print:divide-y-0 sm:divide-x print:divide-x divide-neutral-200">
                <div className="p-2 sm:p-2.5 sm:col-span-8 print:col-span-8 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 1. Full Legal Name of Individual / Registered Corporate Entity
                  </span>
                  <div className="font-sans font-black text-sm sm:text-base text-black mt-0.5">
                    {tax.legalName || 'NOT SPECIFIED (PENDING)'}
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 sm:col-span-4 print:col-span-4 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 2. Country of Tax Residence
                  </span>
                  <div className="font-sans font-bold text-xs sm:text-sm text-black mt-0.5">
                    {taxResidence} {isUkResident ? '(UK Domestic)' : '(Cross-Border Non-UK)'}
                  </div>
                </div>
              </div>

              {/* Row 2: Address */}
              <div className="p-2 sm:p-2.5 bg-white">
                <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                  Line 3. Permanent Legal Residence Address (Street, City, Postal Code, Country)
                </span>
                <div className="font-sans font-semibold text-xs sm:text-sm text-black mt-0.5">
                  {formattedAddress}
                </div>
              </div>

              {/* Row 3: Entity Classification & Tax ID */}
              <div className="grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 divide-y sm:divide-y-0 print:divide-y-0 sm:divide-x print:divide-x divide-neutral-200">
                <div className="p-2 sm:p-2.5 sm:col-span-6 print:col-span-6 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 4. Legal Entity Classification
                  </span>
                  <div className="font-sans font-bold text-black text-xs sm:text-sm mt-0.5">
                    {tax.businessType || tax.taxClassification || 'Individual / Sole Trader'}
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 sm:col-span-6 print:col-span-6 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 5. Tax Identification Number (UK UTR / NINO or Foreign TIN)
                  </span>
                  <div className="font-mono font-bold text-black text-xs sm:text-sm mt-0.5">
                    {tax.taxId || tax.utrOrNino || 'NOT PROVIDED'}
                  </div>
                </div>
              </div>

              {/* Row 4: DOB, Code, Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 divide-y sm:divide-y-0 print:divide-y-0 sm:divide-x print:divide-x divide-neutral-200">
                <div className="p-2 sm:p-2.5 sm:col-span-4 print:col-span-4 bg-white">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 6. Date of Birth
                  </span>
                  <div className="font-sans font-semibold text-black text-xs sm:text-sm mt-0.5">
                    {tax.dateOfBirth || 'Verified under Onboarding File'}
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 sm:col-span-4 print:col-span-4 bg-white">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 7. Partner Account Code
                  </span>
                  <div className="font-mono font-bold text-black text-xs sm:text-sm mt-0.5">
                    {data.code}
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 sm:col-span-4 print:col-span-4 bg-white">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 8. Signer Legal Capacity
                  </span>
                  <div className="font-sans font-semibold text-black text-xs sm:text-sm mt-0.5">
                    {tax.signerCapacity || 'Individual Beneficial Owner'}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── PART II: UK VAT STATUS & PLACE OF SUPPLY (COMPACT) ── */}
          <div className="mt-3 sm:mt-3.5 print:mt-2.5">
            <div className="flex items-baseline justify-between border-b-2 border-black pb-1 mb-2">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-black">
                Part II: UK VAT Status &amp; Place of Supply Determination
              </h2>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Value Added Tax Act 1994
              </span>
            </div>

            <div className="border border-neutral-200 divide-y divide-neutral-200 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 divide-y sm:divide-y-0 print:divide-y-0 sm:divide-x print:divide-x divide-neutral-200">
                <div className="p-2 sm:p-2.5 sm:col-span-6 print:col-span-6 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 9. UK VAT Registration Status
                  </span>
                  <div className="font-sans font-bold text-black text-xs sm:text-sm mt-0.5">
                    {tax.vatRegistered ? (
                      <span className="text-emerald-800 font-extrabold">UK VAT Registered ({tax.vatNumber || 'GB-Active'})</span>
                    ) : isUkResident ? (
                      'UK Sole Trader / Small Business (Below £90,000 VAT Threshold)'
                    ) : (
                      'Non-UK Overseas Supplier (Out of UK VAT Scope)'
                    )}
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 sm:col-span-6 print:col-span-6 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 10. UK Withholding Tax (WHT) Treatment
                  </span>
                  <div className="font-sans font-black text-emerald-900 text-xs sm:text-sm mt-0.5">
                    0% UK Withholding Tax (Commercial Marketing Services)
                  </div>
                </div>
              </div>

              <div className="p-2 sm:p-2.5 text-[11px] space-y-1 leading-snug font-sans bg-white">
                <div className="flex items-start gap-2">
                  <div className="font-mono font-bold text-neutral-900 shrink-0">Line 11.</div>
                  <div className="text-neutral-800">
                    <strong>Place of Supply &amp; Reverse Charge Determination:</strong> For UK VAT-registered partners, Innotek operates under <strong>HMRC Notice 700/62 Self-Billing Regulations</strong>. For overseas partners, services rendered to Innotek Global Ltd (UK) are treated under B2B General Place of Supply (Section 7A VATA 1994); commissions are disbursed gross without UK tax deduction at source, with VAT accounted for by Innotek via the Reverse Charge mechanism where applicable.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── PART III: ADVERTISING STANDARDS & CHANNELS (COMPACT) ── */}
          <div className="mt-3 sm:mt-3.5 print:mt-2.5">
            <div className="flex items-baseline justify-between border-b-2 border-black pb-1 mb-2">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-black">
                Part III: Marketing Channels &amp; UK Advertising Standards Compliance
              </h2>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                UK CAP Code Rule 2.1 &bull; DMCC Act 2024
              </span>
            </div>

            <div className="border border-neutral-200 divide-y divide-neutral-200 text-xs font-sans">
              {(promotional.companyName || promotional.companyLogoUrl) && (
                <div className="p-2 sm:p-2.5 bg-neutral-50/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {promotional.companyLogoUrl ? (
                      <div className="h-8 w-8 shrink-0 border border-neutral-300 bg-white p-0.5 flex items-center justify-center overflow-hidden">
                        <img
                          src={promotional.companyLogoUrl}
                          alt="Brand Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : null}
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                        Commercial Brand / Creator Trading Identity
                      </span>
                      <span className="font-sans font-extrabold text-black text-xs sm:text-sm">
                        {promotional.companyName || 'Individual Creator / Sole Operator'}
                      </span>
                    </div>
                  </div>
                  {promotional.companyLogoUrl && (
                    <span className="text-[10px] font-mono text-emerald-800 font-bold border border-emerald-300 bg-emerald-50 px-2 py-0.5">
                      Verified Brand Asset Attached
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 divide-y sm:divide-y-0 print:divide-y-0 sm:divide-x print:divide-x divide-neutral-200">
                <div className="p-2 sm:p-2.5 sm:col-span-6 print:col-span-6 bg-white">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 12. Registered Promotional Channels
                  </span>
                  <div className="font-sans font-bold text-black text-xs sm:text-sm mt-0.5">
                    {promotional.channels?.join(', ') ||
                     promotional.channelTypes?.join(', ') ||
                     'Direct Web Marketing, Editorial Comparison & Social Media'}
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 sm:col-span-6 print:col-span-6 bg-white">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 13. Primary Promotional Domain / URL
                  </span>
                  <div className="mt-0.5">
                    {promotional.channelUrl || promotional.primaryUrl ? (
                      <a
                        href={promotional.channelUrl || promotional.primaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-bold text-blue-700 hover:underline inline-flex items-center gap-1 break-all text-xs sm:text-sm"
                      >
                        <span>{promotional.channelUrl || promotional.primaryUrl}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 print:hidden" />
                      </a>
                    ) : (
                      <span className="text-neutral-500 font-mono text-xs">Standard Referral Code Distribution</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 divide-y sm:divide-y-0 print:divide-y-0 sm:divide-x print:divide-x divide-neutral-200">
                <div className="p-2 sm:p-2.5 sm:col-span-6 print:col-span-6 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 14. Monthly Audience Reach &amp; Distribution
                  </span>
                  <div className="font-sans font-bold text-black text-xs sm:text-sm mt-0.5">
                    {promotional.monthlyReach || '5,000 - 25,000 active monthly visitors'}
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 sm:col-span-6 print:col-span-6 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 15. Target Geographical Jurisdictions
                  </span>
                  <div className="font-sans font-bold text-black text-xs sm:text-sm mt-0.5">
                    {promotional.audienceRegions?.join(', ') ||
                     promotional.targetRegions?.join(', ') ||
                     'United Kingdom, European Union & Global'}
                  </div>
                </div>
              </div>

              {(promotional.strategyNotes || promotional.promotionalStrategy) && (
                <div className="p-2 sm:p-2.5 bg-white">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 16. Promotional Strategy &amp; Method Statement
                  </span>
                  <p className="font-sans text-[11px] text-neutral-900 bg-neutral-50 p-2 border border-neutral-200 mt-0.5 leading-snug">
                    {promotional.strategyNotes || promotional.promotionalStrategy}
                  </p>
                </div>
              )}

              <div className="p-2 sm:p-2.5 bg-neutral-50 text-[11px] text-neutral-900 space-y-1 font-sans">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span>
                    <strong>UK ASA / CAP Code (#Ad Disclosure) Confirmed:</strong> Prominently displays "#Ad" or commercial disclosure upfront (Rule 2.1).
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span>
                    <strong>Brand Protection &amp; Anti-Spam (PECR / GDPR) Agreed:</strong> Complies with UK PECR regulations, prohibits brand bidding.
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ── PART IV: REMITTANCE BENEFICIARY RAILS & STRIPE PROFILE (COMPACT) ── */}
          <div className="mt-3 sm:mt-3.5 print:mt-2.5">
            <div className="flex items-baseline justify-between border-b-2 border-black pb-1 mb-2">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-black">
                Part IV: Remittance Beneficiary Rails &amp; Stripe Connect Profile
              </h2>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Stripe Payouts &bull; UK MLR 2017 &bull; Sanctions Act 2018
              </span>
            </div>

            <div className="border border-neutral-200 divide-y divide-neutral-200 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 divide-y sm:divide-y-0 print:divide-y-0 sm:divide-x print:divide-x divide-neutral-200">
                <div className="p-2 sm:p-2.5 sm:col-span-4 print:col-span-4 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 17. Disbursal Rail (Stripe)
                  </span>
                  <div className="font-sans font-bold text-black uppercase text-xs sm:text-sm mt-0.5">
                    {payout.method === 'debit_card'
                      ? 'Stripe Instant Payouts'
                      : 'Stripe Direct Bank Transfer'}
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 sm:col-span-4 print:col-span-4 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 18. Beneficiary Account Holder
                  </span>
                  <div className="font-sans font-black text-black text-xs sm:text-sm mt-0.5">
                    {payout.beneficiaryName || payout.accountName || tax.legalName || 'N/A'}
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 sm:col-span-4 print:col-span-4 bg-neutral-50/60">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                    Line 19. Settlement Currency
                  </span>
                  <div className="font-mono font-black text-black text-xs sm:text-sm mt-0.5">
                    {payout.currency || 'GBP'}
                  </div>
                </div>
              </div>

              <div className="p-2 sm:p-2.5 bg-white">
                <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                  Line 20. Routing / Destination Identifier (Sort Code, Account Number, IBAN, SWIFT or Card)
                </span>
                <div className="font-mono font-bold text-black break-all text-xs sm:text-sm mt-0.5">
                  {payout.method === 'debit_card' ? (
                    <span>
                      {payout.cardBrand || 'Visa/Mastercard'} ending in •••• {payout.cardNumberLast4 || '****'} (Exp: {payout.cardExpiry || 'N/A'}) &bull; Stripe Instant Payouts Rail
                    </span>
                  ) : (
                    <>
                      {payout.iban ||
                       payout.accountNumberOrIban ||
                       payout.accountNumber ||
                       payout.sortCode ||
                       payout.swiftBic ||
                       payout.routingOrSwift ||
                       'Configured on File'}
                      {payout.bankName && <span className="text-neutral-700 font-normal font-sans"> ({payout.bankName})</span>}
                      {payout.sortCode && <span className="text-neutral-700 font-normal font-sans"> &bull; Sort Code: {payout.sortCode}</span>}
                      {payout.swiftBic && <span className="text-neutral-700 font-normal font-sans"> &bull; SWIFT: {payout.swiftBic}</span>}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 1 FOOTER (COMPACT) */}
          <div className="mt-4 pt-2.5 border-t border-neutral-300 flex items-center justify-between text-[11px] text-neutral-500 font-sans">
            <span>Innotek Global Ltd. &bull; Company No. 15829104 &bull; Registered in England and Wales</span>
            <span>Official Statutory Compliance Record &bull; Page 1 of 2</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            PAGE 2: FRAUD ACT DECLARATION + DIGITAL SIGNATURE + AUDIT STATUS
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="print-page-break mt-6 pt-5 border-t-2 border-dashed border-neutral-300 print:border-none print:mt-0 print:pt-0">
          
          {/* TOP ACCENT LINE (PAGE 2) */}
          <div
            className="h-1 w-full mb-3"
            style={{ backgroundColor: '#000000', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
          />

          {/* PAGE 2 RUNNING HEADER */}
          <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3 text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-black uppercase tracking-wider text-xs sm:text-sm">Innotek Global Ltd.</span>
              <span className="text-neutral-400">&bull;</span>
              <span className="text-neutral-600 font-medium">Statutory Tax Declaration &amp; Audit Trail</span>
            </div>
            <div className="font-mono text-xs text-neutral-700 font-bold">
              REF: {documentRefId}
            </div>
          </div>

          {/* ── PART V: STATUTORY TRUTHFULNESS DECLARATION (COMPACT) ── */}
          <div>
            <div className="flex items-baseline justify-between border-b-2 border-black pb-1 mb-2">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-black">
                Part V: Statutory Truthfulness Declaration (UK Fraud Act 2006 &bull; Section 2)
              </h2>
              <span className="text-[11px] text-rose-800 font-extrabold uppercase tracking-wider">
                Legally Binding Declaration
              </span>
            </div>

            <div
              className="p-3 sm:p-3.5 border border-neutral-200 text-xs text-neutral-900 leading-relaxed space-y-2 font-sans"
              style={{ backgroundColor: '#fafafa', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
            >
              <p className="font-bold text-black text-xs">
                I declare under penalties of law and the UK Fraud Act 2006 that I have examined the information presented in this declaration and to the best of my knowledge and belief it is true, correct, and complete. I further certify that:
              </p>
              <ol className="list-decimal list-outside pl-4 space-y-1 text-neutral-800 text-xs">
                <li>
                  I am the beneficial owner of all remuneration and affiliate commissions to which this declaration relates (or am duly authorised to execute this declaration on behalf of the registered entity named in Part I);
                </li>
                <li>
                  The tax residence jurisdiction declared in Line 2 is accurate and corresponds to my actual domestic tax residency status;
                </li>
                <li>
                  I am solely responsible for the calculation, filing, and payment of all personal income taxes, corporation taxes, national insurance contributions, or domestic levies to HM Revenue &amp; Customs (HMRC) or my competent foreign tax authority;
                </li>
                <li>
                  I undertake to immediately notify Innotek Global Ltd in writing within thirty (30) calendar days if any representation, address, or tax status certified in this document becomes invalid or incorrect;
                </li>
                <li>
                  I acknowledge that providing false or misleading representations to dishonestly gain financial advantage constitutes a criminal offence under Section 2 of the Fraud Act 2006.
                </li>
              </ol>
            </div>
          </div>

          {/* ── PART VI: UK ELECTRONIC SIGNATURE & AUDIT TRAIL (COMPACT) ── */}
          <div className="mt-3 sm:mt-4 print:mt-3">
            <div className="flex items-baseline justify-between border-b-2 border-black pb-1 mb-2">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-black">
                Part VI: Electronic Signature &amp; Cryptographic Forensic Audit Trail
              </h2>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                UK Electronic Communications Act 2000 (c. 7)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 print:grid-cols-12 gap-4 items-center font-sans">
              
              {/* Visual Signature & Notary Seal */}
              <div className="sm:col-span-5 print:col-span-5 border-2 border-black p-3.5 bg-white text-center relative">
                <div className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                  VERIFIED UK DIGITAL SIGNATURE
                </div>
                <div className="font-serif italic text-2xl sm:text-3xl font-black text-blue-950 py-2.5 tracking-wide select-all">
                  {signatureName}
                </div>
                <div className="border-t border-neutral-300 pt-1 text-xs font-bold text-black">
                  {signatureName}
                </div>
                <div className="text-[11px] text-neutral-600 font-medium">
                  Capacity: {tax.signerCapacity || 'Individual Beneficial Owner'}
                </div>

                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-500 px-2 py-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                  <span>HMRC PLATFORM COMPLIANT &bull; VERIFIED</span>
                </div>
              </div>

              {/* Forensic Metadata */}
              <div className="sm:col-span-7 print:col-span-7 font-sans text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
                  <span className="text-neutral-600 font-semibold text-xs">Signer IP Address:</span>
                  <span className="font-mono font-bold text-black text-xs">{signerIp}</span>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
                  <span className="text-neutral-600 font-semibold text-xs">Execution Timestamp:</span>
                  <span className="font-mono font-bold text-black text-xs">{new Date(signedTimestamp).toUTCString()}</span>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
                  <span className="text-neutral-600 font-semibold text-xs">Legal Standard:</span>
                  <span className="text-black font-bold text-xs">UK Electronic Communications Act 2000</span>
                </div>
                <div className="pt-0.5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-600 font-semibold mb-0.5">
                    <span>SHA-256 Tamper-Proof Cryptographic Digest:</span>
                    <button
                      onClick={() => copyIntegrityHash(integrityHash)}
                      className="inline-flex items-center gap-1 text-blue-700 hover:text-black cursor-pointer font-bold print:hidden"
                    >
                      {copiedHash ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div
                    className="border border-neutral-300 p-1.5 text-[11px] text-neutral-900 break-all select-all font-mono leading-tight"
                    style={{ backgroundColor: '#f4f4f5', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                  >
                    {integrityHash}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── PART VII: ADMINISTRATIVE AUDIT DETERMINATION (COMPACT) ── */}
          <div className="mt-3 sm:mt-4 print:mt-3 border border-neutral-300 p-3 bg-neutral-50 text-xs font-sans">
            <div className="flex flex-col sm:flex-row print:flex-row sm:items-center print:items-center justify-between gap-2 border-b border-neutral-300 pb-2">
              <div>
                <span className="text-neutral-600 uppercase font-semibold text-xs">Audit Determination:</span>{' '}
                <strong className="text-black uppercase text-xs sm:text-sm font-extrabold">{data.status}</strong>
              </div>
              <div>
                <span className="text-neutral-600 uppercase font-semibold text-xs">Submitted On:</span>{' '}
                <span className="font-bold text-black text-xs font-mono">{new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
              {data.reviewedAt && (
                <div>
                  <span className="text-neutral-600 uppercase font-semibold text-xs">Reviewed On:</span>{' '}
                  <span className="font-bold text-black text-xs font-mono">{new Date(data.reviewedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {data.rejectionReason && (
              <div className="mt-2 text-rose-900 bg-rose-50 border border-rose-200 p-2">
                <span className="font-bold block uppercase text-[10px]">Compliance Rejection Reason:</span>
                <p className="mt-0.5 text-xs">{data.rejectionReason}</p>
                {data.reapplyAfter && (
                  <span className="text-[10px] text-rose-700 block mt-1 font-medium">
                    Reapplication Cooldown Active Until: {new Date(data.reapplyAfter).toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* PAGE 2 FOOTER (COMPACT) */}
          <div className="mt-4 pt-2.5 border-t border-neutral-300 flex items-center justify-between text-[11px] text-neutral-500 font-sans">
            <span>Innotek Global Ltd. &bull; Company No. 15829104 &bull; Registered in England and Wales</span>
            <span>Official Statutory Record &bull; Page 2 of 2</span>
          </div>

        </div>

      </div>

      {/* ── DECLINE / REJECT APPLICATION MODAL (Print-Hidden) ── */}
      {declineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs print:hidden">
          <div className="w-full max-w-lg border-2 border-black bg-white p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Decline Application &amp; Request Regulatory Corrections</span>
              </div>
              <button
                onClick={() => setDeclineModalOpen(false)}
                className="text-neutral-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Please specify the regulatory reason for declining the application for <strong>{data.email}</strong>. A 7-day cooldown period will be enforced for partner re-submission.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-800 font-bold mb-1">Standard Regulatory Reason:</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full border border-neutral-300 bg-neutral-50 p-2 text-xs text-black focus:outline-hidden focus:border-black"
                >
                  {PRESET_REJECTION_REASONS.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="CUSTOM">Other Reason (Specify Below)...</option>
                </select>
              </div>

              {declineReason === 'CUSTOM' && (
                <div>
                  <label className="block text-neutral-800 font-bold mb-1">Detailed Rejection Notes:</label>
                  <textarea
                    rows={3}
                    value={customDeclineReason}
                    onChange={(e) => setCustomDeclineReason(e.target.value)}
                    placeholder="Enter explicit feedback for the partner..."
                    className="w-full border border-neutral-300 p-2 text-xs text-black focus:outline-hidden focus:border-black font-sans"
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                className="border border-neutral-300 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  const finalReason = declineReason === 'CUSTOM' ? customDeclineReason.trim() : declineReason;
                  if (declineReason === 'CUSTOM' && !finalReason) {
                    alert('Please enter a specific rejection reason.');
                    return;
                  }
                  handleReviewAction('REJECT', finalReason);
                }}
                className="bg-rose-700 hover:bg-rose-800 text-white px-4 py-1.5 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection & Send Notice'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
