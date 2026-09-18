import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
