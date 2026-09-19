'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Check, AlertCircle, RefreshCw } from 'lucide-react';

export const CHANNEL_OPTIONS = [
  'Content Creator / YouTube / TikTok / Podcast',
  'Tech Review & Software Comparison Blog',
  'Email Newsletter / Media Publisher',
  'SaaS & Developer Community (Discord / Reddit)',
  'Paid Search & Social Advertising (No TM Bidding)',
  'Agency / Consultant / Systems Integrator',
];

export const REGION_OPTIONS = [
  'United Kingdom & Europe',
  'North America (US & Canada)',
  'Asia-Pacific (APAC)',
  'Latin America (LATAM)',
  'Middle East & Africa (MENA)',
  'Global / Worldwide',
];

export interface PromotionalProfileData {
  companyName: string;
  companyLogoUrl?: string;
  channelTypes: string[];
  channels?: string[];
  primaryUrl: string;
  monthlyReach: string;
  targetRegions: string[];
  niche?: string;
  promotionalStrategy: string;
  asaAccepted: boolean;
  antiSpamAccepted: boolean;
}

interface PromotionalProfileFormProps {
  initialData?: Partial<PromotionalProfileData>;
  legalNameFallback?: string;
  onSave?: (data: PromotionalProfileData) => Promise<void> | void;
  isPending?: boolean;
  submitButtonLabel?: string;
  mode?: 'standalone' | 'embedded';
  onChange?: (data: PromotionalProfileData) => void;
}

export function PromotionalProfileForm({
  initialData,
  legalNameFallback = '',
  onSave,
  isPending = false,
  submitButtonLabel = 'Save Partner Media Profile',
  mode = 'standalone',
  onChange,
}: PromotionalProfileFormProps) {
  const [companyName, setCompanyName] = useState(
    initialData?.companyName || legalNameFallback || ''
  );
  const [companyLogoUrl, setCompanyLogoUrl] = useState(initialData?.companyLogoUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [logoInputMode, setLogoInputMode] = useState<'upload' | 'url'>('upload');
  const [logoFileName, setLogoFileName] = useState<string>('');
  
  const [channelTypes, setChannelTypes] = useState<string[]>(
    initialData?.channelTypes || initialData?.channels || ['Content Creator / YouTube / TikTok / Podcast']
  );
  const [primaryUrl, setPrimaryUrl] = useState(initialData?.primaryUrl || '');
  const [monthlyReach, setMonthlyReach] = useState(initialData?.monthlyReach || '25,000 - 100,000');
  const [targetRegions, setTargetRegions] = useState<string[]>(
    initialData?.targetRegions || ['United Kingdom & Europe', 'Global / Worldwide']
  );
  const [niche, setNiche] = useState(initialData?.niche || 'AI & Productivity Tools');
  const [promotionalStrategy, setPromotionalStrategy] = useState(initialData?.promotionalStrategy || '');
  const [asaAccepted, setAsaAccepted] = useState(initialData?.asaAccepted ?? true);
  const [antiSpamAccepted, setAntiSpamAccepted] = useState(initialData?.antiSpamAccepted ?? true);
  const [error, setError] = useState<string | null>(null);

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

  // Sync state upward if embedded
  useEffect(() => {
    if (onChange) {
      onChange({
        companyName,
        companyLogoUrl,
        channelTypes,
        channels: channelTypes,
        primaryUrl,
        monthlyReach,
        targetRegions,
        niche,
        promotionalStrategy,
        asaAccepted,
        antiSpamAccepted,
      });
    }
  }, [
    companyName,
    companyLogoUrl,
    channelTypes,
    primaryUrl,
    monthlyReach,
    targetRegions,
    niche,
    promotionalStrategy,
    asaAccepted,
    antiSpamAccepted,
    onChange,
  ]);

  const validate = (): boolean => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (onSave) {
      onSave({
        companyName,
        companyLogoUrl,
        channelTypes,
        channels: channelTypes,
        primaryUrl,
        monthlyReach,
        targetRegions,
        niche,
        promotionalStrategy,
        asaAccepted,
        antiSpamAccepted,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Crown Banner */}
      <div className="h-2 bg-black w-full" />

      {/* Header */}
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

      {/* Error Alert Box */}
      {error && (
        <div className="border-l-4 border-rose-600 bg-rose-50 border border-rose-300 p-4 text-xs font-semibold text-rose-900 flex items-start gap-3 shadow-2xs font-sans">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <strong className="block text-xs uppercase tracking-wider font-extrabold">Promotional Profile Incomplete:</strong>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

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
            className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-sans text-black outline-hidden focus:border-black cursor-pointer"
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
            id="promo-asa"
            checked={asaAccepted}
            onChange={(e) => setAsaAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 border-2 border-black rounded-none text-black focus:ring-0 cursor-pointer"
          />
          <label htmlFor="promo-asa" className="text-xs text-neutral-900 leading-relaxed cursor-pointer font-sans">
            <strong>UK ASA &amp; CAP Code (#Ad Disclosure) Covenant:</strong> I warrant that all commercial marketing communications will prominently and upfront disclose material affiliate relationships using clear labels (e.g. &ldquo;#Ad&rdquo;, &ldquo;Advertisement&rdquo;, or &ldquo;Paid Partnership&rdquo;) pursuant to Section 2 of the UK CAP Code and the Digital Markets, Competition and Consumers Act 2024.
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="promo-antispam"
            checked={antiSpamAccepted}
            onChange={(e) => setAntiSpamAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 border-2 border-black rounded-none text-black focus:ring-0 cursor-pointer"
          />
          <label htmlFor="promo-antispam" className="text-xs text-neutral-900 leading-relaxed cursor-pointer font-sans">
            <strong>Brand Trademark Protection &amp; Anti-Spam (PECR) Covenant:</strong> I certify that I will NOT engage in unsolicited electronic spam (PECR/GDPR), cookie stuffing, or unauthorized pay-per-click trademark bidding on &ldquo;Innotek&rdquo; brand keywords.
          </label>
        </div>
      </div>

      {/* Standalone Submit Action */}
      {mode === 'standalone' && (
        <div className="pt-2 border-t border-neutral-200">
          <button
            type="submit"
            disabled={isPending || !asaAccepted || !antiSpamAccepted}
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
