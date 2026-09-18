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
    <div className="min-h-screen bg-[#E5E8EC] text-[#09090B] font-sans selection:bg-black selection:text-white flex flex-col justify-between">
      
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
            <div className="space-y-6 font-sans">
              <div className="border-b border-black pb-4">
                <div className="text-[11px] font-mono tracking-widest text-neutral-600 uppercase font-bold">
                  PART II &bull; HMRC STATUTORY TAX RESIDENCY DECLARATION
                </div>
                <h1 className="font-sans font-black text-xl sm:text-2xl text-black uppercase tracking-tight mt-1">
                  Tax Residency &amp; Legal Entity Identification
                </h1>
                <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                  Required under <em>The Platform Operators (Due Diligence and Reporting Requirements) Regulations 2023 (SI 2023/1263)</em> and the <em>UK Value Added Tax Act 1994</em>.
                </p>
              </div>

              {/* Tax Classification Selector */}
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                  Select Applicable Tax Jurisdiction Standard
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  <button
                    type="button"
                    onClick={() => {
                      setTaxClassification('UK_DOMESTIC');
                      setTaxResidenceCountry('United Kingdom');
                      setCountry('United Kingdom');
                    }}
                    className={`p-3.5 border-2 text-left transition cursor-pointer ${
                      taxClassification === 'UK_DOMESTIC'
                        ? 'border-black bg-neutral-100 text-black font-bold'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 block">HMRC Domestic</span>
                    <span className="font-black text-sm block mt-0.5">UK Resident Partner</span>
                    <span className="text-[11px] text-neutral-600 block mt-1 font-normal">
                      Individual Sole Trader, Freelancer, or UK Ltd Company paying tax in the UK.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTaxClassification('INTERNATIONAL');
                      if (taxResidenceCountry === 'United Kingdom') setTaxResidenceCountry('Vietnam');
                      if (country === 'United Kingdom') setCountry('Vietnam');
                    }}
                    className={`p-3.5 border-2 text-left transition cursor-pointer ${
                      taxClassification === 'INTERNATIONAL'
                        ? 'border-black bg-neutral-100 text-black font-bold'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 block">OECD / Foreign Tax</span>
                    <span className="font-black text-sm block mt-0.5">International (Non-UK)</span>
                    <span className="text-[11px] text-neutral-600 block mt-1 font-normal">
                      Partner residing outside the UK. 0% UK Withholding Tax applied under UK law.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTaxClassification('US_PERSON');
                      setTaxResidenceCountry('United States');
                      setCountry('United States');
                    }}
                    className={`p-3.5 border-2 text-left transition cursor-pointer ${
                      taxClassification === 'US_PERSON'
                        ? 'border-black bg-neutral-100 text-black font-bold'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 block">IRS Form W-9 Standard</span>
                    <span className="font-black text-sm block mt-0.5">US Person / Entity</span>
                    <span className="text-[11px] text-neutral-600 block mt-1 font-normal">
                      US Citizen, Resident Alien, or US Corporation with SSN / EIN.
                    </span>
                  </button>

                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Line 9. Full Legal Name of Individual or Entity <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="e.g. Oliver Vance or Apex Media UK Limited"
                    className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black placeholder-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Line 10. Legal Entity Classification
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black outline-hidden focus:border-black"
                  >
                    <option value="Individual / Sole Trader">Individual / Sole Trader / Freelancer</option>
                    <option value="Private Limited Company (Ltd)">Private Limited Company (Ltd)</option>
                    <option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Corporation">Corporation (C-Corp / S-Corp)</option>
                    <option value="Foreign Private Entity">Foreign Private Entity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Line 11. Tax Identification Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder={
                      taxClassification === 'UK_DOMESTIC'
                        ? 'e.g. UK UTR (10 digits) or NINO (e.g. QQ 12 34 56 A)'
                        : taxClassification === 'US_PERSON'
                        ? 'e.g. SSN or EIN (XX-XXXXXXX)'
                        : 'e.g. National Tax ID, Citizen ID, or Foreign TIN'
                    }
                    className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-mono text-black placeholder-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Line 12. Country of Primary Tax Residence <span className="text-rose-600">*</span>
                  </label>
                  {taxClassification === 'UK_DOMESTIC' ? (
                    <div className="flex items-center justify-between border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-sans text-neutral-800 font-bold">
                      <div className="flex items-center gap-2">
                        <span className="text-black">United Kingdom</span>
                        <span className="text-[10px] bg-neutral-200 text-neutral-800 font-mono px-1.5 py-0.5 rounded font-semibold">GB / HMRC</span>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono font-normal flex items-center gap-1">
                        <Lock className="h-3 w-3 text-neutral-400" />
                        <span>Fixed UK Domestic Standard</span>
                      </span>
                    </div>
                  ) : (
                    <select
                      value={taxResidenceCountry}
                      onChange={(e) => {
                        const selected = e.target.value;
                        setTaxResidenceCountry(selected);
                        setCountry(selected);
                        setStateProv('');
                      }}
                      className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black outline-hidden focus:border-black focus:ring-1 focus:ring-black font-bold cursor-pointer"
                    >
                      <optgroup label="Frequently Selected Jurisdictions">
                        <option value="Vietnam">Vietnam (VN)</option>
                        <option value="United States">United States (US)</option>
                        <option value="Germany">Germany (DE)</option>
                        <option value="France">France (FR)</option>
                        <option value="Canada">Canada (CA)</option>
                        <option value="Australia">Australia (AU)</option>
                        <option value="Singapore">Singapore (SG)</option>
                        <option value="Japan">Japan (JP)</option>
                        <option value="United Kingdom">United Kingdom (GB)</option>
                      </optgroup>
                      <optgroup label={`All Sovereign Nations & Territories (${allCountries.length})`}>
                        {allCountries.map((c) => (
                          <option key={c.iso2 || c.name} value={c.name}>
                            {c.name} ({c.iso2})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  )}
                  <span className="text-[10px] text-neutral-500 mt-1 block font-mono">
                    {taxClassification === 'UK_DOMESTIC'
                      ? 'Pre-set to United Kingdom for HMRC domestic compliance (Non-UK partners select International above).'
                      : `API verified: ${allCountries.length} sovereign nations & ${currentStates.length} statutory subdivisions loaded.`}
                  </span>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-3 pt-1 border-t border-neutral-200">
                <span className="text-xs font-bold text-black uppercase tracking-wider block">
                  Line 13. Permanent Registered Address (Do not use P.O. Box) <span className="text-rose-600">*</span>
                </span>
                
                <div>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street Address, Building, Suite (e.g. 100 Bishopsgate, Suite 4B)"
                    className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black placeholder-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City (e.g. London, Manchester, or Edinburgh)"
                      className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black placeholder-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    {currentStates.length > 0 ? (
                      <select
                        value={stateProv}
                        onChange={(e) => setStateProv(e.target.value)}
                        className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black outline-hidden focus:border-black focus:ring-1 focus:ring-black font-semibold cursor-pointer"
                      >
                        <option value="">
                          {taxResidenceCountry === 'United Kingdom'
                            ? `Select UK County / Region (${currentStates.length} available)...`
                            : `Select County / State / Province (${currentStates.length} available)...`}
                        </option>
                        {currentStates.map((s) => (
                          <option key={s.code ? `${s.code}-${s.name}` : s.name} value={s.name}>
                            {s.name} {s.code ? `(${s.code})` : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={stateProv}
                        onChange={(e) => setStateProv(e.target.value)}
                        placeholder={taxResidenceCountry === 'United Kingdom' ? 'County / Region' : 'County / State / Province'}
                        className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black placeholder-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                      />
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postcode (e.g. EC2N 4AG or SW1A 1AA)"
                      className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-mono text-black placeholder-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Line 14 & 15: Date of birth & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-neutral-200">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Line 14. Date of Birth (Mandatory under HMRC SI 2023/1263) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-mono text-black outline-hidden focus:border-black"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    Required by HMRC digital platform regulations for individual due diligence.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Line 15. Signer Legal Capacity <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={signerCapacity}
                    onChange={(e) => setSignerCapacity(e.target.value)}
                    className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black outline-hidden focus:border-black"
                  >
                    <option value="Individual Beneficial Owner">Individual Beneficial Owner (Self)</option>
                    <option value="Authorised Corporate Director">Authorised Corporate Director</option>
                    <option value="Legal Representative / Power of Attorney">Legal Representative / Power of Attorney</option>
                  </select>
                </div>
              </div>

              {/* Line 16: UK VAT & Self-Billing Options */}
              <div className="border border-black bg-neutral-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    Line 16. UK VAT &amp; Self-Billing Status (VATA 1994)
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-neutral-200 px-2 py-0.5">
                    0% UK WITHHOLDING TAX
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="vatReg"
                    checked={vatRegistered}
                    onChange={(e) => setVatRegistered(e.target.checked)}
                    className="mt-0.5 h-4 w-4 border-2 border-black rounded-none text-black focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="vatReg" className="text-xs text-black font-semibold cursor-pointer">
                    Entity is registered for UK VAT (or EU VIES VAT)
                  </label>
                </div>

                {vatRegistered && (
                  <div className="pl-7 space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-black uppercase tracking-wider block mb-1">
                        VAT Registration Number (e.g. GB123456789) <span className="text-rose-600">*</span>
                      </span>
                      <input
                        type="text"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        placeholder="GB123456789"
                        className="w-full max-w-sm border border-neutral-400 bg-white px-3 py-1.5 text-xs font-mono text-black uppercase font-bold"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-600">
                      Pursuant to HMRC VAT Notice 700/62, Innotek Global Ltd will operate a Self-Billing agreement to issue valid VAT invoices on your behalf.
                    </p>
                  </div>
                )}
              </div>

              {/* Statutory Criminal Warning (GOV.UK Inset Text) */}
              <div className="border-l-4 border-black bg-neutral-100 p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center justify-between">
                  <span>CRIMINAL LIABILITY NOTICE &bull; UK FRAUD ACT 2006</span>
                  <span className="font-mono text-[10px]">SECTION 2 (FRAUD BY FALSE REPRESENTATION)</span>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed font-sans">
                  I acknowledge that under Section 2 of the UK Fraud Act 2006, dishonestly providing false or misleading tax representations to obtain financial gain or evade taxation constitutes a criminal offence punishable by statutory penalties and imprisonment.
                </p>
              </div>

              {/* Electronic Signature Box */}
              <div className="border-2 border-black p-4 bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    Line 17. Electronic Signature &amp; Legal Execution
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                    UK ECA 2000 VALID
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="taxCertAccepted"
                    checked={taxCertAccepted}
                    onChange={(e) => setTaxCertAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 border-2 border-black rounded-none text-black focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="taxCertAccepted" className="text-xs text-black font-semibold cursor-pointer leading-relaxed">
                    I solemnly declare that the information provided in this tax residency declaration is true, complete, and accurate, and I agree to notify Innotek Global Ltd in writing within 30 days of any material change.
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Type Full Legal Name as Electronic Signature <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={electronicSignature}
                    onChange={(e) => setElectronicSignature(e.target.value)}
                    placeholder="Type full legal name to execute this statutory declaration (e.g. Oliver Vance)..."
                    className="w-full border-2 border-black bg-white px-3.5 py-2.5 text-sm font-mono text-black font-bold placeholder-neutral-400 outline-hidden"
                  />
                </div>

                {electronicSignature && (
                  <div className="border border-neutral-300 bg-neutral-50 p-3 text-center">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block">PREVIEW OF EXECUTED SIGNATURE:</span>
                    <span className="font-serif italic text-2xl font-black text-blue-950 py-1 inline-block">
                      {electronicSignature}
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 3: REMITTANCE BENEFICIARY RAILS (STRIPE-SUPPORTED ONLY)
             ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 font-sans">
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
                        placeholder="e.g. Barclays Bank UK, HSBC UK, NatWest, Lloyds Bank"
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
                        placeholder="e.g. 8-digit UK Account Number or GB29NWBK60161331926819"
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
                        placeholder="e.g. BARCGB22 (Barclays UK) or HBUKGB41 (HSBC UK)"
                        className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-mono text-black uppercase font-bold placeholder-neutral-400 outline-hidden focus:border-black"
                      />
                      <span className="text-[11px] text-neutral-500 mt-1 block">
                        Required for non-UK cross-border Stripe wire transfers.
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
                  className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black font-semibold outline-hidden focus:border-black"
                >
                  <option value="GBP">GBP (£) &ndash; British Pound Sterling (Default UK Statutory Settlement)</option>
                  <option value="USD">USD ($) &ndash; United States Dollar (Global Platform Currency)</option>
                  <option value="EUR">EUR (€) &ndash; Euro (Single Euro Payments Area - SEPA)</option>
                </select>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Stripe will automatically convert and disburse earnings in your chosen currency at live mid-market interbank exchange rates.
                </span>
              </div>
            </div>
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
