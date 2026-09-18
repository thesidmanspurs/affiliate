import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AffiliateAuthService } from './affiliate-auth.service';
import { AffiliateJwtStrategy } from './jwt.strategy';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [
    PersistenceModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.AFFILIATE_JWT_SECRET, // secret RIÊNG cho affiliate platform
      signOptions: { expiresIn: process.env.AFFILIATE_JWT_EXPIRES_IN ?? '7d' },
    }),
  ],
  providers: [AffiliateAuthService, AffiliateJwtStrategy],
  exports: [AffiliateAuthService],
})
export class AffiliateAuthModule {}
