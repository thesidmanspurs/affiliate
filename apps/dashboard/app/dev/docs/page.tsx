'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Code2,
  Layers,
  Globe,
  Server,
  Key,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Search,
  Play,
  Box,
  Zap,
  FileCode,
  CheckCircle,
  RefreshCw,
  Hash,
  ArrowRight,
  Database,
  ExternalLink,
  Lock,
  Share2,
} from 'lucide-react';

interface ProductTechnicalProfile {
  slug: string;
  name: string;
  billingType: string;
  cookieDomain: string;
  webhookEvent: string;
  defaultCurrency: string;
  integrationType: string;
}

const INNOTEK_PRODUCTS: ProductTechnicalProfile[] = [
  {
    slug: 'moodscanr',
    name: 'MoodScanr AI',
    billingType: 'Subscription / Recurring',
    cookieDomain: '.moodscanr.ai',
    webhookEvent: 'subscription.created',
    defaultCurrency: 'USD',
    integrationType: 'Next.js + Stripe Billing',
  },
  {
    slug: 'halalscanr',
    name: 'HalalScanr',
    billingType: 'Recurring & Credit Pack',
    cookieDomain: '.halalscanr.innotek.global',
    webhookEvent: 'credit.purchased',
    defaultCurrency: 'USD',
    integrationType: 'Mobile API + Web App',
  },
  {
    slug: 'fanscanr',
    name: 'FanScanr Sports',
    billingType: 'Subscription / Recurring',
    cookieDomain: '.fanscanr.innotek.global',
    webhookEvent: 'subscription.created',
    defaultCurrency: 'USD',
    integrationType: 'Next.js App Router',
  },
  {
    slug: 'headshot',
    name: 'AI Headshot Pro',
    billingType: 'One-Time Credit Pack',
    cookieDomain: '.headshot.innotek.global',
    webhookEvent: 'package.completed',
    defaultCurrency: 'USD',
    integrationType: 'FastAPI / Python + Stripe',
  },
  {
    slug: 'talentscanr',
    name: 'TalentScanr',
    billingType: 'B2B Enterprise SaaS',
    cookieDomain: '.talentscanr.innotek.global',
    webhookEvent: 'seat.upgraded',
    defaultCurrency: 'USD',
    integrationType: 'NestJS Backend API',
  },
  {
    slug: 'voice-agent',
    name: 'Voice AI Gateway',
    billingType: 'Usage-Based Metered',
    cookieDomain: '.voice.innotek.global',
    webhookEvent: 'usage.threshold_reached',
    defaultCurrency: 'USD',
    integrationType: 'Go / Node Webhook',
  },
  {
    slug: 'aqiscanr',
    name: 'AQIScanr Environmental',
    billingType: 'API Key & Subscription',
    cookieDomain: '.aqiscanr.innotek.global',
    webhookEvent: 'apikey.provisioned',
    defaultCurrency: 'USD',
    integrationType: 'Next.js + Edge Functions',
  },
];

const SECTIONS = [
  { id: 'overview', title: '1. Affiliate Architecture & Gateway' },
  { id: 'products', title: '2. Product Registry & Affiliate Config' },
  { id: 'client-sdk', title: '3. Client-Side Tracking SDK' },
  { id: 'server-webhooks', title: '4. Affiliate Conversion Webhooks' },
  { id: 'simulator', title: '5. Affiliate Sandbox Simulator' },
  { id: 'errors', title: '6. Error Codes & Diagnostics' },
];

