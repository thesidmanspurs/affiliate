import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_CLICKS, JOB_TRACK_CLICK } from '../queue.constants';
import { TrackClickUseCase, TrackClickInput } from '../../../application/use-cases/track-click.usecase';

@Processor(QUEUE_CLICKS)
export class ClicksProcessor extends WorkerHost {
  private readonly logger = new Logger(ClicksProcessor.name);

  constructor(private readonly trackClickUseCase: TrackClickUseCase) {
    super();
  }

  async process(job: Job<TrackClickInput, any, string>): Promise<any> {
    if (job.name === JOB_TRACK_CLICK) {
      try {
        const result = await this.trackClickUseCase.execute(job.data);
        this.logger.debug(`Processed click ${job.data.clickId} for code ${job.data.affiliateCode}`);
        return result;
      } catch (err: any) {
        this.logger.error(`Failed to process click ${job.data.clickId}: ${err.message}`, err.stack);
        throw err;
      }
    }
  }
}
