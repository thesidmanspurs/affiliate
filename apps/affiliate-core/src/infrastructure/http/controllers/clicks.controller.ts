import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MerchantApiKeyGuard } from '../guards/merchant-api-key.guard';
import { QueueService } from '../../queue/queue.service';

class TrackClickDto {
  @IsString() clickId: string; // UUID sinh ở product backend lúc redirect
  @IsString() affiliateCode: string;
  @IsOptional() @IsString() ipHash?: string;
  @IsOptional() @IsString() userAgent?: string;
}

// Product backend gọi endpoint này ngay khi redirect /r/:code -> trang đích,
// TRƯỚC khi set cookie, để đảm bảo click luôn được ghi nhận kể cả nếu user
// đóng tab ngay sau đó.
// Hỗ trợ đệm Redis + BullMQ Queue để xử lý hàng ngàn click/giây mà không nghẽn DB.
@ApiTags('clicks')
@ApiSecurity('merchant-api-key')
@Controller('clicks')
@UseGuards(MerchantApiKeyGuard)
export class ClicksController {
  constructor(private readonly queueService: QueueService) {}

  @ApiOperation({ summary: 'Ghi nhận click referral - idempotent theo clickId, hỗ trợ đệm queue BullMQ' })
  @Post()
  track(@Req() req: any, @Body() dto: TrackClickDto) {
    return this.queueService.enqueueClick({ ...dto, merchantId: req.merchant.id });
  }
}