export default function DevDocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductTechnicalProfile>(INNOTEK_PRODUCTS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'sdk' | 'nextjs' | 'stripe' | 'python' | 'curl'>('sdk');

  // Interactive Simulator State (Deterministic initial values)
  const [simRefCode, setSimRefCode] = useState('TEST_AFF_9921');
  const [simOrderId, setSimOrderId] = useState('inv_prod_882941');
  const [simAmount, setSimAmount] = useState('49.00');
  const [simEventId, setSimEventId] = useState('evt_sim_9921_initial');
  const [simStatus, setSimStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  // Robust Smooth Scroll to Section Handler
  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(sectionId);
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // If near the bottom, automatically activate the last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 250) {
        setActiveSection('errors');
        return;
      }

      const scrollPosition = window.scrollY + 140;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedToast(true);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedToast(false);
    }, 2500);
  };

  const handleSimulate = () => {
    setSimStatus('testing');
    setSimEventId(`evt_sim_${Date.now()}`);
    setTimeout(() => {
      setSimStatus('success');
    }, 500);
  };

  const getEnvConfigText = () => {
    return `# ==============================================================================
# Innotek Affiliate SDK Configuration for [${selectedProduct.name}]
# Purpose: Affiliate Referral Attribution & Conversion Settlement Only
# ==============================================================================

# Core Affiliate API Gateway (URL supplied by Innotek Administrator)
NEXT_PUBLIC_AFFILIATE_API_URL=https://<AFFILIATE_API_GATEWAY_URL_PROVIDED_BY_ADMIN>

# Merchant Secret API Key (Confidential: Issued 1-to-1 by Innotek Admin)
# WARNING: Keep confidential. Never commit this key to public Git repositories.
INNOTEK_MERCHANT_API_KEY=<YOUR_MERCHANT_SECRET_KEY_PROVIDED_BY_ADMIN>

# Product Affiliate Technical Identifier
INNOTEK_PRODUCT_SLUG=${selectedProduct.slug}

# Cookie Domain Scope for Cross-Subdomain Affiliate Attribution
INNOTEK_COOKIE_DOMAIN=${selectedProduct.cookieDomain}
`;
  };

  const getDropInSdkCode = () => {
    return `/**
 * Innotek Affiliate SDK - Drop-in Integration Helper
 * Scope: Affiliate Tracking & Conversion Settlement Only
 * Product: ${selectedProduct.name} (${selectedProduct.slug})
 * Domain Scope: ${selectedProduct.cookieDomain}
 */

// Read Gateway Base URL from environment variable provided by Admin
const AFFILIATE_API_BASE = process.env.NEXT_PUBLIC_AFFILIATE_API_URL;

// -----------------------------------------------------------------------------
// 1. Client-Side: Inbound Referral Capture (?ref=CODE)
// -----------------------------------------------------------------------------
export function initAffiliateTracking(): void {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref') || urlParams.get('via');

  if (refCode) {
    const maxAge = 30 * 24 * 60 * 60; // 30-day affiliate attribution window
    const isProd = window.location.hostname.endsWith('innotek.global') || window.location.hostname.endsWith('innotek.io');
    const domainAttr = isProd ? '; domain=${selectedProduct.cookieDomain}' : '';

    document.cookie = \`innotek_aff_ref=\${encodeURIComponent(refCode)}; path=/; max-age=\${maxAge}; SameSite=Lax\${domainAttr}\`;
    console.info('[Innotek Affiliate] Referral code tracked:', refCode);
  }
}

export function getAffiliateClickId(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )innotek_aff_ref=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// -----------------------------------------------------------------------------
// 2. Server-Side: Report Affiliate Conversion upon Payment Settlement
// -----------------------------------------------------------------------------
export interface RecordConversionPayload {
  eventId: string;        // Idempotency Key (e.g. Stripe evt_... or invoice ID)
  clickId: string;        // Referral code/UUID retrieved from cookie or session metadata
  orderId: string;        // Product invoice/transaction ID
  amount: number;         // Gross settled amount in integer cents (e.g. 4900 = $49.00)
  currency?: string;      // ISO-4217 Currency (e.g. 'USD')
  externalUserId?: string;// Internal Product Customer UUID
  type?: 'NEW_PURCHASE' | 'RENEWAL';
}

export async function recordAffiliateConversion(payload: RecordConversionPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  const apiKey = process.env.INNOTEK_MERCHANT_API_KEY;
  if (!apiKey) {
    console.warn('[Innotek Affiliate] Missing INNOTEK_MERCHANT_API_KEY environment variable. Request key from Admin.');
    return { success: false, error: 'Missing Merchant API key from Admin' };
  }

  if (!AFFILIATE_API_BASE) {
    console.error('[Innotek Affiliate] Missing NEXT_PUBLIC_AFFILIATE_API_URL environment variable.');
    return { success: false, error: 'Missing Affiliate API Gateway URL from Admin' };
  }

  if (!payload.clickId) {
    return { success: false, error: 'No affiliate referral clickId provided' };
  }

  try {
    const response = await fetch(\`\${AFFILIATE_API_BASE}/api/conversions\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-merchant-api-key': apiKey,
      },
      body: JSON.stringify({
        eventId: payload.eventId,
        clickId: payload.clickId,
        orderId: payload.orderId,
        amount: payload.amount,
        currency: (payload.currency || '${selectedProduct.defaultCurrency}').toUpperCase(),
        externalUserId: payload.externalUserId,
        type: payload.type || 'NEW_PURCHASE',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Affiliate conversion recording failed');
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[Innotek Affiliate] Conversion webhook error:', err.message);
    return { success: false, error: err.message };
  }
}`;
  };

  const getNextJsCode = () => {
    return `// ==============================================================================
// Next.js App Router: Innotek Affiliate Referral Integration
// Product: ${selectedProduct.name}
// ==============================================================================

// 1. In app/layout.tsx (Client-side Referral Capture)
'use client';
import { useEffect } from 'react';
import { initAffiliateTracking } from '@/lib/innotek-affiliate';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Automatically detects ?ref=CODE from URL and stamps 30-day cookie
    initAffiliateTracking();
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// 2. In your Checkout Route (e.g. app/api/checkout/route.ts)
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function POST(req: Request) {
  const cookieStore = cookies();
  const affiliateRef = cookieStore.get('innotek_aff_ref')?.value || null;

  const session = await stripe.checkout.sessions.create({
    mode: '${selectedProduct.billingType.includes('Recurring') ? 'subscription' : 'payment'}',
    payment_method_types: ['card'],
    line_items: [{ price: 'price_XXXX', quantity: 1 }],
    success_url: 'https://${selectedProduct.slug}.innotek.global/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://${selectedProduct.slug}.innotek.global/pricing',
    metadata: {
      innotek_aff_ref: affiliateRef, // Injects affiliate referral code into checkout metadata
      productId: '${selectedProduct.slug}',
    },
  });

  return Response.json({ url: session.url });
}`;
  };

  const getStripeWebhookCode = () => {
    return `// ==============================================================================
// Stripe Webhook: Report Affiliate Conversion on Successful Checkout
// Product: ${selectedProduct.name}
// File: app/api/webhooks/stripe/route.ts
// ==============================================================================
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { recordAffiliateConversion } from '@/lib/innotek-affiliate';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return new Response(\`Webhook signature verification failed: \${err.message}\`, { status: 400 });
  }

  // Handle successful payment settlement
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const affiliateRef = session.metadata?.innotek_aff_ref;

    // Only dispatch if the customer was referred by an affiliate
    if (affiliateRef) {
      await recordAffiliateConversion({
        eventId: event.id, // Idempotency key (prevents double commissions)
        clickId: affiliateRef,
        orderId: session.id,
        amount: session.amount_total || 4900,
        currency: session.currency || '${selectedProduct.defaultCurrency}',
        externalUserId: (session.client_reference_id as string) || undefined,
        type: 'NEW_PURCHASE',
      });
    }
  }

  return Response.json({ received: true });
}`;
  };

  const getPythonCode = () => {
    return `# ==============================================================================
# Python (FastAPI): Affiliate Conversion Dispatcher
# Product: ${selectedProduct.name}
# ==============================================================================
import os
import requests
from fastapi import FastAPI, Request

app = FastAPI()

AFFILIATE_API_BASE = os.getenv("NEXT_PUBLIC_AFFILIATE_API_URL")
MERCHANT_API_KEY = os.getenv("INNOTEK_MERCHANT_API_KEY")

@app.post("/api/webhooks/stripe")
async def handle_stripe_webhook(request: Request):
    payload = await request.json()
    event_type = payload.get("type")

    if event_type == "checkout.session.completed":
        session = payload["data"]["object"]
        metadata = session.get("metadata", {})
        affiliate_ref = metadata.get("innotek_aff_ref")

        if affiliate_ref and MERCHANT_API_KEY and AFFILIATE_API_BASE:
            dispatch_body = {
                "eventId": payload.get("id"),
                "clickId": affiliate_ref,
                "orderId": session.get("id"),
                "amount": session.get("amount_total", 4900),
                "currency": session.get("currency", "${selectedProduct.defaultCurrency}").upper(),
                "type": "NEW_PURCHASE",
            }
            headers = {
                "Content-Type": "application/json",
                "x-merchant-api-key": MERCHANT_API_KEY,
            }
            try:
                requests.post(f"{AFFILIATE_API_BASE}/api/conversions", json=dispatch_body, headers=headers, timeout=5)
            except Exception as e:
                print(f"[Innotek Affiliate] Conversion dispatch error: {e}")

    return {"status": "received"}`;
  };

  const getCurlCode = () => {
    const amt = Math.round(parseFloat(simAmount || '49') * 100);
    return `# Test Affiliate Conversion Webhook via cURL
# Replace <AFFILIATE_GATEWAY_URL> and <KEY_PROVIDED_BY_ADMIN> with credentials issued by Admin
curl -X POST "https://<AFFILIATE_GATEWAY_URL_PROVIDED_BY_ADMIN>/api/conversions" \\
  -H "Content-Type: application/json" \\
  -H "x-merchant-api-key: <KEY_PROVIDED_BY_ADMIN>" \\
  -d '{
    "eventId": "evt_test_affiliate_1001",
    "clickId": "${simRefCode}",
    "orderId": "${simOrderId}",
    "amount": ${amt},
    "currency": "${selectedProduct.defaultCurrency}",
    "type": "NEW_PURCHASE"
  }'`;
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case 'sdk':
        return getDropInSdkCode();
      case 'nextjs':
        return getNextJsCode();
      case 'stripe':
        return getStripeWebhookCode();
      case 'python':
        return getPythonCode();
      case 'curl':
        return getCurlCode();
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans antialiased selection:bg-zinc-900 selection:text-white relative">
      {/* Fixed Toast Notification on Successful Copy */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-zinc-950 text-white border border-zinc-800 shadow-2xl text-xs font-mono animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-zinc-100">Copied successfully!</span>
        </div>
      )}

      {/* Top Black & White Documentation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logos/innotek.png"
                alt="Innotek Logo"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logos/innotek-logo.svg';
                }}
              />
              <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-zinc-950">
                Affiliate Developer Documentation
              </span>
            </Link>
            <span className="h-5 w-px bg-zinc-300 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-800 bg-zinc-100 px-2.5 py-0.5 rounded border border-zinc-200 shrink-0">
              <Share2 className="h-3.5 w-3.5 text-zinc-950" />
              Affiliate SDK v1.4.0
            </span>
          </div>

          {/* Quick Technical Search Bar */}
          <div className="hidden md:flex items-center relative flex-1 max-w-sm mx-4">
            <Search className="h-4 w-4 absolute left-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search affiliate SDK, cookies, webhooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-md border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-950 focus:bg-white transition"
            />
          </div>

          {/* Header Right Status Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-zinc-200 bg-zinc-50 text-xs font-mono text-zinc-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
              <span>Affiliate Specs &bull; Zero Secrets</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3-Column Layout: Left Sidebar (w-64), Center Docs Body (flex-1), Right TOC (w-56) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 py-8">
        
        {/* Left Column: Fixed Navigation Sidebar (Exactly w-64 / 256px) */}
        <aside className="w-64 shrink-0 hidden lg:block sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto pr-4 text-xs font-medium text-zinc-600 border-r border-zinc-200">
          <div className="pb-3 mb-3 border-b border-zinc-200">
            <span className="font-mono uppercase text-xs font-bold text-zinc-900 tracking-wider block mb-1">
              Affiliate Dev Guide
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Integration specifications for embedding Innotek Affiliate attribution into SaaS products.
            </p>
          </div>

          <nav className="space-y-1">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={(e) => scrollToSection(e, sec.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md transition cursor-pointer text-xs font-semibold ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950'
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-white shrink-0 ml-1.5" />}
                </a>
              );
            })}
          </nav>

          <div className="mt-6 pt-5 border-t border-zinc-200 space-y-3">
            <span className="font-mono uppercase text-xs font-bold text-zinc-900 tracking-wider block">
              Affiliate Credentials
            </span>
            <div className="space-y-2 text-xs text-zinc-600">
              <div className="p-2.5 rounded-md border border-zinc-200 bg-zinc-50 space-y-1">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-xs">
                  <Lock className="h-3.5 w-3.5 text-zinc-700 shrink-0" />
                  <span>Gateway Endpoint</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-800 break-words leading-relaxed">
                  Set via <code className="font-bold bg-white px-1 py-0.5 rounded border border-zinc-200 break-all text-[10px]">NEXT_PUBLIC_AFFILIATE_API_URL</code>
                </div>
              </div>
              <div className="p-2.5 rounded-md border border-zinc-200 bg-zinc-50 space-y-1">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-xs">
                  <Key className="h-3.5 w-3.5 text-zinc-700 shrink-0" />
                  <span>Merchant API Key</span>
                </div>
                <div className="text-[11px] text-zinc-600 leading-relaxed">
                  Issued 1-to-1 directly by Innotek Admin for affiliate tracking.
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Column: Documentation Body */}
        <main className="flex-1 min-w-0 max-w-4xl space-y-12 pb-48">
          
          {/* Breadcrumbs & Header */}
          <div className="space-y-3 pb-6 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <span>Innotek Tech Docs</span>
              <span>/</span>
              <span>Affiliate Integration</span>
              <span>/</span>
              <span className="text-zinc-950 font-bold">Affiliate SDK Playbook</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
              Innotek Affiliate Integration SDK Documentation
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              Official technical reference for developers embedding affiliate referral attribution (<code className="font-mono text-zinc-950 font-bold bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">?ref=CODE</code>), 30-day cross-subdomain cookie persistence, and server-side conversion webhook settlement into Innotek products.
            </p>
          </div>

          {/* Section 1: Affiliate Architecture & Attribution Lifecycle */}
          <section id="overview" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  1. Affiliate Architecture &amp; Attribution Lifecycle
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  End-to-end data flow: Inbound referral click &rarr; Checkout metadata &rarr; Affiliate ledger settlement
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed font-normal">
              The Innotek affiliate engine decouples referral capture from payment settlement. Client applications store incoming affiliate codes in first-party cross-subdomain cookies, and conversion records are dispatched server-to-server upon checkout settlement with idempotency verification.
            </p>

            {/* Architecture Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-md border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] font-bold text-zinc-900">
                  <span>STEP 1: CAPTURE</span>
                  <Globe className="h-4 w-4 text-zinc-800 shrink-0" />
                </div>
                <h3 className="font-bold text-zinc-950 text-sm">Inbound Attribution</h3>
                <p className="text-zinc-600 leading-relaxed text-xs">
                  User visits landing page with <code className="font-mono bg-white px-1 py-0.5 rounded border border-zinc-200">?ref=CODE</code>. The client SDK stores this into a 30-day cookie with <code className="font-mono bg-white px-1 py-0.5 rounded border border-zinc-200">SameSite=Lax</code>.
                </p>
              </div>

              <div className="p-4 rounded-md border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] font-bold text-zinc-900">
                  <span>STEP 2: PROPAGATE</span>
                  <Key className="h-4 w-4 text-zinc-800 shrink-0" />
                </div>
                <h3 className="font-bold text-zinc-950 text-sm">Checkout Metadata</h3>
                <p className="text-zinc-600 leading-relaxed text-xs">
                  During checkout session creation, the backend reads the cookie and embeds <code className="font-mono bg-white px-1 py-0.5 rounded border border-zinc-200">innotek_aff_ref</code> into payment processor metadata (e.g. Stripe).
                </p>
              </div>

              <div className="p-4 rounded-md border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] font-bold text-zinc-900">
                  <span>STEP 3: SETTLE</span>
                  <Zap className="h-4 w-4 text-zinc-800 shrink-0" />
                </div>
                <h3 className="font-bold text-zinc-950 text-sm">Affiliate Webhook</h3>
                <p className="text-zinc-600 leading-relaxed text-xs">
                  On invoice settlement, the product webhook calls <code className="font-mono bg-white px-1 py-0.5 rounded border border-zinc-200">POST /api/conversions</code>. Redis BullMQ queues the transaction into the affiliate ledger.
                </p>
              </div>
            </div>

            {/* Technical Specification Box */}
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 text-sm">
                <ShieldCheck className="h-4 w-4 text-zinc-900 shrink-0" />
                <span>Idempotency &amp; Attribution Integrity Standards</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-xs">
                All affiliate conversion dispatches must provide a unique <code className="font-mono text-zinc-900 font-semibold bg-white px-1.5 py-0.5 rounded border border-zinc-200">eventId</code> (such as the Stripe Event ID <code className="font-mono text-zinc-900 font-semibold">evt_...</code>). Duplicate webhook dispatches with the same <code className="font-mono text-zinc-900 font-semibold">eventId</code> return HTTP 200 with an idempotency acknowledgment, preventing double commission credits.
              </p>
            </div>
          </section>

          {/* Section 2: Product Registry & Affiliate Config */}
          <section id="products" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <Box className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  2. Product Registry &amp; Affiliate Config
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  Select your product to load affiliate slugs, cookie domain scopes, and integration parameters
                </span>
              </div>
            </div>

            {/* Strict Scope Notice Callout */}
            <div className="rounded-md border-l-4 border-zinc-950 bg-zinc-100/70 p-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 text-sm">
                <Lock className="h-4 w-4 text-zinc-950 shrink-0" />
                <span>Scope Notice: Affiliate Integration Only &bull; Zero Exposed Secrets</span>
              </div>
              <p className="text-zinc-700 leading-relaxed text-xs">
                This documentation is strictly for developers integrating <strong>Innotek Affiliate tracking and conversion settlement</strong>. It does not handle general application APIs. All <code className="font-mono text-zinc-950 font-bold bg-white px-1.5 py-0.5 rounded border border-zinc-200">INNOTEK_MERCHANT_API_KEY</code> secrets and target <code className="font-mono text-zinc-950 font-bold bg-white px-1.5 py-0.5 rounded border border-zinc-200">NEXT_PUBLIC_AFFILIATE_API_URL</code> endpoints are provisioned directly by Innotek Administrators. Never check keys into Git repositories.
              </p>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">
              Every Innotek product possesses a unique slug identifier and dedicated cookie domain scope for affiliate tracking. Select your product below to dynamically format integration snippets:
            </p>

            {/* Product Selector Buttons: Responsive 3-4 Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {INNOTEK_PRODUCTS.map((prod) => {
                const isSelected = selectedProduct.slug === prod.slug;
                return (
                  <button
                    key={prod.slug}
                    type="button"
                    onClick={() => setSelectedProduct(prod)}
                    className={`p-3 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900'
                    }`}
                  >
                    <div>
                      <span className={`text-[11px] font-mono block ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {prod.slug}
                      </span>
                      <strong className="font-display text-sm font-bold block mt-1 leading-snug">
                        {prod.name}
                      </strong>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-200/40 text-xs">
                      <span className={isSelected ? 'text-zinc-300' : 'text-zinc-500'}>
                        {prod.billingType}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Product Technical Profile Table */}
            <div className="rounded-md border border-zinc-200 overflow-hidden text-xs">
              <div className="bg-zinc-100 px-4 py-2.5 font-mono text-[11px] font-bold text-zinc-900 uppercase border-b border-zinc-200">
                Affiliate Metadata: {selectedProduct.name}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 bg-white">
                <div className="p-3.5 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-zinc-500 block">Affiliate Slug</span>
                  <span className="font-mono font-bold text-zinc-950 text-xs">{selectedProduct.slug}</span>
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-zinc-500 block">Cookie Domain Scope</span>
                  <span className="font-mono font-bold text-zinc-950 text-xs">{selectedProduct.cookieDomain}</span>
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-zinc-500 block">Billing Model</span>
                  <span className="font-medium text-zinc-950 text-xs">{selectedProduct.billingType}</span>
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-zinc-500 block">Conversion Trigger</span>
                  <span className="font-mono font-bold text-zinc-950 text-xs">{selectedProduct.webhookEvent}</span>
                </div>
              </div>
            </div>

            {/* Environment Variables Block: Icon-Only Copy in Top-Right Corner */}
            <div className="rounded-md border border-zinc-200 bg-zinc-950 p-4 space-y-2 relative">
              <div className="flex items-center justify-between pr-14">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-300 font-semibold">
                  <Terminal className="h-4 w-4 text-zinc-400" />
                  <span>.env Configuration Template for Affiliate SDK</span>
                </div>
              </div>

              {/* Icon-Only Copy Button at Top-Right Inside Code Frame */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                {copiedId === 'env_config' && (
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700 text-[11px] font-mono font-medium shadow-sm animate-in fade-in">
                    Copied successfully!
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleCopy(getEnvConfigText(), 'env_config')}
                  className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer border border-zinc-700/70"
                  aria-label="Copy .env template"
                  title="Copy to clipboard"
                >
                  {copiedId === 'env_config' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              <pre className="font-mono text-xs text-zinc-200 overflow-x-auto pt-2 leading-relaxed">
                {getEnvConfigText()}
              </pre>
            </div>
          </section>

          {/* Section 3: Client-Side Tracking SDK */}
          <section id="client-sdk" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  3. Client-Side Affiliate Tracking SDK
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  Capturing ?ref=... parameter and setting 30-day innotek_aff_ref cookie across subdomains
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">
              Create a helper file <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 text-xs font-bold text-zinc-900">lib/innotek-affiliate.ts</code> in your project. Call <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 text-xs font-bold text-zinc-900">initAffiliateTracking()</code> on your root application layout to automatically capture incoming referrals.
            </p>

            {/* Code Block with Framework Dropdown Selector + Icon-Only Copy Button Inside */}
            <div className="rounded-md border border-zinc-200 overflow-hidden">
              
              {/* Header Bar with Dropdown Selector */}
              <div className="bg-zinc-100 border-b border-zinc-200 px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileCode className="h-4 w-4 text-zinc-700 shrink-0" />
                  <span className="text-xs font-mono font-bold text-zinc-800 uppercase">Framework:</span>
                  
                  {/* Clean Dropdown Selection */}
                  <div className="relative">
                    <select
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value as any)}
                      className="appearance-none rounded-md border border-zinc-300 bg-white pl-3 pr-8 py-1.5 text-xs font-mono font-bold text-zinc-900 outline-none focus:border-zinc-950 shadow-2xs cursor-pointer hover:bg-zinc-50 transition"
                    >
                      <option value="sdk">lib/innotek-affiliate.ts (Drop-in SDK)</option>
                      <option value="nextjs">Next.js App Router Integration</option>
                      <option value="stripe">Stripe Webhook Settlement</option>
                      <option value="python">Python (FastAPI / Flask)</option>
                      <option value="curl">cURL CLI Test Command</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  </div>
                </div>

                <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline-block">
                  Select framework to view snippet
                </span>
              </div>

              {/* Code Pre Container: Icon-Only Copy Button in Top-Right Corner */}
              <div className="bg-zinc-950 p-4 pt-12 sm:pt-4 relative overflow-x-auto">
                
                {/* Icon-Only Copy Button at Top-Right Inside Code Frame */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  {copiedId === 'active_code' && (
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700 text-[11px] font-mono font-medium shadow-sm animate-in fade-in">
                      Copied successfully!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopy(getActiveCode(), 'active_code')}
                    className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer border border-zinc-700/70"
                    aria-label="Copy code"
                    title="Copy to clipboard"
                  >
                    {copiedId === 'active_code' ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <pre className="font-mono text-xs text-zinc-200 leading-relaxed pr-16">
                  {getActiveCode()}
                </pre>
              </div>
            </div>

            {/* Cookie Specification Table */}
            <div className="rounded-md border border-zinc-200 overflow-hidden text-xs">
              <div className="bg-zinc-100 px-4 py-2.5 font-mono text-[11px] font-bold text-zinc-900 uppercase border-b border-zinc-200">
                Affiliate Cookie Specification
              </div>
              <div className="divide-y divide-zinc-200 bg-white">
                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900">Cookie Name</span>
                  <span className="sm:col-span-3 font-mono text-zinc-800 font-semibold">innotek_aff_ref</span>
                </div>
                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900">TTL / Duration</span>
                  <span className="sm:col-span-3 text-zinc-700">30 Calendar Days (2,592,000 seconds)</span>
                </div>
                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900">Domain Scope</span>
                  <span className="sm:col-span-3 font-mono text-zinc-800">{selectedProduct.cookieDomain}</span>
                </div>
                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900">Security Flags</span>
                  <span className="sm:col-span-3 font-mono text-zinc-800">SameSite=Lax; Path=/; Secure (in production)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Server-to-Server Affiliate Webhooks */}
          <section id="server-webhooks" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <Server className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  4. Server-to-Server Affiliate Conversion Webhooks
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  Reporting successful purchases to the Innotek Affiliate Ledger upon payment settlement
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">
              When a referred user completes checkout, your backend or payment processor webhook calls the Innotek Affiliate API to credit the partner.
            </p>

            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-zinc-900">
                <span className="px-2 py-0.5 rounded bg-zinc-900 text-white text-xs">POST</span>
                <span>{'{NEXT_PUBLIC_AFFILIATE_API_URL}'}/api/conversions</span>
              </div>
              <div className="text-zinc-600 flex items-center gap-1.5 text-xs">
                <Lock className="h-3.5 w-3.5 text-zinc-700 shrink-0" />
                <span>Requires header <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-200 font-bold text-zinc-900">x-merchant-api-key: &lt;KEY_PROVIDED_BY_ADMIN&gt;</code></span>
              </div>
            </div>

            {/* Payload Schema Table */}
            <div className="rounded-md border border-zinc-200 overflow-hidden text-xs">
              <div className="bg-zinc-100 px-4 py-2.5 font-mono text-[11px] font-bold text-zinc-900 uppercase border-b border-zinc-200">
                Affiliate Conversion Payload Parameters
              </div>
              <div className="divide-y divide-zinc-200 bg-white">
                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="font-mono font-bold text-zinc-950">eventId</span>
                    <span className="block text-[10px] font-mono text-zinc-500">string (required)</span>
                  </div>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    Idempotency key. Provide the payment processor event ID (e.g. <code className="font-mono text-zinc-900 font-bold">evt_3Msw2...</code>) or unique invoice ID. Prevents double crediting.
                  </div>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="font-mono font-bold text-zinc-950">clickId</span>
                    <span className="block text-[10px] font-mono text-zinc-500">string (required)</span>
                  </div>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    The affiliate referral code or click UUID captured from <code className="font-mono text-zinc-900 font-bold">innotek_aff_ref</code> cookie or checkout metadata.
                  </div>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="font-mono font-bold text-zinc-950">orderId</span>
                    <span className="block text-[10px] font-mono text-zinc-500">string (required)</span>
                  </div>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    Internal product invoice or transaction order identifier.
                  </div>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="font-mono font-bold text-zinc-950">amount</span>
                    <span className="block text-[10px] font-mono text-zinc-500">number (required)</span>
                  </div>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    Total gross settled revenue in integer cents (e.g. <code className="font-mono text-zinc-900 font-bold">4900</code> = $49.00 USD).
                  </div>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="font-mono font-bold text-zinc-950">currency</span>
                    <span className="block text-[10px] font-mono text-zinc-500">string (optional)</span>
                  </div>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    3-letter ISO-4217 currency code (e.g. <code className="font-mono text-zinc-900">USD</code>, <code className="font-mono text-zinc-900">GBP</code>, <code className="font-mono text-zinc-900">EUR</code>). Default: <code className="font-mono text-zinc-900 font-bold">USD</code>.
                  </div>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="font-mono font-bold text-zinc-950">type</span>
                    <span className="block text-[10px] font-mono text-zinc-500">string (optional)</span>
                  </div>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    Attribution category: <code className="font-mono text-zinc-900 font-bold">NEW_PURCHASE</code> or <code className="font-mono text-zinc-900 font-bold">RENEWAL</code>.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Attribution Sandbox Simulator */}
          <section id="simulator" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <Play className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  5. Affiliate Sandbox Simulator
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  Interactive testing widget to simulate affiliate conversion dispatches and verify JSON payloads
                </span>
              </div>
            </div>

            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-display font-bold text-sm text-zinc-950">
                  Affiliate Webhook Dispatch Tester
                </div>
                <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-zinc-200 text-zinc-700 font-bold">
                  Product: {selectedProduct.slug}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-700 font-medium mb-1 uppercase tracking-wider text-[10px]">Referral Code (clickId):</label>
                  <input
                    type="text"
                    value={simRefCode}
                    onChange={(e) => setSimRefCode(e.target.value.toUpperCase())}
                    className="w-full rounded border border-zinc-300 bg-white px-3 py-1.5 font-mono text-xs font-bold text-zinc-900 outline-none focus:border-zinc-950 transition"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-medium mb-1 uppercase tracking-wider text-[10px]">Order / Invoice ID:</label>
                  <input
                    type="text"
                    value={simOrderId}
                    onChange={(e) => setSimOrderId(e.target.value)}
                    className="w-full rounded border border-zinc-300 bg-white px-3 py-1.5 font-mono text-xs text-zinc-900 outline-none focus:border-zinc-950 transition"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-medium mb-1 uppercase tracking-wider text-[10px]">Gross Amount (USD):</label>
                  <input
                    type="number"
                    value={simAmount}
                    onChange={(e) => setSimAmount(e.target.value)}
                    className="w-full rounded border border-zinc-300 bg-white px-3 py-1.5 font-mono text-xs font-bold text-zinc-900 outline-none focus:border-zinc-950 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleSimulate}
                  disabled={simStatus === 'testing'}
                  className="px-4 py-2 rounded bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  {simStatus === 'testing' ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Validating Payload...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Simulate Affiliate Event</span>
                    </>
                  )}
                </button>

                {simStatus === 'success' && (
                  <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>HTTP 200 OK &bull; Mock Affiliate Conversion Validated</span>
                  </span>
                )}
              </div>

              {/* Simulated Output Preview */}
              <div className="rounded bg-zinc-950 p-3.5 font-mono text-xs text-zinc-200 overflow-x-auto space-y-1">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Simulated Request Details (Zero Secret Exposed):</div>
                <pre className="leading-relaxed">
{JSON.stringify(
  {
    targetEndpoint: "{NEXT_PUBLIC_AFFILIATE_API_URL}/api/conversions",
    headers: {
      "Content-Type": "application/json",
      "x-merchant-api-key": "[SECRET_KEY_PROVIDED_BY_ADMIN]",
    },
    payload: {
      eventId: simEventId,
      clickId: simRefCode || 'TEST_AFF_9921',
      orderId: simOrderId || 'inv_prod_882941',
      amount: Math.round(parseFloat(simAmount || '49') * 100),
      currency: selectedProduct.defaultCurrency,
      productSlug: selectedProduct.slug,
      type: 'NEW_PURCHASE',
    }
  },
  null,
  2
)}
                </pre>
              </div>
            </div>
          </section>

          {/* Section 6: Error Codes & Diagnostics */}
          <section id="errors" className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white shrink-0">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
                  6. Error Codes &amp; Diagnostics
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  HTTP status codes and resolution procedures for affiliate conversion recording
                </span>
              </div>
            </div>

            <div className="rounded-md border border-zinc-200 overflow-hidden text-xs">
              <div className="bg-zinc-100 px-4 py-2.5 font-mono text-[11px] font-bold text-zinc-900 uppercase border-b border-zinc-200">
                Affiliate Webhook Response Specifications
              </div>
              <div className="divide-y divide-zinc-200 bg-white">
                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-emerald-700 text-xs">201 Created</span>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    Affiliate conversion accepted and queued for ledger settlement. Returns transaction UUID and ledger reference.
                  </div>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900 text-xs">200 OK (Idempotent)</span>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    The <code className="font-mono text-zinc-900 font-bold">eventId</code> has already been recorded. No duplicate ledger entry was created. Safe to treat as success in webhooks.
                  </div>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900 text-xs">400 Bad Request</span>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    Missing required fields (<code className="font-mono text-zinc-900 font-bold">clickId</code>, <code className="font-mono text-zinc-900 font-bold">eventId</code>, <code className="font-mono text-zinc-900 font-bold">amount</code>), or amount is not a valid integer.
                  </div>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900 text-xs">401 Unauthorized</span>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    The header <code className="font-mono text-zinc-900 font-bold">x-merchant-api-key</code> is missing or does not match any active Innotek product secret issued by Admin.
                  </div>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-mono font-bold text-zinc-900 text-xs">422 Unprocessable</span>
                  <div className="sm:col-span-3 text-zinc-700 leading-relaxed">
                    The target merchant or affiliate profile is currently suspended or inactive.
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Right Column: "On this page" TOC (Fixed w-56 / 224px) */}
        <aside className="w-56 shrink-0 hidden xl:block sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto pl-4 text-xs">
          <span className="font-mono uppercase text-xs font-bold text-zinc-900 tracking-wider block mb-3">
            On this page
          </span>
          <nav className="space-y-2 border-l border-zinc-200 pl-3 text-zinc-500 font-medium">
            {SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => scrollToSection(e, sec.id)}
                className={`block transition cursor-pointer text-xs leading-snug hover:text-zinc-950 ${
                  activeSection === sec.id ? 'text-zinc-950 font-bold' : ''
                }`}
              >
                {sec.title}
              </a>
            ))}
          </nav>
        </aside>

      </div>
    </div>
  );
}
