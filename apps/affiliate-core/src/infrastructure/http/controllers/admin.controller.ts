import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../persistence/prisma.service';
import { calculateCommission } from '../../../domain/services/commission-calculator';

import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { PRODUCT_METADATA } from './products.controller';

class UpdateAffiliateDto {
  @IsOptional()
  @IsIn(['ONBOARDING_REQUIRED', 'PENDING_REVIEW', 'ACTIVE', 'REJECTED', 'SUSPENDED'])
  status?: 'ONBOARDING_REQUIRED' | 'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

  @IsOptional()
  @IsNumber()
  commissionRate?: number;
}

class UpdateAffiliateStatusDto extends UpdateAffiliateDto {}

class UpdateProductDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  defaultCommissionRate?: number;

  @IsOptional()
  @IsString()
  commissionType?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsNumber()
  logoSize?: number;
}


class ReviewAffiliateDto {
  @IsIn(['APPROVE', 'REJECT'])
  action: 'APPROVE' | 'REJECT';

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsNumber()
  cooldownDays?: number; // default 7
}

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOperation({ summary: 'Platform-wide Executive KPIs' })
  @Get('overview')
  async getOverview() {
    const totalAffiliates = await this.prisma.affiliate.count();
    const activeAffiliates = await this.prisma.affiliate.count({ where: { status: 'ACTIVE' } });
    const totalConversions = await this.prisma.conversion.count();
    const approvedConversions = await this.prisma.conversion.count({ where: { status: 'APPROVED' } });

    // Aggregate Gross Merchandise Value (Total sales driven)
    const gmvAgg = await this.prisma.conversion.aggregate({
      _sum: { amount: true },
    });
    const totalGmv = gmvAgg._sum.amount ?? 0;

    // Aggregate Commissions Paid & Approved
    const commissionAgg = await this.prisma.commissionLedger.aggregate({
      _sum: { amount: true },
    });
    const totalCommission = commissionAgg._sum.amount ?? 0;

    // Pending Payouts
    const pendingPayoutsAgg = await this.prisma.payout.aggregate({
      where: { status: 'REQUESTED' },
      _sum: { amount: true },
      _count: true,
    });

    const netProfit = totalGmv - totalCommission;
    const profitMargin = totalGmv > 0 ? ((netProfit / totalGmv) * 100).toFixed(1) : '100.0';

    return {
      totalGmv, // cents
      totalCommission, // cents
      netProfit, // cents
      profitMarginPercent: parseFloat(profitMargin),
      totalAffiliates,
      activeAffiliates,
      totalConversions,
      approvedConversions,
      pendingPayoutsCount: pendingPayoutsAgg._count,
      pendingPayoutsAmount: pendingPayoutsAgg._sum.amount ?? 0,
      currency: 'USD',
    };
  }

  @ApiOperation({ summary: 'Deep Financial Analytics Breakdown for each of the 7 products' })
  @Get('products/analytics')
  async getProductAnalytics() {
    const merchants = await this.prisma.merchant.findMany({
      where: { isActive: true },
      include: {
        conversions: true,
        affiliates: true,
        clicks: true,
      },
    });

    // Compute for each product
    const analytics = await Promise.all(
      merchants.map(async (m) => {
        const totalSales = m.conversions.reduce((sum, c) => sum + c.amount, 0);
        
        // Sum commission for this merchant's conversions
        const conversionIds = m.conversions.map((c) => c.id);
        const commissionAgg = await this.prisma.commissionLedger.aggregate({
          where: { conversionId: { in: conversionIds } },
          _sum: { amount: true },
        });
        const totalCommission = commissionAgg._sum.amount ?? 0;
        const netProfit = totalSales - totalCommission;
        const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : '100.0';

        return {
          merchantId: m.id,
          productId: m.productId,
          name: m.name,
          totalSales, // in cents
          totalCommission, // in cents
          netProfit, // in cents
          profitMarginPercent: parseFloat(profitMargin),
          conversionCount: m.conversions.length,
          clickCount: m.clicks.length,
          activeAffiliatesCount: m.affiliates.length,
          currency: 'USD',
        };
      })
    );

    return analytics;
  }

  @ApiOperation({ summary: 'List all registered Affiliates with compliance onboarding dossiers' })
  @Get('affiliates')
  async listAffiliates() {
    const affiliates = await this.prisma.affiliate.findMany({
      include: {
        merchant: { select: { name: true, productId: true } },
        _count: { select: { conversions: true, clicks: true } },
        ledger: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return affiliates.map((a) => {
      const totalEarned = a.ledger.reduce((sum, e) => sum + e.amount, 0);
      const paidEarned = a.ledger.filter((e) => e.status === 'PAID').reduce((sum, e) => sum + e.amount, 0);
      const availableBalance = a.ledger.filter((e) => e.status === 'APPROVED').reduce((sum, e) => sum + e.amount, 0);

      return {
        id: a.id,
        email: a.email,
        code: a.code,
        status: a.status,
        commissionRate: a.commissionRate,
        merchantName: a.merchant?.name || 'Innotek Multi-Product',
        productId: a.merchant?.productId || 'all',
        totalClicks: a._count.clicks,
        totalConversions: a._count.conversions,
        totalEarned,
        paidEarned,
        availableBalance,
        payoutMethod: a.payoutMethod,
        onboardingData: a.onboardingData,
        submittedAt: a.submittedAt,
        reviewedAt: a.reviewedAt,
        rejectionReason: a.rejectionReason,
        reapplyAfter: a.reapplyAfter,
        createdAt: a.createdAt,
      };
    });
  }

  @ApiOperation({ summary: 'Get single registered Affiliate details with compliance onboarding dossier' })
  @Get('affiliates/:id')
  async getAffiliateById(@Param('id') id: string) {
    const a = await this.prisma.affiliate.findUnique({
      where: { id },
      include: {
        merchant: { select: { name: true, productId: true } },
        _count: { select: { conversions: true, clicks: true } },
        ledger: true,
      },
    });
    if (!a) throw new NotFoundException('Affiliate not found');

    const totalEarned = a.ledger.reduce((sum, e) => sum + e.amount, 0);
    const paidEarned = a.ledger.filter((e) => e.status === 'PAID').reduce((sum, e) => sum + e.amount, 0);
    const availableBalance = a.ledger.filter((e) => e.status === 'APPROVED').reduce((sum, e) => sum + e.amount, 0);

    return {
      id: a.id,
      email: a.email,
      code: a.code,
      status: a.status,
      commissionRate: a.commissionRate,
      merchantName: a.merchant?.name || 'Innotek Multi-Product',
      productId: a.merchant?.productId || 'all',
      totalClicks: a._count.clicks,
      totalConversions: a._count.conversions,
      totalEarned,
      paidEarned,
      availableBalance,
      payoutMethod: a.payoutMethod,
      onboardingData: a.onboardingData,
      submittedAt: a.submittedAt,
      reviewedAt: a.reviewedAt,
      rejectionReason: a.rejectionReason,
      reapplyAfter: a.reapplyAfter,
      createdAt: a.createdAt,
    };
  }

  @ApiOperation({ summary: 'Moderate and review partner application (Approve / Reject with cooldown)' })
  @Post('affiliates/:id/review')
  async reviewAffiliate(
    @Param('id') id: string,
    @Body() dto: ReviewAffiliateDto,
  ) {
    const affiliate = await this.prisma.affiliate.findUnique({ where: { id } });
    if (!affiliate) throw new NotFoundException('Affiliate not found');

    if (dto.action === 'APPROVE') {
      return this.prisma.affiliate.update({
        where: { id },
        data: {
          status: 'ACTIVE',
          reviewedAt: new Date(),
          rejectionReason: null,
          reapplyAfter: null,
        },
      });
    } else {
      const days = dto.cooldownDays || 7;
      const reapplyDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      return this.prisma.affiliate.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewedAt: new Date(),
          rejectionReason: dto.rejectionReason || 'Your application does not currently meet our minimum promotional compliance requirements.',
          reapplyAfter: reapplyDate,
        },
      });
    }
  }

  @ApiOperation({ summary: 'Update Affiliate status or commission rate' })
  @Patch('affiliates/:id/status')
  async updateAffiliateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAffiliateStatusDto,
  ) {
    const affiliate = await this.prisma.affiliate.findUnique({ where: { id } });
    if (!affiliate) throw new NotFoundException('Affiliate not found');

    return this.prisma.affiliate.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.commissionRate !== undefined && { commissionRate: dto.commissionRate }),
      },
    });
  }

  @ApiOperation({ summary: 'Update Affiliate details, status, or commission rate' })
  @Patch('affiliates/:id')
  async updateAffiliate(
    @Param('id') id: string,
    @Body() dto: UpdateAffiliateDto,
  ) {
    const affiliate = await this.prisma.affiliate.findUnique({ where: { id } });
    if (!affiliate) throw new NotFoundException('Affiliate not found');

    return this.prisma.affiliate.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.commissionRate !== undefined && { commissionRate: dto.commissionRate }),
      },
    });
  }

  @ApiOperation({ summary: 'Permanently remove an affiliate account and clean up dependencies' })
  @Delete('affiliates/:id')
  async deleteAffiliate(@Param('id') id: string) {
    const affiliate = await this.prisma.affiliate.findUnique({ where: { id } });
    if (!affiliate) throw new NotFoundException('Affiliate not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.referralClick.deleteMany({ where: { affiliateId: id } });
      await tx.commissionLedger.deleteMany({ where: { affiliateId: id } });
      await tx.payout.deleteMany({ where: { affiliateId: id } });
      await tx.conversion.updateMany({ where: { affiliateId: id }, data: { affiliateId: null } });
      await tx.affiliate.delete({ where: { id } });
      return { ok: true, message: 'Affiliate removed successfully' };
    });
  }

  @ApiOperation({ summary: 'List all Payout requests across the platform' })
  @Get('payouts')
  async listPayouts() {
    return this.prisma.payout.findMany({
      include: {
        affiliate: {
          select: { email: true, code: true, payoutMethod: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @ApiOperation({ summary: 'Approve & Mark Payout as completed' })
  @Post('payouts/:id/approve')
  async approvePayout(@Param('id') id: string, @Body() body: { externalRef?: string }) {
    return this.prisma.$transaction(async (tx) => {
      const payout = await tx.payout.findUnique({ where: { id } });
      if (!payout) throw new NotFoundException('Payout not found');

      const updated = await tx.payout.update({
        where: { id },
        data: {
          status: 'PAID',
          externalRef: body.externalRef || `MANUAL-${Date.now()}`,
        },
      });

      // Update associated ledger entries
      await tx.commissionLedger.updateMany({
        where: { payoutId: id },
        data: { status: 'PAID' },
      });

      return updated;
    });
  }

  @ApiOperation({ summary: 'Batch approve eligible conversions after buffer period' })
  @Post('conversions/batch-approve')
  async batchApproveConversions() {
    const approvable = await this.prisma.conversion.findMany({
      where: { status: 'PENDING' },
      include: { affiliate: true },
    });

    let approvedCount = 0;
    for (const c of approvable) {
      if (!c.affiliateId || !c.affiliate) continue;
      
      const rate = c.affiliate.commissionRate || 0.20;
      const commissionAmount = calculateCommission(c.amount, rate);

      await this.prisma.$transaction(async (tx) => {
        await tx.conversion.update({
          where: { id: c.id },
          data: { status: 'APPROVED', approvedAt: new Date() },
        });

        await tx.commissionLedger.upsert({
          where: { conversionId: c.id },
          update: {},
          create: {
            affiliateId: c.affiliateId!,
            conversionId: c.id,
            amount: commissionAmount,
            currency: c.currency,
            status: 'APPROVED',
          },
        });
      });
      approvedCount++;
    }

    return { message: `Successfully approved ${approvedCount} conversions`, approvedCount };
  }

  @ApiOperation({ summary: 'List all products for admin management (including paused)' })
  @Get('products')
  async listAdminProducts() {
    const merchants = await this.prisma.merchant.findMany({
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
        commissionType: m.commissionType ?? meta.commissionType ?? 'recurring',
        averageOrderValue: meta.averageOrderValue ?? 2900,
        currency: meta.currency ?? 'USD',
        websiteUrl: meta.websiteUrl ?? `https://${m.productId}.innotek.global`,
        status: m.isActive ? 'ACTIVE' : 'PAUSED',
        isActive: m.isActive,
        logoUrl: m.logoUrl || null,
        logoSize: m.logoSize ?? 40,
        features: meta.features ?? ['High conversion SaaS', 'Global recurring payout'],
        targetAudience: meta.targetAudience ?? 'Global Tech Enthusiasts & Professionals',
        apiKeyHash: m.apiKeyHash,
        webhookSecret: m.webhookSecret,
        createdAt: m.createdAt,
      };
    });
  }

  @ApiOperation({ summary: 'Update product configuration (commission rate, status, logo, logoSize)' })
  @Patch('products/:id')
  async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    const merchant = await this.prisma.merchant.findFirst({
      where: {
        OR: [{ id }, { productId: id }],
      },
    });

    if (!merchant) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    const data: any = {};
    if (typeof body.isActive === 'boolean') data.isActive = body.isActive;
    if (typeof body.defaultCommissionRate === 'number') data.defaultCommissionRate = body.defaultCommissionRate;
    if (body.commissionType) data.commissionType = body.commissionType;
    if (body.logoUrl !== undefined) data.logoUrl = body.logoUrl;
    if (typeof body.logoSize === 'number') data.logoSize = body.logoSize;

    const updated = await this.prisma.merchant.update({
      where: { id: merchant.id },
      data,
    });

    return {
      success: true,
      product: updated,
    };
  }
}
