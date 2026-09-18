import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AffiliateJwtGuard } from '../guards/affiliate-jwt.guard';
import { RequestPayoutUseCase } from '../../../application/use-cases/request-payout.usecase';
import { PAYOUT_REPOSITORY, PayoutRepository } from '../../../domain/ports';
import { Inject } from '@nestjs/common';

@ApiTags('payouts')
@ApiBearerAuth('affiliate-jwt')
@Controller('payouts')
@UseGuards(AffiliateJwtGuard)
export class PayoutsController {
  constructor(
    private readonly requestPayout: RequestPayoutUseCase,
    @Inject(PAYOUT_REPOSITORY) private readonly payouts: PayoutRepository,
  ) {}

  @ApiOperation({ summary: 'Gom toàn bộ ledger APPROVED chưa trả thành 1 yêu cầu payout' })
  @Post('request')
  request(@Req() req: any) {
    return this.requestPayout.execute(req.user.affiliateId);
  }

  @ApiOperation({ summary: 'Lịch sử payout của affiliate hiện tại' })
  @Get()
  list(@Req() req: any) {
    return this.payouts.listByAffiliate(req.user.affiliateId);
  }
}
