import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../persistence/prisma.service';

export interface InnotekProductDto {
  id: string;
  productId: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  defaultCommissionRate: number; // e.g. 0.20 = 20%
  commissionType: 'recurring' | 'per_sale';
  averageOrderValue: number; // in cents, e.g. 2900 = �29.00 / $29.00
  currency: string;
  websiteUrl: string;
  status: 'ACTIVE' | 'BETA' | 'COMING_SOON' | 'PAUSED';
  isActive?: boolean;
  logoUrl?: string;
  logoSize?: number;
  features: string[];
  targetAudience: string;
  marketingAssetsUrl?: string;
}

export const PRODUCT_METADATA: Record<string, Partial<InnotekProductDto>> = {
  moodscanr: {
    tagline: 'AI Emotion & Video Sentiment Scanner',
    description: 'Transform user engagement through real-time emotional analysis on YouTube and social channels.',
    category: 'AI & Sentiment Intelligence',
    defaultCommissionRate: 0.20,
    commissionType: 'recurring',
    averageOrderValue: 2900, // �29/mo
    currency: 'USD',
    websiteUrl: 'https://moodscanr.ai',
    status: 'ACTIVE',
    features: ['YouTube emotion heatmap', 'Real-time viewer polarity analysis', 'Exportable intelligence reports'],
    targetAudience: 'Content Creators, Brand Marketers, Market Analysts',
  },
  halalscanr: {
    tagline: 'Smart Ingredient & Halal Verification Engine',
    description: 'AI-driven food label scanning and verified Islamic dietary compliance for global consumers.',
    category: 'Consumer AI & Lifestyle',
    defaultCommissionRate: 0.25,
    commissionType: 'recurring',
    averageOrderValue: 1900,
    currency: 'USD',
    websiteUrl: 'https://halalscanr.innotek.global',
    status: 'ACTIVE',
    features: ['E-number recognition', 'Instant barcode scan', 'Scholarly compliance database'],
    targetAudience: 'Halal Consumers, Travellers, Expatriates',
  },
  fanscanr: {
    tagline: 'Sports & Football Fan Sentiment Tracker',
    description: 'High-frequency fan mood tracking, squad reaction analytics, and matchday social sentiment.',
    category: 'Sports & Entertainment',
    defaultCommissionRate: 0.20,
    commissionType: 'recurring',
    averageOrderValue: 2400,
    currency: 'USD',
    websiteUrl: 'https://fanscanr.innotek.global',
    status: 'ACTIVE',
    features: ['Premier League & European league tracking', 'Fan pulse score', 'Club reaction trends'],
    targetAudience: 'Football Fan Communities, Sports Media, Betting Analysts',
  },
  headshot: {
    tagline: 'Studio-Grade AI Professional Headshots',
    description: 'Generate photorealistic executive portraits and LinkedIn profile headshots in under 10 minutes.',
    category: 'Generative AI & Photography',
    defaultCommissionRate: 0.30,
    commissionType: 'per_sale',
    averageOrderValue: 3900,
    currency: 'USD',
    websiteUrl: 'https://headshot.innotek.global',
    status: 'ACTIVE',
    features: ['4K photorealistic rendering', '40+ professional wardrobe styles', 'Commercial usage rights'],
    targetAudience: 'Job Seekers, Corporate Teams, Real Estate Agents, Executives',
  },
  talentscanr: {
    tagline: 'Autonomous AI Recruitment & Candidate Sourcing',
    description: 'Automate candidate screening, CV semantic matching, and interview evaluation on autopilot.',
    category: 'Enterprise HR & Automation',
    defaultCommissionRate: 0.20,
    commissionType: 'recurring',
    averageOrderValue: 9900,
    currency: 'USD',
    websiteUrl: 'https://talentscanr.innotek.global',
    status: 'ACTIVE',
    features: ['Semantic CV matching', 'AI automated candidate interview', 'ATS pipeline sync'],
    targetAudience: 'HR Leaders, Recruitment Agencies, Startup Founders',
  },
  'voice-agent': {
    tagline: 'Enterprise Conversational Voice AI Gateway',
    description: 'Human-like voice bots with sub-300ms latency for inbound customer support and outbound booking.',
    category: 'Voice AI & Telephony',
    defaultCommissionRate: 0.15,
    commissionType: 'recurring',
    averageOrderValue: 14900,
    currency: 'USD',
    websiteUrl: 'https://voice.innotek.global',
    status: 'ACTIVE',
    features: ['Ultra-low latency telephony', '25+ languages & accents', 'CRM webhook integration'],
    targetAudience: 'E-commerce Brands, Healthcare Clinics, SaaS Support Teams',
  },
  aqiscanr: {
    tagline: 'Hyper-Local Air Quality & Environmental AI',
    description: 'Real-time air pollution forecasting, PM2.5 tracking, and personalised wellness advisories.',
    category: 'Health & Environmental Tech',
    defaultCommissionRate: 0.20,
    commissionType: 'recurring',
    averageOrderValue: 1900,
    currency: 'USD',
    websiteUrl: 'https://aqiscanr.innotek.global',
    status: 'ACTIVE',
    features: ['Satellite & ground sensor fusion', 'Micro-climate smog alerts', 'Health recommendation engine'],
    targetAudience: 'Athletes, Urban Residents, Sensitive Health Groups',
  },
};

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOperation({ summary: 'List all Innotek ecosystem products available for promotion' })
  @Get()
  async listProducts(): Promise<InnotekProductDto[]> {
    const merchants = await this.prisma.merchant.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    return merchants.map((m) => {
      const meta = PRODUCT_METADATA[m.productId] || {};
      return {
        id: m.id,
        productId: m.productId,
        name: m.name,
        tagline: meta.tagline || 'Innovative AI product by Innotek Global',
        description: meta.description || 'Modern software solution powered by Innotek AI ecosystem.',
        category: meta.category || 'AI & SaaS',
        defaultCommissionRate: m.defaultCommissionRate ?? meta.defaultCommissionRate ?? 0.20,
        commissionType: (m.commissionType as any) ?? meta.commissionType ?? 'recurring',
        averageOrderValue: meta.averageOrderValue ?? 2900,
        currency: meta.currency ?? 'USD',
        websiteUrl: meta.websiteUrl ?? `https://${m.productId}.innotek.global`,
        status: m.isActive ? (meta.status ?? 'ACTIVE') : 'PAUSED',
        isActive: m.isActive,
        logoUrl: m.logoUrl || undefined,
        logoSize: m.logoSize ?? 40,
        features: meta.features ?? ['High conversion SaaS', 'Global recurring payout'],
        targetAudience: meta.targetAudience ?? 'Global Tech Enthusiasts & Professionals',
        marketingAssetsUrl: `https://innotek.global/brand-assets/${m.productId}`,
      };
    });
  }

  @ApiOperation({ summary: 'Get single product details by product ID / slug' })
  @Get(':productId')
  async getProduct(@Param('productId') productId: string): Promise<InnotekProductDto> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { productId },
    });
    if (!merchant) throw new NotFoundException(`Product ${productId} not found`);

    const meta = PRODUCT_METADATA[merchant.productId] || {};
    return {
      id: merchant.id,
      productId: merchant.productId,
      name: merchant.name,
      tagline: meta.tagline || 'Innovative AI product by Innotek Global',
      description: meta.description || 'Modern software solution powered by Innotek AI ecosystem.',
      category: meta.category || 'AI & SaaS',
      defaultCommissionRate: merchant.defaultCommissionRate ?? meta.defaultCommissionRate ?? 0.20,
      commissionType: (merchant.commissionType as any) ?? meta.commissionType ?? 'recurring',
      averageOrderValue: meta.averageOrderValue ?? 2900,
      currency: meta.currency ?? 'USD',
      websiteUrl: meta.websiteUrl ?? `https://${merchant.productId}.innotek.global`,
      status: merchant.isActive ? (meta.status ?? 'ACTIVE') : 'PAUSED',
      isActive: merchant.isActive,
      logoUrl: merchant.logoUrl || undefined,
      logoSize: merchant.logoSize ?? 40,
      features: meta.features ?? ['High conversion SaaS', 'Global recurring payout'],
      targetAudience: meta.targetAudience ?? 'Global Tech Enthusiasts & Professionals',
      marketingAssetsUrl: `https://innotek.global/brand-assets/${merchant.productId}`,
    };
  }
}
