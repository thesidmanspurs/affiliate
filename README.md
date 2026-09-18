# Innotek Affiliate Network — Enterprise Partner Ecosystem

> The world's leading domain-specific AI software partnership and recurring affiliate attribution engine. Powered by NestJS Hexagonal Core, Next.js 15 App Router, and S2S Postback Telemetry.

---

## 🚀 Overview

**Innotek Affiliate Network** is an enterprise-grade partner ecosystem platform purpose-built for AI and B2B SaaS applications. It unifies tracking, first-party cookie attribution, multi-tier recurring commissions, 14-day clearance hold protection, and automated NET-15 monthly settlements across **7 proprietary AI software tools**:

1. **MoodScanr AI** — Autonomous Video Emotion Intelligence & Comment Polarity Mapping
2. **Headshoot AI** — Studio-Grade Executive AI Corporate Portraits & Headshots
3. **HalalScanr** — Dietary E-Number & Ingredient OCR Compliance Scanner
4. **FanScanr Sports** — Matchday Social Sentiment & Squad Pulse Intelligence
5. **TalentScanr AI** — Semantic CV Vector Matching & Blind ATS Screening Engine
6. **CallScanr Voice** — Sub-300ms Conversational Voice AI Telephony & Receptionist
7. **AQIScanr AI** — Hyperlocal Air Quality Forecasts & Microclimate Telemetry

---

## 🏛️ System Architecture

The platform is designed as a modular monorepo separating the immutable financial ledger and core business logic from the multi-role user interfaces:

```
affiliate-platform/
├── apps/
│   ├── affiliate-core/     # NestJS 10 (Hexagonal Core: Domain / Application / Infrastructure)
│   │   ├── src/
│   │   │   ├── domain/     # Pure entities, ports, pure business rules (zero external deps)
│   │   │   ├── application/# Use-cases (Attribution, Conversions, Ledger, Payouts)
│   │   │   ├── infrastructure/ # Prisma ORM, PostgreSQL adapter, JWT & API Key Guards
│   │   │   └── api/        # REST Controllers, Swagger OpenAPI schema, Webhook handlers
│   │   └── prisma/         # PostgreSQL schema & database migration history
│   │
│   └── dashboard/          # Next.js 15 App Router (Full Partner & Admin Experience)
│       ├── app/
│       │   ├── (public)/   # Public Landing Page, About Us, FAQ, Legal Compliance
│       │   ├── (auth)/     # Partner Registration & Authentication Workflows
│       │   ├── (portal)/   # Authenticated Affiliate Portal (Home, Rewards, Marketplace)
│       │   ├── admin/      # Admin Analytics, Product Catalog, User Compliance Dossier
│       │   ├── partner/    # Comprehensive Integration & Partner Documentation Hub
│       │   └── dev/        # Developer SDK & Server-to-Server Postback API Docs
│       └── components/     # High-impact PartnerStack UI components & Interactive Simulator
│
├── docs/                   # Full Technical Architecture & API Specifications
├── examples/               # End-to-end integration snippets for merchant applications
└── infra/                  # Docker Compose & local infrastructure configuration
```

---

## ✨ Key Capabilities

### 1. Dual-Tier Attribution & Tracking Engine
- **60-Day First-Party Domain Cookie**: Attribution window remains locked even if referrals convert weeks later.
- **S2S (Server-to-Server) Webhook Postbacks**: Resilient conversion tracking bypassing ad-blockers and privacy sandboxes.
- **Sub-ID Telemetry**: Allows publishers and media buyers to track custom traffic sources, campaigns, and creative variations (`&subId=youtube_review`).

### 2. Automated Financial Ledger & Margin Buffer
- **14-Day Automated Clearance Buffer**: Holds referral commissions in a secure clearance buffer before final approval to mitigate chargebacks, refunds, and fraudulent activity.
- **Append-Only Ledger**: Financial transactions are strictly immutable; every state transition (Pending $\to$ Approved $\to$ Cleared $\to$ Paid) is recorded with audit logs.
- **NET-15 Settlement Engine**: Consolidated monthly disbursements via Direct Bank Wire (UK Faster Payments), PayPal, Wise, and USDT.

### 3. Tiered Commission Structure
- **Starter Tier (20%)**: 0 – 15 monthly active referrals, standard creative kits, unified portal access.
- **Pro Tier (25%)**: 16 – 50 monthly active referrals, custom audience promo codes, priority settlement.
- **Enterprise Tier (30%)**: 50+ monthly active referrals, lifetime recurring commission, custom webhook rails.

### 4. Interactive Simulator & Live Demonstration
- An interactive, simulated partner dashboard on the public landing page with zero latency, showcasing real-time referral link generation, telemetry events, and earnings ledger updates.

