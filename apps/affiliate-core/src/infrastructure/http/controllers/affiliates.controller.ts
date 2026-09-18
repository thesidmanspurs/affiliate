import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsIn, IsObject, IsString } from 'class-validator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AffiliateJwtGuard } from '../guards/affiliate-jwt.guard';
import { GetDashboardStatsUseCase } from '../../../application/use-cases/get-dashboard-stats.usecase';
import {
  AFFILIATE_REPOSITORY,
  AffiliateRepository,
  CONVERSION_REPOSITORY,
  ConversionRepository,
} from '../../../domain/ports';
import { Inject } from '@nestjs/common';
import { PrismaService } from '../../persistence/prisma.service';
import { PRODUCT_METADATA } from './products.controller';

class UpdatePayoutMethodDto {
  @IsIn(['bank', 'bank_account', 'debit_card', 'card', 'momo', 'paypal']) type: string;
  @IsObject() details: Record<string, string>;
}

// Toàn bộ endpoint dưới đây thuộc "self-service" của affiliate - bảo vệ bởi
// AffiliateJwtGuard, request.user = { affiliateId, merchantId } (xem jwt.strategy.ts).
@ApiTags('affiliates')
@ApiBearerAuth('affiliate-jwt')
@Controller('affiliates/me')
@UseGuards(AffiliateJwtGuard)
export class AffiliatesController {
  constructor(
    private readonly getStats: GetDashboardStatsUseCase,
    @Inject(AFFILIATE_REPOSITORY) private readonly affiliates: AffiliateRepository,
    @Inject(CONVERSION_REPOSITORY) private readonly conversions: ConversionRepository,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Get current affiliate profile' })
  @Get('profile')
  async getProfile(@Req() req: any) {
    const affiliate = await this.affiliates.findById(req.user.affiliateId);
    if (!affiliate) return null;
    return {
      id: affiliate.id,
      email: affiliate.email,
      code: affiliate.code,
      status: affiliate.status,
      commissionRate: affiliate.commissionRate,
      payoutMethod: affiliate.payoutMethod,
      onboardingData: affiliate.onboardingData,
      submittedAt: affiliate.submittedAt,
      reviewedAt: affiliate.reviewedAt,
      rejectionReason: affiliate.rejectionReason,
      reapplyAfter: affiliate.reapplyAfter,
      merchantId: affiliate.merchantId,
    };
  }

  @ApiOperation({ summary: 'Thống kê tổng quan: số conversion, hoa hồng pending/approved/paid' })
  @Get('stats')
  stats(@Req() req: any) {
    return this.getStats.execute(req.user.affiliateId);
  }

  // Pass-through đơn giản (không có business logic riêng) nên gọi thẳng
  // repository ở đây thay vì bọc thêm 1 use-case chỉ để list dữ liệu.
  @ApiOperation({ summary: 'Danh sách conversion gắn với affiliate hiện tại' })
  @Get('conversions')
  conversionsList(@Req() req: any) {
    return this.conversions.listByAffiliate(req.user.affiliateId);
  }

  @ApiOperation({ summary: 'Khai báo/cập nhật phương thức nhận tiền' })
  @Patch('payout-method')
  async updatePayoutMethod(@Req() req: any, @Body() dto: UpdatePayoutMethodDto) {
    await this.affiliates.updatePayoutMethod(req.user.affiliateId, dto);
    return { ok: true };
  }

  @ApiOperation({ summary: 'Get all ecosystem programs with affiliate enrollment status & per-product revenue' })
  @Get('programs')
  async getPrograms(@Req() req: any) {
    const affiliate = await this.affiliates.findById(req.user.affiliateId);
    if (!affiliate) return [];

    const [merchants, stats] = await Promise.all([
      this.prisma.merchant.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }),
      this.getStats.execute(req.user.affiliateId),
    ]);

    const onboarding = (affiliate.onboardingData as any) || {};
    const programs = onboarding.programs || {};
    const tax = onboarding.tax || {};
    const hasTaxDeclared = Boolean(tax.taxId || tax.certificationAccepted || tax.formType || tax.taxForm);

