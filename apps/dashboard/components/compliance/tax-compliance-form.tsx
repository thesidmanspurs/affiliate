'use client';

import { useState, useEffect, useMemo } from 'react';
import { Lock, AlertCircle, RefreshCw } from 'lucide-react';
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

export interface TaxDeclarationData {
  formType: string;
  taxClassification: 'UK_DOMESTIC' | 'INTERNATIONAL' | 'US_PERSON';
  legalName: string;
  businessType: string;
  taxId: string;
  taxResidenceCountry: string;
  vatRegistered: boolean;
  vatNumber?: string;
  companiesHouseCrn?: string;
  street: string;
  city: string;
  stateProv: string;
  postalCode: string;
  dateOfBirth?: string;
  signerCapacity: string;
  electronicSignature: string;
  taxCertAccepted: boolean;
}

interface TaxComplianceFormProps {
  initialData?: Partial<TaxDeclarationData>;
  onSave?: (data: TaxDeclarationData) => Promise<void> | void;
  onCancel?: () => void;
  isPending?: boolean;
  submitButtonLabel?: string;
  mode?: 'standalone' | 'embedded';
  // If embedded in a wizard like /onboarding:
  onChange?: (data: TaxDeclarationData) => void;
}

export function TaxComplianceForm({
  initialData,
  onSave,
  onCancel,
  isPending = false,
  submitButtonLabel = 'Save & Certify Statutory Tax Declaration',
  mode = 'standalone',
  onChange,
}: TaxComplianceFormProps) {
  // Global Geo Database via Internal /api/geo/countries-states API
  const [allCountries, setAllCountries] = useState<GeoCountryItem[]>(fallbackCountries as GeoCountryItem[]);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/geo/countries-states')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.ok && Array.isArray(data.countries)) {
          setAllCountries(data.countries);
        }
      })
      .catch((err) => console.error('Failed to load global countries dataset:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Form states pre-filled with initialData
  const [taxClassification, setTaxClassification] = useState<'UK_DOMESTIC' | 'INTERNATIONAL' | 'US_PERSON'>(
    initialData?.taxClassification || 'INTERNATIONAL'
  );
  const [legalName, setLegalName] = useState(initialData?.legalName || '');
  const [businessType, setBusinessType] = useState(initialData?.businessType || 'Individual / Sole Trader');
  const [taxId, setTaxId] = useState(initialData?.taxId || '');
  const [taxResidenceCountry, setTaxResidenceCountry] = useState(
    initialData?.taxResidenceCountry || (taxClassification === 'UK_DOMESTIC' ? 'United Kingdom' : 'Vietnam')
  );
  const [vatRegistered, setVatRegistered] = useState(Boolean(initialData?.vatRegistered));
  const [vatNumber, setVatNumber] = useState(initialData?.vatNumber || '');
  const [companiesHouseCrn, setCompaniesHouseCrn] = useState(initialData?.companiesHouseCrn || '');
  const [street, setStreet] = useState(initialData?.street || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [stateProv, setStateProv] = useState(initialData?.stateProv || '');
  const [postalCode, setPostalCode] = useState(initialData?.postalCode || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || '');
  const [signerCapacity, setSignerCapacity] = useState(
    initialData?.signerCapacity || 'Individual Beneficial Owner'
  );
  const [electronicSignature, setElectronicSignature] = useState(
    initialData?.electronicSignature || initialData?.legalName || ''
  );
  const [taxCertAccepted, setTaxCertAccepted] = useState(initialData?.taxCertAccepted ?? true);
  const [error, setError] = useState<string | null>(null);

  // Sync state upward if embedded
  useEffect(() => {
    if (onChange) {
      const formType =
        taxClassification === 'UK_DOMESTIC'
          ? 'HMRC-UK-RESIDENT'
          : taxClassification === 'US_PERSON'
          ? 'W-9'
          : 'W-8BEN';

      onChange({
        formType,
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
      });
    }
  }, [
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
    onChange,
  ]);

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

  const validate = (): boolean => {
    if (!legalName.trim()) {
      setError('Please enter your full legal name or registered corporate entity name.');
      return false;
    }
    if (!taxId.trim()) {
      setError(
        taxClassification === 'UK_DOMESTIC'
          ? 'Please enter your UK Unique Taxpayer Reference (UTR) or National Insurance Number (NINO).'
          : taxClassification === 'US_PERSON'
          ? 'Please provide your US Social Security Number (SSN) or Employer ID (EIN).'
          : 'Please provide your Tax Identification Number (TIN / National ID).'
      );
      return false;
    }
    if (!street.trim() || !city.trim() || !taxResidenceCountry.trim()) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formType =
      taxClassification === 'UK_DOMESTIC'
        ? 'HMRC-UK-RESIDENT'
        : taxClassification === 'US_PERSON'
        ? 'W-9'
        : 'W-8BEN';

    if (onSave) {
      onSave({
        formType,
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
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Crown Banner */}
      <div className="h-2 bg-black w-full" />

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

      {/* Error Alert Box */}
      {error && (
        <div className="border-l-4 border-rose-600 bg-rose-50 border border-rose-300 p-4 text-xs font-semibold text-rose-900 flex items-start gap-3 shadow-2xs font-sans">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <strong className="block text-xs uppercase tracking-wider font-extrabold">Regulatory Requirement Incomplete:</strong>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

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
            className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black outline-hidden focus:border-black cursor-pointer"
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
              placeholder="City (e.g. London, Ho Chi Minh City)"
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
              placeholder="Postcode (e.g. EC2N 4AG or 700000)"
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
            className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black outline-hidden focus:border-black cursor-pointer"
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
            id="tax-vatReg"
            checked={vatRegistered}
            onChange={(e) => setVatRegistered(e.target.checked)}
            className="mt-0.5 h-4 w-4 border-2 border-black rounded-none text-black focus:ring-0 cursor-pointer"
          />
          <label htmlFor="tax-vatReg" className="text-xs text-black font-semibold cursor-pointer">
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
            id="tax-taxCertAccepted"
            checked={taxCertAccepted}
            onChange={(e) => setTaxCertAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 border-2 border-black rounded-none text-black focus:ring-0 cursor-pointer"
          />
          <label htmlFor="tax-taxCertAccepted" className="text-xs text-black font-semibold cursor-pointer leading-relaxed">
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

      {/* Standalone Submit / Cancel Actions (for Settings page) */}
      {mode === 'standalone' && (
        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={isPending || !taxCertAccepted}
            className="border-2 border-black bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition cursor-pointer flex items-center gap-2 shadow-xs"
          >
            {isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>{submitButtonLabel}</span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="border border-neutral-300 bg-white text-neutral-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:border-black hover:text-black transition cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>
      )}
    </form>
  );
}