### 5. Multi-Tenant Administration & Compliance
- **Compliance Dossier**: Verify affiliate registration data, tax forms (W-8BEN / W-9), and channel verification.
- **UK ASA & US FTC Compliance**: Embedded legal operating agreement and mandatory promotional disclosure guidelines.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, KaTeX |
| **Backend Core** | NestJS 10, TypeScript 5, Hexagonal / Clean Architecture |
| **Database & ORM** | PostgreSQL 14+, Prisma ORM, TypeORM |
| **Authentication** | Two-Layer Dual Auth: Isolated Affiliate JWTs + Merchant API Key Guards |
| **Telemetry & Cache** | Redis 7, In-Memory Event Streaming |
| **Documentation** | Swagger / OpenAPI 3.0, Interactive Markdown Hubs |

---

## 🏁 Quick Start & Local Setup

### Prerequisites
- **Node.js**: >= 18.x (v20+ recommended)
- **PostgreSQL**: >= 14
- **npm** or **yarn** or **pnpm**

---

### Step 1: Clone Repository

```bash
git clone https://github.com/thesidmanspurs/affiliate.git
cd affiliate
```

---

### Step 2: Configure & Start Core Backend (`affiliate-core`)

```bash
cd apps/affiliate-core

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT secrets:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/affiliate_db?schema=public"
# AFFILIATE_JWT_SECRET="your-secure-jwt-secret"

# 3. Apply Prisma database migrations
npx prisma migrate dev --name init

# 4. Launch backend service (Runs on http://localhost:4100)
npm run start:dev
```

> **Swagger API Explorer**: Once running, access the interactive OpenAPI docs at:  
> `http://localhost:4100/api/docs`

---

### Step 3: Configure & Start Frontend Dashboard (`dashboard`)

```bash
cd ../dashboard

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4100/api

# 3. Launch dashboard service (Runs on http://localhost:3100)
npm run dev
```

Open `http://localhost:3100` in your browser to explore:
- **Public Landing Page**: `http://localhost:3100/`
- **Partner Documentation**: `http://localhost:3100/partner/docs`
- **Developer SDK Guide**: `http://localhost:3100/dev/docs`
- **Affiliate Portal**: `http://localhost:3100/overview`
- **Commission Tiers**: `http://localhost:3100/affiliate`
- **Admin Console**: `http://localhost:3100/admin`

---

## 📡 API & S2S Webhook Reference

### 1. Unique Referral Link Format
Partners share localized referral links with optional Sub-ID tracking:
```
https://moodscanr.ai/?ref=INNOTEK_VIP&subId=youtube_campaign_01
```

### 2. Ingesting Referral Click (Idempotent)
```http
GET /api/clicks/track?ref=INNOTEK_VIP&productId=moodscanr&subId=youtube_01
Host: api.affiliate.innotek.global
```
**Response (200 OK):**
```json
{
  "clickId": "clk_98f420a1",
  "cookieMaxAge": 5184000,
  "trackedAt": "2026-09-18T10:00:00Z"
}
```

### 3. Server-to-Server (S2S) Conversion Postback
When a user completes a transaction on any connected software tool:
```http
POST /api/conversions/s2s
Host: api.affiliate.innotek.global
X-Merchant-Key: sec_live_innotek_merchant_key
Content-Type: application/json

{
  "transactionId": "tx_20260918_84920",
  "clickId": "clk_98f420a1",
  "affiliateCode": "INNOTEK_VIP",
  "productId": "moodscanr",
  "amountCents": 2900,
  "currency": "USD",
  "customerEmail": "subscriber@domain.com",
  "eventType": "subscription_started"
}
```
**Response (201 Created):**
```json
{
  "conversionId": "conv_a8b9c0d1",
  "status": "PENDING_BUFFER",
  "commissionAmount": 580,
  "clearanceHoldUntil": "2026-10-02T10:00:00Z"
}
```

---

## 📈 Development Milestones

The repository history is organized into the following clear development phases:

- **Stage 1: Architecture & Infrastructure**: Monorepo scaffolding, Docker infrastructure, and shared configuration.
- **Stage 2: Core Attribution Engine**: NestJS hexagonal backend, Prisma PostgreSQL models, and S2S postback webhooks.
- **Stage 3: Multi-Role Portals**: Next.js 15 Partner Portal, Admin Console, and KYC onboarding wizards.
- **Stage 4: Landing & Design System**: PartnerStack-style public landing page, interactive live simulator, and animated feature tabs.
- **Stage 5: Documentation & Compliance**: Comprehensive Partner Documentation suite, Developer SDK guide, and legal operating agreements.
- **Stage 6: UI Polish & Production Readiness**: Navbar dual-interaction optimization, color harmony refinements, and production documentation.

---

## ⚖️ Legal & Compliance

- **UK ASA & US FTC Guidelines**: All promotional materials must visibly disclose material connections (e.g. *"#ad"*, *"Commission Earned"*).
- **GDPR & ePrivacy**: First-party cookie tracking complies with European privacy frameworks; zero cross-site biometric data profiling.

---

## 📄 License & Maintainer

Maintained with excellence by the **Innotek Global Engineering Team**.  
London, United Kingdom.
