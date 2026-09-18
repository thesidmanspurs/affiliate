import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PersistenceModule } from '../persistence/persistence.module';
import { QUEUE_CLICKS, QUEUE_CONVERSIONS } from './queue.constants';
import { QueueService } from './queue.service';
import { ClicksProcessor } from './processors/clicks.processor';
import { ConversionsProcessor } from './processors/conversions.processor';
import { TrackClickUseCase } from '../../application/use-cases/track-click.usecase';
import { RecordConversionUseCase } from '../../application/use-cases/record-conversion.usecase';

const isRedisEnabled = process.env.ENABLE_REDIS_QUEUE === 'true' || process.env.ENABLE_REDIS_QUEUE === '1';

const dynamicImports: any[] = [PersistenceModule];
const dynamicProviders: any[] = [
  QueueService,
  TrackClickUseCase,
  RecordConversionUseCase,
];
const dynamicExports: any[] = [QueueService];

if (isRedisEnabled) {
  dynamicImports.push(
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', '127.0.0.1'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          lazyConnect: true,
          maxRetriesPerRequest: null,
          enableOfflineQueue: false,
        },
      }),
    }),
    BullModule.registerQueue(
      { name: QUEUE_CLICKS },
      { name: QUEUE_CONVERSIONS }
    )
  );
  dynamicProviders.push(ClicksProcessor, ConversionsProcessor);
  dynamicExports.push(BullModule);
}

@Global()
@Module({
  imports: dynamicImports,
  providers: dynamicProviders,
  exports: dynamicExports,
})
export class QueueModule {}
