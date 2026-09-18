import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_CONVERSIONS, JOB_PROCESS_CONVERSION } from '../queue.constants';
import { RecordConversionUseCase, RecordConversionInput } from '../../../application/use-cases/record-conversion.usecase';

@Processor(QUEUE_CONVERSIONS)
export class ConversionsProcessor extends WorkerHost {
  private readonly logger = new Logger(ConversionsProcessor.name);

  constructor(private readonly recordConversionUseCase: RecordConversionUseCase) {
    super();
  }

  async process(job: Job<RecordConversionInput, any, string>): Promise<any> {
    if (job.name === JOB_PROCESS_CONVERSION) {
      try {
        const result = await this.recordConversionUseCase.execute(job.data);
        this.logger.log(`Processed conversion event ${job.data.eventId} amount: ${job.data.amount} ${job.data.currency}`);
        return result;
      } catch (err: any) {
        this.logger.error(`Failed to process conversion ${job.data.eventId}: ${err.message}`, err.stack);
        throw err;
      }
    }
  }
}
