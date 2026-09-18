import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { AffiliateAuthModule } from './infrastructure/auth/affiliate-auth.module';
import { AuthController } from './infrastructure/http/controllers/auth.controller';
import { AffiliatesController } from './infrastructure/http/controllers/affiliates.controller';
import { ClicksController } from './infrastructure/http/controllers/clicks.controller';
import { ConversionsController } from './infrastructure/http/controllers/conversions.controller';
import { PayoutsController } from './infrastructure/http/controllers/payouts.controller';
import { ProductsController } from './infrastructure/http/controllers/products.controller';
import { AdminController } from './infrastructure/http/controllers/admin.controller';
import { RegisterAffiliateUseCase } from './application/use-cases/register-affiliate.usecase';
import { TrackClickUseCase } from './application/use-cases/track-click.usecase';
import { RecordConversionUseCase } from './application/use-cases/record-conversion.usecase';
import { ApproveConversionUseCase } from './application/use-cases/approve-conversion.usecase';
import { RequestPayoutUseCase } from './application/use-cases/request-payout.usecase';
import { GetDashboardStatsUseCase } from './application/use-cases/get-dashboard-stats.usecase';

// AppModule chỉ đóng vai trò "wiring" - domain & application không phụ thuộc
// NestJS, nên có thể unit test 2 lớp đó mà không cần khởi động cả app.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PersistenceModule,
    QueueModule,
    AffiliateAuthModule,
  ],
  controllers: [
    AuthController,
    AffiliatesController,
    ClicksController,
    ConversionsController,
    PayoutsController,
    ProductsController,
    AdminController,
  ],
  providers: [
    RegisterAffiliateUseCase,
    TrackClickUseCase,
    RecordConversionUseCase,
    ApproveConversionUseCase,
    RequestPayoutUseCase,
    GetDashboardStatsUseCase,
  ],
})
export class AppModule {}
