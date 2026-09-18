import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MerchantApiKeyGuard } from '../guards/merchant-api-key.guard';
import { QueueService } from '../../queue/queue.service';

class RecordConversionDto {
  @IsString() eventId: string; // = stripeEventId / invoiceId, dùng làm idempotency key
  @IsOptional() @IsString() clickId?: string;
  @IsString() externalUserId: string;
  @IsString() orderId: string;
  @IsInt() @Min(0) amount: number; // đơn vị cent/xu
  @IsString() currency: string;
  @IsIn(['NEW_PURCHASE', 'RENEWAL']) type: 'NEW_PURCHASE' | 'RENEWAL';
}

// Được gọi bởi Stripe Webhook hoặc Outbox Worker của product backend.
// Khi kích hoạt BullMQ, controller phản hồi HTTP 200 tức thì (<5ms) cho caller,
// sau đó background worker xử lý tính hoa hồng & ghi sổ cái append-only.
@ApiTags('conversions')
@ApiSecurity('merchant-api-key')
@Controller('conversions')
@UseGuards(MerchantApiKeyGuard)
export class ConversionsController {
  constructor(private readonly queueService: QueueService) {}

  @ApiOperation({ summary: 'Ghi nhận conversion - idempotent theo eventId, hỗ trợ đệm hàng đợi BullMQ' })
  @Post()
  record(@Req() req: any, @Body() dto: RecordConversionDto) {
    return this.queueService.enqueueConversion({ ...dto, merchantId: req.merchant.id });
  }
}
