import { Injectable, Logger, Optional, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { QUEUE_CLICKS, QUEUE_CONVERSIONS, JOB_TRACK_CLICK, JOB_PROCESS_CONVERSION } from './queue.constants';
import { TrackClickUseCase, TrackClickInput } from '../../application/use-cases/track-click.usecase';
import { RecordConversionUseCase, RecordConversionInput } from '../../application/use-cases/record-conversion.usecase';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private readonly isQueueEnabled: boolean;

  constructor(
    private readonly config: ConfigService,
    private readonly trackClickUseCase: TrackClickUseCase,
    private readonly recordConversionUseCase: RecordConversionUseCase,
    @Optional() @Inject('BullQueue_' + QUEUE_CLICKS) private readonly clicksQueue?: Queue,
    @Optional() @Inject('BullQueue_' + QUEUE_CONVERSIONS) private readonly conversionsQueue?: Queue,
  ) {
    const flag = this.config.get<string>('ENABLE_REDIS_QUEUE', 'false');
    this.isQueueEnabled = flag === 'true' || flag === '1';
    if (this.isQueueEnabled) {
      this.logger.log('Redis BullMQ Queue is ENABLED for high-throughput asynchronous buffering.');
    } else {
      this.logger.log('Redis BullMQ is disabled (fallback to synchronous in-process execution).');
    }
  }

  /**
   * Enqueue click tracking or fallback to direct execution.
   */
  async enqueueClick(input: TrackClickInput): Promise<{ ok: boolean; clickId: string; queued: boolean; result?: any }> {
    if (this.isQueueEnabled && this.clicksQueue) {
      try {
        await this.clicksQueue.add(JOB_TRACK_CLICK, input, {
          jobId: input.clickId, // Idempotent: prevent duplicate jobs with same clickId
          removeOnComplete: 1000,
          removeOnFail: 5000,
          attempts: 3,
          backoff: { type: 'exponential', delay: 500 },
        });
        return { ok: true, clickId: input.clickId, queued: true };
      } catch (err: any) {
        this.logger.warn(`Failed to enqueue click ${input.clickId} to Redis, falling back to sync: ${err.message}`);
      }
    }

    // Fallback sync execution
    const result = await this.trackClickUseCase.execute(input);
    return { ok: true, clickId: input.clickId, queued: false, result };
  }

  /**
   * Enqueue conversion recording or fallback to direct execution.
   */
  async enqueueConversion(input: RecordConversionInput): Promise<{ ok: boolean; eventId: string; queued: boolean; result?: any }> {
    if (this.isQueueEnabled && this.conversionsQueue) {
      try {
        await this.conversionsQueue.add(JOB_PROCESS_CONVERSION, input, {
          jobId: input.eventId, // Idempotent: prevent duplicate jobs with same eventId
          removeOnComplete: 2000,
          removeOnFail: 10000,
          attempts: 5,
          backoff: { type: 'exponential', delay: 1000 },
        });
        return { ok: true, eventId: input.eventId, queued: true };
      } catch (err: any) {
        this.logger.warn(`Failed to enqueue conversion ${input.eventId} to Redis, falling back to sync: ${err.message}`);
      }
    }

    // Fallback sync execution
    const result = await this.recordConversionUseCase.execute(input);
    return { ok: true, eventId: input.eventId, queued: false, result };
  }
}