    return merchants.map((m) => {
      const meta = PRODUCT_METADATA[m.productId] || {};
      const enrollment = programs[m.productId];
      const productStat = stats.byProduct?.[m.productId];

      let status: 'ACTIVE' | 'PENDING_REVIEW' | 'AVAILABLE' | 'REJECTED' = 'AVAILABLE';
      if (enrollment) {
        status = enrollment.status;
      } else if (affiliate.status === 'ACTIVE' && (affiliate.merchantId === m.id || !affiliate.merchantId)) {
        status = 'ACTIVE';
      }

      return {
        id: m.id,
        productId: m.productId,
        name: m.name,
        tagline: meta.tagline || 'Innotek AI Application',
        description: meta.description || '',
        category: meta.category || 'AI SaaS',
        defaultCommissionRate: m.defaultCommissionRate ?? meta.defaultCommissionRate ?? 0.20,
        commissionType: m.commissionType || meta.commissionType || 'recurring',
        averageOrderValue: meta.averageOrderValue || 2900,
        currency: meta.currency || 'USD',
        websiteUrl: meta.websiteUrl || `https://${m.productId}.innotek.global`,
        logoUrl: m.logoUrl || meta.websiteUrl,
        features: meta.features || [],
        targetAudience: meta.targetAudience || '',
        status,
        enrolledAt: enrollment?.enrolledAt || (status === 'ACTIVE' ? affiliate.reviewedAt || affiliate.createdAt : null),
        strategyNotes: enrollment?.strategyNotes || '',
        linkedCompliance: enrollment ? {
          taxForm: enrollment.linkedTaxForm,
          legalName: enrollment.linkedLegalName,
          taxId: enrollment.linkedTaxId,
          taxCountry: enrollment.linkedTaxCountry,
          channels: enrollment.linkedChannels,
          primaryUrl: enrollment.linkedPrimaryUrl,
        } : null,
        performance: {
          conversionsCount: productStat?.conversionsCount || 0,
          sourcedRevenue: productStat?.sourcedRevenue || 0,
          earnedCommission: productStat?.totalCommission || 0,
          pendingCommission: productStat?.pendingCommission || 0,
          approvedCommission: productStat?.approvedCommission || 0,
        },
        hasTaxDeclared,
      };
    });
  }

  @ApiOperation({ summary: 'Apply / Enroll in a specific Innotek product affiliate program' })
  @Post('programs/:productId/apply')
  async enrollProgram(@Req() req: any, @Param('productId') productId: string, @Body() body: any) {
    const affiliate = await this.affiliates.findById(req.user.affiliateId);
    if (!affiliate) throw new NotFoundException('Affiliate not found');

    const onboarding = (affiliate.onboardingData as any) || {};
    const tax = onboarding.tax || {};
    const hasTaxDeclared = Boolean(tax.taxId || tax.certificationAccepted || tax.formType || tax.taxForm);

    if (!hasTaxDeclared) {
      throw new BadRequestException({
        code: 'TAX_DECLARATION_REQUIRED',
        message: 'A certified tax declaration (W-8BEN / W-9 / HMRC) is required before enrolling in affiliate programs.',
      });
    }

    const updated = await this.affiliates.enrollProgram(req.user.affiliateId, productId, body?.strategyNotes);
    const updatedPrograms = (updated.onboardingData as any)?.programs || {};
    return {
      ok: true,
      program: updatedPrograms[productId],
    };
  }

  @ApiOperation({ summary: 'Update partner profile, tax declaration, and payout settings' })
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() body: any) {
    const affiliate = await this.affiliates.updateProfile(req.user.affiliateId, body);
    return { ok: true, affiliate };
  }

  @ApiOperation({ summary: 'Submit full multi-step compliance onboarding data' })
  @Post('onboarding')
  async submitOnboarding(@Req() req: any, @Body() body: any) {
    const affiliate = await this.affiliates.submitOnboarding(req.user.affiliateId, body);
    return {
      ok: true,
      status: affiliate.status,
      submittedAt: affiliate.submittedAt,
    };
  }

  @ApiOperation({ summary: 'Re-apply after 7-day cooldown' })
  @Post('reapply')
  async reapply(@Req() req: any) {
    const current = await this.affiliates.findById(req.user.affiliateId);
    if (!current) throw new Error('Affiliate not found');
    
    // Check cooldown if reapplyAfter is in future
    if (current.reapplyAfter && new Date(current.reapplyAfter) > new Date()) {
      throw new Error(`Re-application is available on ${new Date(current.reapplyAfter).toLocaleDateString()}`);
    }

    const affiliate = await this.affiliates.reapply(req.user.affiliateId);
    return {
      ok: true,
      status: affiliate.status,
    };
  }

  @ApiOperation({ summary: 'Get live notifications for current partner' })
  @Get('notifications')
  async getNotifications(@Req() req: any) {
    const affiliate = await this.affiliates.findById(req.user.affiliateId);
    if (!affiliate) return [];

    const notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: 'success' | 'warning' | 'info' | 'error';
      timestamp: string;
      unread: boolean;
      actionUrl?: string;
      actionLabel?: string;
    }> = [];

    if (affiliate.status === 'ACTIVE') {
      notifications.push({
        id: 'notif-approved',
        title: 'Application Approved! 🎉',
        message: 'Congratulations! Your partner account has passed compliance verification. All 7 AI SaaS promotion campaigns are now active.',
        type: 'success',
        timestamp: affiliate.reviewedAt ? new Date(affiliate.reviewedAt).toISOString() : new Date().toISOString(),
        unread: true,
        actionUrl: '/products',
        actionLabel: 'Get Promotional Links',
      });
    } else if (affiliate.status === 'PENDING_REVIEW') {
      notifications.push({
        id: 'notif-pending',
        title: 'Compliance Review in Progress ⏳',
        message: 'Your partner dossier has been submitted to the Innotek Risk & Compliance team. Review is typically completed within 24–48 hours.',
        type: 'warning',
        timestamp: affiliate.submittedAt ? new Date(affiliate.submittedAt).toISOString() : new Date().toISOString(),
        unread: false,
      });
    } else if (affiliate.status === 'REJECTED') {
      notifications.push({
        id: 'notif-rejected',
        title: 'Application Update ℹ️',
        message: affiliate.rejectionReason || 'Thank you for your interest in the Innotek Partner Network. Your application was not approved at this time. You may submit an updated dossier after the 7-day cooldown.',
        type: 'info',
        timestamp: affiliate.reviewedAt ? new Date(affiliate.reviewedAt).toISOString() : new Date().toISOString(),
        unread: true,
        actionUrl: affiliate.reapplyAfter && new Date(affiliate.reapplyAfter) <= new Date() ? '/onboarding' : undefined,
        actionLabel: affiliate.reapplyAfter && new Date(affiliate.reapplyAfter) <= new Date() ? 'Update & Re-apply' : undefined,
      });
    } else if (affiliate.status === 'ONBOARDING_REQUIRED') {
      notifications.push({
        id: 'notif-onboarding-req',
        title: 'Complete Partner Verification',
        message: 'Please complete your promotional channel, tax declaration, and beneficiary banking setup to activate your partner links.',
        type: 'info',
        timestamp: new Date().toISOString(),
        unread: true,
        actionUrl: '/onboarding',
        actionLabel: 'Complete Verification',
      });
    }

    return notifications;
  }
}
