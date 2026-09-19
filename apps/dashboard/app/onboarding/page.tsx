'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitOnboardingAction } from './actions';
import {
  ShieldCheck,
  Globe,
  FileText,
  Landmark,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  AlertCircle,
  CreditCard,
  Wallet,
  Building,
  Check,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import fallbackCountries from '@/lib/countries-states.json';
import { TaxComplianceForm } from '@/components/compliance/tax-compliance-form';
import { PayoutRailsForm } from '@/components/compliance/payout-rails-form';

export interface GeoStateItem {
  name: string;
  code: string;
}

export interface GeoCountryItem {
  name: string;
  iso2: string;
  iso3: string;
  states: GeoStateItem[];
}

const CHANNEL_OPTIONS = [
  'Content Creator / YouTube / TikTok / Podcast',
  'Tech Review & Software Comparison Blog',
  'Email Newsletter / Media Publisher',
  'SaaS & Developer Community (Discord / Reddit)',
  'Paid Search & Social Advertising (No TM Bidding)',
  'Agency / Consultant / Systems Integrator',
];

const REGION_OPTIONS = [
  'United Kingdom & Europe',
  'North America (US & Canada)',
  'Asia-Pacific (APAC)',
  'Latin America (LATAM)',
  'Middle East & Africa (MENA)',
  'Global / Worldwide',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Global Geo Database via Internal /api/geo/countries-states API
  const [allCountries, setAllCountries] = useState<GeoCountryItem[]>(fallbackCountries as GeoCountryItem[]);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setGeoLoading(true);
    fetch('/api/geo/countries-states')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.ok && Array.isArray(data.countries)) {
          setAllCountries(data.countries);
        }
      })
      .catch((err) => console.error('Failed to load global countries dataset:', err))
      .finally(() => {
        if (isMounted) setGeoLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Step 1: Promotional Strategy & Compliance
  const [companyName, setCompanyName] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [logoInputMode, setLogoInputMode] = useState<'upload' | 'url'>('upload');
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [channelTypes, setChannelTypes] = useState(['Content Creator / YouTube / TikTok / Podcast']);
  const [primaryUrl, setPrimaryUrl] = useState('');
  const [monthlyReach, setMonthlyReach] = useState('25,000 - 100,000');
  const [targetRegions, setTargetRegions] = useState(['United Kingdom & Europe', 'Global / Worldwide']);
  const [niche, setNiche] = useState('AI & Productivity Tools');
  const [promotionalStrategy, setPromotionalStrategy] = useState('');
  const [asaAccepted, setAsaAccepted] = useState(true);
  const [antiSpamAccepted, setAntiSpamAccepted] = useState(true);

  // Step 2: UK & International Tax Residency Declaration
  const [taxClassification, setTaxClassification] = useState<'UK_DOMESTIC' | 'INTERNATIONAL' | 'US_PERSON'>('UK_DOMESTIC');
  const [legalName, setLegalName] = useState('');
  const [businessType, setBusinessType] = useState('Individual / Sole Trader');
  const [taxId, setTaxId] = useState('');
  const [taxResidenceCountry, setTaxResidenceCountry] = useState('United Kingdom');
  const [vatRegistered, setVatRegistered] = useState(false);
  const [vatNumber, setVatNumber] = useState('');
  const [companiesHouseCrn, setCompaniesHouseCrn] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [signerCapacity, setSignerCapacity] = useState('Individual Beneficial Owner');
  const [electronicSignature, setElectronicSignature] = useState('');
  const [taxCertAccepted, setTaxCertAccepted] = useState(true);

  // Dynamically resolve full provinces / states for the selected country
  const currentStates = useMemo(() => {
    if (!taxResidenceCountry || allCountries.length === 0) return [];
    const matched = allCountries.find(
      (c) =>
        c.name.toLowerCase() === taxResidenceCountry.toLowerCase() ||
        c.iso2.toLowerCase() === taxResidenceCountry.toLowerCase() ||
        c.iso3.toLowerCase() === taxResidenceCountry.toLowerCase()
    );
    return matched?.states || [];
  }, [allCountries, taxResidenceCountry]);

  // Step 3: Payout Rails (Stripe-Supported Rails Only)
  const [payoutMethod, setPayoutMethod] = useState<'bank_account' | 'debit_card'>('bank_account');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumberOrIban, setAccountNumberOrIban] = useState('');
  const [swiftBic, setSwiftBic] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [currency, setCurrency] = useState('GBP');

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

  const toggleChannel = (item: string) => {
    if (channelTypes.includes(item)) {
      if (channelTypes.length > 1) {
        setChannelTypes(channelTypes.filter((c) => c !== item));
      }
    } else {
      setChannelTypes([...channelTypes, item]);
    }
  };

  const toggleRegion = (item: string) => {
    if (targetRegions.includes(item)) {
      if (targetRegions.length > 1) {
        setTargetRegions(targetRegions.filter((r) => r !== item));
      }
    } else {
      setTargetRegions([...targetRegions, item]);
    }
  };

  const processLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, SVG, WebP, or GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Brand logo file size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }
    setError(null);
    setLogoFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;
      if (file.type === 'image/svg+xml') {
        setCompanyLogoUrl(result);
        return;
      }
      // Dynamically optimize bitmap images to clean WebP/JPEG data URL with max 512px bound
      const img = new window.Image();
      img.onload = () => {
        const MAX_DIM = 512;
        let width = img.width;
        let height = img.height;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const compressed = canvas.toDataURL('image/webp', 0.88);
            setCompanyLogoUrl(compressed);
          } catch {
            setCompanyLogoUrl(result);
          }
        } else {
          setCompanyLogoUrl(result);
        }
      };
      img.onerror = () => {
        setCompanyLogoUrl(result);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleRemoveLogo = () => {
    setCompanyLogoUrl('');
    setLogoFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateStep1 = () => {
    if (!companyName.trim()) {
      setError('Please enter your Company, Brand, or Creator Name.');
      return false;
    }
    if (!primaryUrl.trim()) {
      setError('Please provide your primary promotional website, channel, or social URL.');
      return false;
    }
    if (promotionalStrategy.trim().length < 20) {
      setError('Please provide a brief description of your promotional methodology (minimum 20 characters).');
      return false;
    }
    if (!asaAccepted || !antiSpamAccepted) {
      setError('You must confirm compliance with UK ASA / CAP Code (#Ad disclosure) and brand safety covenants.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!legalName.trim()) {
      setError('Please enter your full legal name or registered corporate entity name.');
      return false;
    }
    if (!taxId.trim()) {
      setError(
        taxClassification === 'UK_DOMESTIC'
          ? 'Please enter your UK Unique Taxpayer Reference (UTR) or National Insurance Number (NINO).'
          : 'Please provide your Tax Identification Number (TIN / National ID).'
      );
      return false;
    }
    if (!street.trim() || !city.trim() || !country.trim()) {
      setError('Please provide your complete permanent registered tax address.');
      return false;
    }
    if (businessType.toLowerCase().includes('individual') && !dateOfBirth.trim()) {
      setError('Date of birth is mandatory for individuals under HMRC Digital Platform Regulations (SI 2023/1263).');
      return false;
    }
    if (vatRegistered && !vatNumber.trim()) {
      setError('Please enter your VAT Registration Number.');
      return false;
    }
    if (!electronicSignature.trim()) {
      setError('Please execute the declaration by typing your full legal signature.');
      return false;
    }
    if (!taxCertAccepted) {
      setError('You must accept the statutory truthfulness declaration under the UK Fraud Act 2006.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep3 = () => {
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

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitOnboarding = async () => {
    setLoading(true);
    setError(null);

    const formType =
      taxClassification === 'UK_DOMESTIC'
        ? 'HMRC-UK-RESIDENT'
        : taxClassification === 'US_PERSON'
        ? 'W-9'
        : 'W-8BEN';

    const payload = {
      promotional: {
        companyName,
        companyLogoUrl: companyLogoUrl || 'https://innotek.global/wp-content/uploads/2024/07/cropped-logo122-copy-1-192x192.png',
        channels: channelTypes,
        channelTypes,
        primaryUrl,
        channelUrl: primaryUrl,
        monthlyReach,
        targetRegions,
        audienceRegions: targetRegions,
        niche,
        promotionalStrategy,
        strategyNotes: promotionalStrategy,
        ftcComplianceAccepted: asaAccepted,
        antiSpamAccepted,
      },
      tax: {
        formType,
        taxForm: formType,
        taxClassification,
        legalName,
        businessType,
        taxId,
        utrOrNino: taxId,
        taxResidenceCountry,
        vatRegistered,
        vatNumber: vatRegistered ? vatNumber : undefined,
        companiesHouseCrn: companiesHouseCrn || undefined,
        address: {
          street,
          city,
          state: stateProv,
          zip: postalCode,
          postalCode,
          country,
        },
        dateOfBirth: dateOfBirth || undefined,
        signerCapacity,
        treatyBenefits: taxClassification === 'INTERNATIONAL',
        treatyCountry: taxClassification === 'INTERNATIONAL' ? taxResidenceCountry : undefined,
        treatyArticle: taxClassification === 'INTERNATIONAL' ? 'Article 12 (Royalties / Independent Personal Services)' : undefined,
        treatyWithholdingRate: '0%',
        certificationAccepted: taxCertAccepted,
        certifiedUnderPerjury: taxCertAccepted,
        electronicSignature,
        signedName: electronicSignature,
        signedAt: new Date().toISOString(),
      },
      payout: {
        method: payoutMethod,
        stripeRail: payoutMethod === 'bank_account' ? 'stripe_payouts_bank' : 'stripe_instant_payouts_card',
        beneficiaryName,
        accountName: beneficiaryName,
        bankName: payoutMethod === 'bank_account' ? bankName : undefined,
        accountNumberOrIban: payoutMethod === 'bank_account' ? accountNumberOrIban : undefined,
        accountNumber: payoutMethod === 'bank_account' ? accountNumberOrIban : undefined,
        swiftBic: payoutMethod === 'bank_account' ? swiftBic : undefined,
        routingOrSortCode: payoutMethod === 'bank_account' ? sortCode : undefined,
        sortCode: payoutMethod === 'bank_account' ? sortCode : undefined,
        cardNumberLast4: payoutMethod === 'debit_card' ? cardNumber.replace(/\s+/g, '').slice(-4) : undefined,
        cardBrand: payoutMethod === 'debit_card' ? cardBrand : undefined,
        cardExpiry: payoutMethod === 'debit_card' ? cardExpiry : undefined,
        currency,
      },
    };

    try {
      const res = await submitOnboardingAction(payload);
      if (!res.ok) {
        throw new Error(res.error || 'Failed to submit onboarding dossier.');
      }
      router.push('/overview');
    } catch (err: any) {
      console.error('Onboarding submission error:', err);
      setError(err.message || 'An error occurred during statutory submission.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#09090B] font-sans selection:bg-black selection:text-white flex flex-col justify-between">
      
      {/* ── TOP GOVERNMENT / OFFICIAL INSTITUTIONAL MASTHEAD ── */}
      <header className="border-b-2 border-black bg-white sticky top-0 z-30 shadow-2xs">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logos/innotek.png" alt="Innotek Global" className="h-7 w-auto object-contain" />
            <div className="h-5 w-px bg-neutral-300 hidden sm:block" />
            <span className="font-sans font-bold text-xs uppercase tracking-wider text-black hidden sm:inline-block">
              HMRC Regulatory Compliance Portal
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-sans">
            <div className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 px-2.5 py-1 font-mono text-[11px] text-neutral-800 font-bold">
              <Lock className="h-3 w-3 text-neutral-600" />
              <span>SI 2023/1263 VERIFIED</span>
            </div>
            <span className="text-neutral-500 hidden md:inline text-[11px]">Innotek Global Ltd (UK)</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER (GOVERNMENT STANDARD SHEET) ── */}
      <main className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-8 sm:py-10 flex-1">
        
        {/* STATUTORY PROGRESS STEPPER */}
        <div className="mb-6 bg-white border-2 border-black p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-neutral-500 block">
                STATUTORY ONBOARDING STEPPER &bull; STAGE {currentStep} OF 4
              </span>
              <h2 className="text-sm font-extrabold text-black font-sans uppercase tracking-tight mt-0.5">
                {currentStep === 1 && 'Stage 1: Marketing Channels & UK Advertising Standards (CAP Code)'}
                {currentStep === 2 && 'Stage 2: Statutory Tax Residency & Entity Declaration (HMRC SI 2023/1263)'}
                {currentStep === 3 && 'Stage 3: Remittance Beneficiary Rails & UK AML Verification'}
                {currentStep === 4 && 'Stage 4: Legal Review & Execution Under Penalties of the Fraud Act 2006'}
              </h2>
            </div>

            <span className="font-mono text-xs font-bold bg-neutral-100 px-2 py-0.5 border border-neutral-300 shrink-0 self-start sm:self-auto">
              {Math.round((currentStep / 4) * 100)}% COMPLETED
            </span>
          </div>

          {/* Progress Bar Grid */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 border transition-all ${
                  step <= currentStep
                    ? 'bg-black border-black'
                    : 'bg-neutral-200 border-neutral-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 border-l-4 border-rose-600 bg-rose-50 border border-rose-300 p-4 text-xs font-semibold text-rose-900 flex items-start gap-3 shadow-2xs font-sans">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <strong className="block text-xs uppercase tracking-wider font-extrabold">Regulatory Requirement Incomplete:</strong>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ── FORM CONTAINER SHEET ── */}
        <div className="bg-white border-2 border-black p-6 sm:p-10 shadow-md">
          
          {/* TOP BLACK CROWN BAR */}
          <div className="h-2 bg-black w-full mb-6" />

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 1: PROMOTIONAL CHANNELS & UK ADVERTISING STANDARDS
             ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 font-sans">
              <div className="border-b border-black pb-4">
                <div className="text-[11px] font-mono tracking-widest text-neutral-600 uppercase font-bold">
                  PART I &bull; COMMERCIAL ADVERTISING &amp; CHANNEL VERIFICATION
                </div>
                <h1 className="font-sans font-black text-xl sm:text-2xl text-black uppercase tracking-tight mt-1">
                  Affiliate Promotional Channels &amp; Media Assets
                </h1>
                <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                  Pursuant to the UK Advertising Standards Authority (ASA) CAP Code and global anti-fraud protocols, declare your primary promotional methods and verified media channels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Line 1. Brand / Company / Creator Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. TechInsights UK Ltd or Oliver Vance"
                    className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black placeholder-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-black uppercase tracking-wider">
                      Line 2. Brand Logo or Avatar (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setLogoInputMode(logoInputMode === 'upload' ? 'url' : 'upload');
                        setError(null);
                      }}
                      className="text-[10px] font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                    >
                      {logoInputMode === 'upload' ? 'Enter Image URL Instead' : 'Upload File from Device'}
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />

                  {companyLogoUrl ? (
                    <div className="border border-neutral-400 bg-neutral-50 p-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-10 w-10 shrink-0 border border-neutral-300 bg-white p-0.5 flex items-center justify-center overflow-hidden">
                          <img
                            src={companyLogoUrl}
                            alt="Logo preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-black truncate">
                            {logoFileName || (companyLogoUrl.startsWith('data:') ? 'Custom Brand Image' : companyLogoUrl)}
                          </p>
                          <span className="text-[10px] text-emerald-800 font-mono font-bold flex items-center gap-1">
                            <Check className="h-3 w-3 inline shrink-0" />
                            Image Loaded
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {logoInputMode === 'upload' && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[11px] font-bold px-2 py-1 border border-neutral-400 bg-white hover:bg-neutral-100 text-black cursor-pointer"
                          >
                            Replace
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="text-[11px] font-bold px-2 py-1 border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : logoInputMode === 'upload' ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingLogo(true);
                      }}
                      onDragLeave={() => setIsDraggingLogo(false)}
                      onDrop={handleLogoDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed p-2.5 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                        isDraggingLogo
                          ? 'border-black bg-neutral-100'
                          : 'border-neutral-400 bg-white hover:border-black hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-neutral-900 font-bold text-xs">
                        <Upload className="h-3.5 w-3.5 shrink-0" />
                        <span>Upload Logo from Device</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        Click to browse or drop PNG, JPG, WebP, SVG (max 5MB)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={companyLogoUrl}
                        onChange={(e) => {
                          setCompanyLogoUrl(e.target.value);
                          setLogoFileName('');
                        }}
                        placeholder="https://innotek.global/assets/brand-logo.png"
                        className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black placeholder-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  Line 3. Primary Media Distribution Channels (Select all that apply) <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CHANNEL_OPTIONS.map((opt) => {
                    const isChecked = channelTypes.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleChannel(opt)}
                        className={`text-left p-3 border text-xs font-sans transition flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'border-black bg-neutral-100 text-black font-bold'
                            : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
                        }`}
                      >
                        <span className="truncate pr-2">{opt}</span>
                        <div
                          className={`h-4 w-4 border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-black border-black text-white' : 'border-neutral-400 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Line 4. Primary Channel / Website URL <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="url"
                    value={primaryUrl}
                    onChange={(e) => setPrimaryUrl(e.target.value)}
                    placeholder="https://youtube.com/@techinsights or https://techinsights.co.uk"
                    className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black placeholder-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Line 5. Estimated Monthly Reach / Traffic
                  </label>
                  <select
                    value={monthlyReach}
                    onChange={(e) => setMonthlyReach(e.target.value)}
                    className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black outline-hidden focus:border-black"
                  >
                    <option value="Under 5,000">Under 5,000 active visitors / followers</option>
                    <option value="5,000 - 25,000">5,000 - 25,000 active visitors / followers</option>
                    <option value="25,000 - 100,000">25,000 - 100,000 active visitors / followers</option>
                    <option value="100,000 - 500,000">100,000 - 500,000 active visitors / followers</option>
                    <option value="500,000+">500,000+ active visitors / followers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  Line 6. Target Geographical Jurisdictions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {REGION_OPTIONS.map((reg) => {
                    const isChecked = targetRegions.includes(reg);
                    return (
                      <button
                        type="button"
                        key={reg}
                        onClick={() => toggleRegion(reg)}
                        className={`text-left p-2.5 border text-xs font-sans transition flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'border-black bg-neutral-100 text-black font-bold'
                            : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
                        }`}
                      >
                        <span className="truncate pr-1">{reg}</span>
                        <div
                          className={`h-3.5 w-3.5 border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-black border-black text-white' : 'border-neutral-400 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="h-2.5 w-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                  Line 7. Promotional Strategy &amp; Campaign Description <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={promotionalStrategy}
                  onChange={(e) => setPromotionalStrategy(e.target.value)}
                  placeholder="Describe your UK and international audience distribution strategy (e.g. YouTube tech video tutorials, B2B software comparison guides, UK tech newsletter distribution, or verified agency client recommendations)..."
                  className="w-full border border-neutral-400 bg-white p-3 text-xs font-sans text-black placeholder-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black leading-relaxed"
                />
              </div>

              {/* Statutory UK Advertising Undertaking (GOV.UK Callout Style) */}
              <div className="border-2 border-black bg-neutral-50 p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1.5 flex items-center justify-between">
                  <span>Line 8. Mandatory Statutory Advertising Covenants</span>
                  <span className="text-[10px] font-mono text-neutral-600">UK CAP CODE RULE 2.1</span>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="asa"
                    checked={asaAccepted}
                    onChange={(e) => setAsaAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 border-2 border-black rounded-none text-black focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="asa" className="text-xs text-neutral-900 leading-relaxed cursor-pointer font-sans">
                    <strong>UK ASA &amp; CAP Code (#Ad Disclosure) Covenant:</strong> I warrant that all commercial marketing communications will prominently and upfront disclose material affiliate relationships using clear labels (e.g. &ldquo;#Ad&rdquo;, &ldquo;Advertisement&rdquo;, or &ldquo;Paid Partnership&rdquo;) pursuant to Section 2 of the UK CAP Code and the Digital Markets, Competition and Consumers Act 2024.
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="antispam"
                    checked={antiSpamAccepted}
                    onChange={(e) => setAntiSpamAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 border-2 border-black rounded-none text-black focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="antispam" className="text-xs text-neutral-900 leading-relaxed cursor-pointer font-sans">
                    <strong>Brand Trademark Protection &amp; Anti-Spam (PECR) Covenant:</strong> I certify that I will NOT engage in unsolicited electronic spam (PECR/GDPR), cookie stuffing, or unauthorized pay-per-click trademark bidding on &ldquo;Innotek&rdquo; brand keywords.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 2: STATUTORY TAX RESIDENCY & ENTITY DECLARATION
             ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <TaxComplianceForm
              initialData={{
                taxClassification,
                legalName,
                businessType,
                taxId,
                taxResidenceCountry,
                vatRegistered,
                vatNumber,
                companiesHouseCrn,
                street,
                city,
                stateProv,
                postalCode,
                dateOfBirth,
                signerCapacity,
                electronicSignature,
                taxCertAccepted,
              }}
              mode="embedded"
              onChange={(data) => {
                setTaxClassification(data.taxClassification);
                setLegalName(data.legalName);
                setBusinessType(data.businessType);
                setTaxId(data.taxId);
                setTaxResidenceCountry(data.taxResidenceCountry);
                setCountry(data.taxResidenceCountry);
                setVatRegistered(data.vatRegistered);
                setVatNumber(data.vatNumber || '');
                setCompaniesHouseCrn(data.companiesHouseCrn || '');
                setStreet(data.street);
                setCity(data.city);
                setStateProv(data.stateProv);
                setPostalCode(data.postalCode);
                setDateOfBirth(data.dateOfBirth || '');
                setSignerCapacity(data.signerCapacity);
                setElectronicSignature(data.electronicSignature);
                setTaxCertAccepted(data.taxCertAccepted);
              }}
            />
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 3: REMITTANCE BENEFICIARY RAILS (STRIPE-SUPPORTED ONLY)
             ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <PayoutRailsForm
              initialData={{
                method: payoutMethod,
                beneficiaryName,
                bankName,
                accountNumberOrIban,
                sortCode,
                swiftBic,
                cardNumber,
                cardExpiry,
                currency,
              }}
              legalNameFallback={legalName}
              taxResidenceCountry={taxResidenceCountry}
              taxClassification={taxClassification}
              mode="embedded"
              onChange={(data) => {
                setPayoutMethod(data.method);
                setBeneficiaryName(data.beneficiaryName);
                setBankName(data.bankName || '');
                setAccountNumberOrIban(data.accountNumberOrIban || '');
                setSortCode(data.sortCode || '');
                setSwiftBic(data.swiftBic || '');
                setCardNumber(data.cardNumber || '');
                setCardExpiry(data.cardExpiry || '');
                setCurrency(data.currency);
              }}
            />
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 4: FINAL COMPLIANCE REVIEW & SUBMISSION
             ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-6 font-sans">
              <div className="border-b border-black pb-4">
                <div className="text-[11px] font-mono tracking-widest text-neutral-600 uppercase font-bold">
                  PART IV &bull; OFFICIAL COMPLIANCE DOSSIER AUDIT
                </div>
                <h1 className="font-sans font-black text-xl sm:text-2xl text-black uppercase tracking-tight mt-1">
                  Final Legal Review &amp; Statutory Seal
                </h1>
                <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                  Verify your declaration details below. Upon execution, a tamper-proof SHA-256 cryptographic audit record will be submitted to the Innotek Compliance Queue.
                </p>
              </div>

              {/* Summary Sections in Government Box Style */}
              <div className="space-y-4">
                
                {/* 1. Marketing Section */}
                <div className="border-2 border-black">
                  <div className="bg-black text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>1. Commercial Promotional Channels</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[10px] text-neutral-300 hover:text-white underline cursor-pointer"
                    >
                      Edit Section 1
                    </button>
                  </div>
                  <div className="p-3 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 divide-y sm:divide-y-0 divide-neutral-200">
                    <div>
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Brand / Creator Name:</span>
                      <div className="flex items-center gap-2 mt-1">
                        {companyLogoUrl && (
                          <div className="h-8 w-8 shrink-0 border border-neutral-300 bg-white p-0.5 flex items-center justify-center overflow-hidden">
                            <img
                              src={companyLogoUrl}
                              alt="Brand Logo"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        )}
                        <strong className="text-black text-sm">{companyName}</strong>
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Primary Promotional URL:</span>
                      <span className="font-mono font-bold text-blue-700 truncate block">{primaryUrl}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Media Formats:</span>
                      <span className="text-black">{channelTypes.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Audience Reach &amp; Covenants:</span>
                      <span className="text-emerald-800 font-bold">{monthlyReach} &bull; UK ASA / CAP Code #Ad Agreed</span>
                    </div>
                  </div>
                </div>

                {/* 2. Tax Section */}
                <div className="border-2 border-black">
                  <div className="bg-black text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>2. Statutory Tax Residency &amp; Identification</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-[10px] text-neutral-300 hover:text-white underline cursor-pointer"
                    >
                      Edit Section 2
                    </button>
                  </div>
                  <div className="p-3 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 divide-y sm:divide-y-0 divide-neutral-200">
                    <div>
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Legal Tax Name:</span>
                      <strong className="text-black text-sm">{legalName}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Tax Residence Jurisdiction:</span>
                      <strong className="text-black">{taxResidenceCountry} ({taxClassification})</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Tax Identification Number:</span>
                      <span className="font-mono font-bold text-black">{taxId}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">VAT &amp; Withholding Status:</span>
                      <span className="text-black font-semibold">
                        {vatRegistered ? `UK VAT (${vatNumber})` : 'Below VAT Threshold / Non-VAT'} &bull; 0% WHT
                      </span>
                    </div>
                    <div className="sm:col-span-2 pt-1">
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Permanent Address:</span>
                      <span className="text-black">{street}, {city}{stateProv ? `, ${stateProv}` : ''}, {postalCode}, {country}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Payout Section */}
                <div className="border-2 border-black">
                  <div className="bg-black text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>3. Remittance Beneficiary Destination</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-[10px] text-neutral-300 hover:text-white underline cursor-pointer"
                    >
                      Edit Section 3
                    </button>
                  </div>
                  <div className="p-3 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 divide-y sm:divide-y-0 divide-neutral-200">
                    <div>
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Beneficiary Name:</span>
                      <strong className="text-black text-sm">{beneficiaryName}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Stripe Settlement Rail:</span>
                      <strong className="text-black uppercase">
                        {payoutMethod === 'debit_card' ? 'Stripe Instant Payouts (Debit Card)' : 'Stripe Direct Bank Transfer'} ({currency})
                      </strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500 font-bold block uppercase text-[10px]">Routing / Destination Identifier:</span>
                      <span className="font-mono font-bold text-black break-all">
                        {payoutMethod === 'bank_account' && (
                          <span>
                            {bankName} &bull; {accountNumberOrIban}
                            {sortCode ? ` (Sort Code: ${sortCode})` : ''}
                            {swiftBic ? ` (SWIFT: ${swiftBic})` : ''}
                          </span>
                        )}
                        {payoutMethod === 'debit_card' && (
                          <span>
                            {cardBrand} ending in •••• {cardNumber.replace(/\s+/g, '').slice(-4)} (Exp: {cardExpiry}) &bull; Stripe Instant Rail
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Execution Notice */}
              <div className="border-2 border-black p-4 bg-neutral-50 flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold uppercase tracking-wider text-black block">
                    Statutory Non-Repudiation Attestation
                  </span>
                  <p className="text-neutral-700 leading-relaxed font-sans">
                    By clicking &ldquo;Execute &amp; Submit Official Statutory Declaration&rdquo;, your electronic signature <strong>&ldquo;{electronicSignature}&rdquo;</strong> will be cryptographically bound to this document with your client IP address and an immutable SHA-256 integrity hash pursuant to the UK <em>Electronic Communications Act 2000</em>.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ── ACTION FOOTER BUTTONS ── */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t-2 border-black">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="inline-flex items-center gap-1.5 border border-neutral-400 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 hover:text-black transition shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-7 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
              >
                <span>Continue to Stage {currentStep + 1}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitOnboarding}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3 text-xs font-extrabold uppercase tracking-wider transition shadow-md disabled:opacity-60 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>{loading ? 'Generating Cryptographic Audit Record…' : 'Execute & Submit Official Statutory Declaration'}</span>
              </button>
            )}
          </div>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-black bg-white py-4 text-center text-xs text-neutral-600 font-sans">
        Innotek Global Ltd &bull; UK Company No. 15829104 &bull; Registered in England &amp; Wales &bull; HMRC Compliance Protocol 2026
      </footer>

    </div>
  );
}
