'use client';

import React, { useState, useRef } from 'react';
import {
  Layers,
  Check,
  Copy,
  Info,
  ExternalLink,
  SlidersHorizontal,
  Upload,
  RefreshCw,
  Zap,
  Repeat,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  Code2,
  X,
  Settings2,
} from 'lucide-react';

export interface AdminProduct {
  id: string;
  productId: string;
  name: string;
  tagline: string;
  description?: string;
  category: string;
  defaultCommissionRate: number;
  commissionType: string;
  averageOrderValue: number;
  currency: string;
  websiteUrl: string;
  status: string;
  isActive: boolean;
  logoUrl?: string | null;
  logoSize?: number;
  apiKeyHash?: string;
  webhookSecret?: string;
  createdAt?: string;
}

const DEFAULT_LOGO_MAP: Record<string, string> = {
  moodscanr: '/logos/moodscanr.png',
  halalscanr: '/logos/halalscanr.png',
  fanscanr: '/logos/fanscanr.png',
  headshot: '/logos/headshot.png',
  talentscanr: '/logos/talentscanr.png',
  'voice-agent': '/logos/callscanr.png',
  aqiscanr: '/logos/aqiscanr.svg',
};

interface ProductListClientProps {
  initialProducts: AdminProduct[];
}

const INTEGRATION_CODE_SNIPPET = [
  '// Example: Recording a conversion using dynamic environment variable',
  "const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.innotek.io';",
  '',
  "await fetch(API_BASE + '/api/conversions', {",
  "  method: 'POST',",
  '  headers: {',
  "    'Content-Type': 'application/json',",
  "    'x-merchant-api-key': process.env.AFFILIATE_MERCHANT_API_KEY,",
  '  },',
  '  body: JSON.stringify({',
  '    eventId: stripeEvent.id, // Idempotency key',
  "    clickId: req.cookies['innotek_aff_ref'],",
  '    externalUserId: user.id,',
  '    orderId: order.id,',
  '    amount: 2900, // $29.00',
  "    currency: 'USD',",
  "    type: 'NEW_PURCHASE',",
  '  }),',
  '});',
].join('\n');

