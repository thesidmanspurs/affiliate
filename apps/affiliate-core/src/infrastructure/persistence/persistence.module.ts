import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  AFFILIATE_REPOSITORY,
  CLICK_REPOSITORY,
  CONVERSION_REPOSITORY,
  LEDGER_REPOSITORY,
  MERCHANT_REPOSITORY,
  PAYOUT_REPOSITORY,
} from '../../domain/ports';
import {
  PrismaAffiliateRepository,
  PrismaClickRepository,
  PrismaConversionRepository,
  PrismaLedgerRepository,
  PrismaMerchantRepository,
  PrismaPayoutRepository,
} from './prisma-repositories';

// Đây là nơi DUY NHẤT "bind" interface (port) với implementation (adapter).
// Use-case chỉ khai báo @Inject(AFFILIATE_REPOSITORY) mà không biết đó là Prisma.
@Module({
  providers: [
    PrismaService,
    { provide: MERCHANT_REPOSITORY, useClass: PrismaMerchantRepository },
    { provide: AFFILIATE_REPOSITORY, useClass: PrismaAffiliateRepository },
    { provide: CLICK_REPOSITORY, useClass: PrismaClickRepository },
    { provide: CONVERSION_REPOSITORY, useClass: PrismaConversionRepository },
    { provide: LEDGER_REPOSITORY, useClass: PrismaLedgerRepository },
    { provide: PAYOUT_REPOSITORY, useClass: PrismaPayoutRepository },
  ],
  exports: [
    PrismaService,
    MERCHANT_REPOSITORY,
    AFFILIATE_REPOSITORY,
    CLICK_REPOSITORY,
    CONVERSION_REPOSITORY,
    LEDGER_REPOSITORY,
    PAYOUT_REPOSITORY,
  ],
})
export class PersistenceModule {}