export default function ProductListClient({ initialProducts }: ProductListClientProps) {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Drawer Form State
  const [editRate, setEditRate] = useState<number>(20);
  const [editStatus, setEditStatus] = useState<boolean>(true);
  const [editType, setEditType] = useState<string>('recurring');
  const [editLogoUrl, setEditLogoUrl] = useState<string>('');
  const [editLogoSize, setEditLogoSize] = useState<number>(40);
  const [uploading, setUploading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (id: string, label: string = 'Merchant ID') => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast(`Copied ${label}: ${id.slice(0, 12)}...`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openEditModal = (p: AdminProduct) => {
    setSelectedProduct(p);
    setEditRate(Math.round(p.defaultCommissionRate * 100));
    setEditStatus(p.isActive);
    setEditType(p.commissionType || 'recurring');
    setEditLogoUrl(p.logoUrl || DEFAULT_LOGO_MAP[p.productId] || '/logos/innotek.png');
    setEditLogoSize(p.logoSize || 40);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'logos');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setEditLogoUrl(data.url);
      showToast('Product logo uploaded successfully!');
    } catch (err: any) {
      console.error('Logo upload error:', err);
      showToast(err.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;

    setSaving(true);
    try {
      const rateDecimal = Number((editRate / 100).toFixed(4));
      const res = await fetch(`http://localhost:4100/api/admin/products/${selectedProduct.productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: editStatus,
          defaultCommissionRate: rateDecimal,
          commissionType: editType,
          logoUrl: editLogoUrl,
          logoSize: editLogoSize,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to update product');
      }

      // Update local state
      setProducts((prev) =>
        prev.map((item) =>
          item.id === selectedProduct.id
            ? {
                ...item,
                isActive: editStatus,
                status: editStatus ? 'ACTIVE' : 'PAUSED',
                defaultCommissionRate: rateDecimal,
                commissionType: editType,
                logoUrl: editLogoUrl,
                logoSize: editLogoSize,
              }
            : item
        )
      );

      showToast(`Configuration for ${selectedProduct.name} saved successfully!`);
      setSelectedProduct(null);
    } catch (err: any) {
      console.error('Save product error:', err);
      showToast(err.message || 'Failed to save configuration, please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-[#09090B] font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-lg flex items-center gap-2.5 text-emerald-900 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1.5">
            <Layers className="h-4 w-4" />
            <span>Product Catalog &amp; Integration</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight">
            Products &amp; Merchant Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600">
            Configure commission tiers, upload product logos, customize display sizes, and manage active Innotek merchants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dev/docs"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-800 shadow-2xs hover:bg-neutral-50 transition cursor-pointer"
          >
            <Code2 className="h-4 w-4 text-neutral-600" />
            {/* <span>Developer Docs</span> */}
          </a>
          <button
            onClick={() => showToast('Onboard new merchant wizard will be available in the next release.')}
            className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-neutral-800 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Onboard New Product</span>
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="rounded-md border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-base font-bold text-[#09090B]">
              Active Product Merchants
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Active ({products.filter((p) => p.isActive).length})</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-neutral-400"></span>
                <span>Paused ({products.filter((p) => !p.isActive).length})</span>
              </span>
            </div>
          </div>
          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
            {products.length} products configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-semibold">
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Product Slug</th>
                <th className="py-3.5 px-4">Merchant ID</th>
                <th className="py-3.5 px-4">Commission</th>
                <th className="py-3.5 px-4">Type</th>
                {/* 1. Status: Strictly circle dot only, NO TEXT */}
                <th className="py-3.5 px-4 text-center w-20">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
                <th className="py-3.5 px-6 text-right">Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((p) => {
                const logoSrc = p.logoUrl || DEFAULT_LOGO_MAP[p.productId] || '/logos/innotek.png';
                const logoRenderSize = p.logoSize || 40;

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition">
                    {/* Product Brand & Logo */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          style={{ width: `${logoRenderSize}px`, height: `${logoRenderSize}px` }}
                          className="flex items-center justify-center shrink-0 overflow-hidden transition-all"
                        >
                          <img
                            src={logoSrc}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-[#09090B] text-sm block">{p.name}</span>
                          <p className="text-[11px] text-neutral-500">{p.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-4 px-4 font-mono font-bold text-[#09090B]">{p.productId}</td>

                    {/* 2. Merchant ID: Shortened with ... and copy button on hover */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 group relative">
                        <span
                          className="font-mono text-[12px] text-neutral-600 select-all cursor-help"
                          title={p.id}
                        >
                          {p.id.slice(0, 8)}...
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(p.id, 'Merchant ID')}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-neutral-200/80 text-neutral-500 hover:text-black transition cursor-pointer"
                          title="Copy full Merchant UUID"
                        >
                          {copiedId === p.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Commission Rate */}
                    <td className="py-4 px-4 font-extrabold text-emerald-700 font-mono text-sm">
                      {(p.defaultCommissionRate * 100).toFixed(0)}%
                    </td>

                    {/* 3. Type: Standardized SaaS Affiliate Badges */}
                    <td className="py-4 px-4">
                      {p.commissionType === 'per_sale' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                          <Zap className="h-3 w-3 text-amber-600" />
                          <span>One-Time Sale</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold text-blue-800">
                          <Repeat className="h-3 w-3 text-blue-600" />
                          <span>Recurring SaaS</span>
                        </span>
                      )}
                    </td>

                    {/* 1. Status: STRICTLY CIRCLE ONLY - NO TEXT */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {p.isActive ? (
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs ring-4 ring-emerald-500/20"
                            title="Active"
                          />
                        ) : (
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-400 shadow-xs ring-4 ring-neutral-200"
                            title="Paused"
                          />
                        )}
                      </div>
                    </td>

                    {/* 4. Action: Info / Configure Button (Full English) */}
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 hover:text-black transition shadow-2xs cursor-pointer"
                        title="View &amp; configure product settings"
                      >
                        <Settings2 className="h-3.5 w-3.5 text-neutral-600" />
                        <span>Configure</span>
                      </button>
                    </td>

                    {/* Destination Website */}
                    <td className="py-4 px-6 text-right">
                      <a
                        href={p.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-neutral-800 hover:text-black hover:underline"
                      >
                        <span>Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Code Snippet */}
      <div className="rounded-md border border-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-neutral-100 flex items-center justify-center text-black">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#09090B]">
                Product Integration SDK Example
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Each product backend authenticates with its unique <code>x-merchant-api-key</code> to record conversions with idempotency protection.
              </p>
            </div>
          </div>
          <a
            href="/dev/docs"
            className="text-xs text-blue-700 hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>View Full Integration Specs</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="rounded-md border border-neutral-200 bg-neutral-900 p-4 font-mono text-xs text-neutral-200 overflow-x-auto shadow-2xs">
          <pre>{INTEGRATION_CODE_SNIPPET}</pre>
        </div>
      </div>

      {/* 4. Product Detail & Configuration Modal (Full English, Styled like User Dossier Modal) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-md border border-neutral-300 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3.5">
                {/* Dynamic Logo Preview in Header */}
                <div
                  style={{ width: `${Math.min(editLogoSize, 56)}px`, height: `${Math.min(editLogoSize, 56)}px` }}
                  className="flex items-center justify-center overflow-hidden shrink-0 transition-all"
                >
                  <img
                    src={editLogoUrl || DEFAULT_LOGO_MAP[selectedProduct.productId] || '/logos/innotek.png'}
                    alt="Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg font-extrabold text-[#09090B]">
                      {selectedProduct.name}
                    </h3>
                    <span className="font-mono text-[11px] font-bold bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      Code: {selectedProduct.productId}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${
                        editStatus
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          editStatus ? 'bg-emerald-500' : 'bg-neutral-400'
                        }`}
                      />
                      <span>{editStatus ? 'Active' : 'Paused'}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-neutral-500">{selectedProduct.category}</p>
                    <a
                      href={selectedProduct.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-700 hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      <span>{selectedProduct.websiteUrl}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="rounded-md border border-neutral-200 p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
                title="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 text-xs sm:text-sm">
              
              {/* Section 1: General & Status Configuration */}
              <div className="rounded-md border border-neutral-200 bg-neutral-50/60 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display font-bold text-[#09090B]">
                    <SlidersHorizontal className="h-4 w-4 text-rose-600" />
                    <span>1. Status &amp; Commission Model</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 block">
                      Product Status
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditStatus(true)}
                        className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-bold border transition cursor-pointer ${
                          editStatus
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs'
                            : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span>Active</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditStatus(false)}
                        className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-bold border transition cursor-pointer ${
                          !editStatus
                            ? 'bg-neutral-200 border-neutral-400 text-neutral-900 shadow-2xs'
                            : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-neutral-400"></span>
                        <span>Paused</span>
                      </button>
                    </div>
                  </div>

                  {/* Commission Type Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 block">
                      Commission Type
                    </label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-2xs outline-none focus:border-black cursor-pointer"
                    >
                      <option value="recurring">Recurring SaaS (Monthly/Annual Subscription)</option>
                      <option value="per_sale">One-Time Sale (Per Transaction)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Commission Rate Configuration */}
              <div className="rounded-md border border-neutral-200 bg-neutral-50/60 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display font-bold text-[#09090B]">
                    <Repeat className="h-4 w-4 text-emerald-600" />
                    <span>2. Partner Commission Rate (%)</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-extrabold text-base text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                    <span>{editRate}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={5}
                      max={70}
                      step={1}
                      value={editRate}
                      onChange={(e) => setEditRate(Number(e.target.value))}
                      className="flex-1 accent-emerald-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
                    />
                    <div className="flex items-center gap-1 w-24">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={editRate}
                        onChange={(e) => setEditRate(Math.min(100, Math.max(1, Number(e.target.value))))}
                        className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-mono font-bold text-right outline-none focus:border-black"
                      />
                      <span className="text-xs font-bold text-neutral-500">%</span>
                    </div>
                  </div>

                  {/* Preset Rate Chips */}
                  <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
                    <span className="text-neutral-500 text-[11px]">Quick presets:</span>
                    {[10, 15, 20, 25, 30, 40, 50].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setEditRate(preset)}
                        className={`px-2 py-1 rounded border text-[11px] font-mono font-bold transition cursor-pointer ${
                          editRate === preset
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>

                  {/* Earnings Preview Helper */}
                  <div className="p-2.5 rounded bg-white border border-neutral-200 text-[11px] text-neutral-600 flex items-center justify-between">
                    <span>Estimated partner earnings on standard $29.00 order:</span>
                    <strong className="text-emerald-700 font-mono font-extrabold text-xs">
                      ${((29 * editRate) / 100).toFixed(2)} USD {editType === 'recurring' ? '/ cycle' : '/ sale'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Section 3: Product Logo & Visual Size */}
              <div className="rounded-md border border-neutral-200 bg-neutral-50/60 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display font-bold text-[#09090B]">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                    <span>3. Product Logo &amp; Display Sizing</span>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-500">
                    Storage: Local / GCP Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* Interactive Logo Preview Box */}
                  <div className="sm:col-span-1 flex flex-col items-center justify-center p-4 bg-white rounded-md border border-neutral-200 text-center space-y-2">
                    <div
                      style={{ width: `${editLogoSize}px`, height: `${editLogoSize}px` }}
                      className="flex items-center justify-center overflow-hidden transition-all"
                    >
                      <img
                        src={editLogoUrl || DEFAULT_LOGO_MAP[selectedProduct.productId] || '/logos/innotek.png'}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400">
                      Dimensions: {editLogoSize}px &times; {editLogoSize}px
                    </span>
                  </div>

                  {/* Logo Controls: Upload & Size Slider */}
                  <div className="sm:col-span-2 space-y-3.5">
                    {/* File Upload Button */}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50 transition shadow-2xs cursor-pointer"
                      >
                        {uploading ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin text-neutral-600" />
                            <span>Uploading image...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-3.5 w-3.5 text-neutral-600" />
                            <span>Upload New Logo (PNG, SVG, WebP)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Logo Size Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                        <span>Logo Display Size:</span>
                        <span className="font-mono text-neutral-900 font-bold">{editLogoSize}px</span>
                      </div>
                      <input
                        type="range"
                        min={24}
                        max={64}
                        step={2}
                        value={editLogoSize}
                        onChange={(e) => setEditLogoSize(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
                      />
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {[
                          { label: 'Compact', size: 32 },
                          { label: 'Standard', size: 40 },
                          { label: 'Medium', size: 48 },
                          { label: 'Large', size: 64 },
                        ].map((preset) => (
                          <button
                            key={preset.size}
                            type="button"
                            onClick={() => setEditLogoSize(preset.size)}
                            className={`px-2 py-0.5 rounded border text-[10px] font-medium transition cursor-pointer ${
                              editLogoSize === preset.size
                                ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                            }`}
                          >
                            {preset.label} ({preset.size}px)
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Technical & API Credentials */}
              <div className="rounded-md border border-neutral-200 bg-neutral-50/60 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display font-bold text-[#09090B]">
                    <Code2 className="h-4 w-4 text-neutral-700" />
                    <span>4. Technical Identifiers &amp; Integration Secrets</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 font-mono block text-[11px]">Merchant UUID:</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-neutral-900 font-medium select-all">
                        {selectedProduct.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedProduct.id, 'Merchant UUID')}
                        className="p-1 hover:bg-neutral-200 rounded text-neutral-500 hover:text-black cursor-pointer"
                        title="Copy Merchant UUID"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-neutral-500 font-mono block text-[11px]">Product Slug:</span>
                    <strong className="font-mono text-neutral-900 block mt-0.5">
                      {selectedProduct.productId}
                    </strong>
                  </div>

                  <div>
                    <span className="text-neutral-500 font-mono block text-[11px]">Webhook Secret Mask:</span>
                    <span className="font-mono text-neutral-600 text-[11px] block mt-0.5">
                      {selectedProduct.webhookSecret ? `${selectedProduct.webhookSecret.slice(0, 10)}****************` : 'whsec_***'}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-500 font-mono block text-[11px]">API Key Hash:</span>
                    <span className="font-mono text-neutral-600 text-[11px] block mt-0.5">
                      {selectedProduct.apiKeyHash ? `${selectedProduct.apiKeyHash.slice(0, 12)}...` : 'SHA256_ACTIVE'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-neutral-800 disabled:opacity-50 transition cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
