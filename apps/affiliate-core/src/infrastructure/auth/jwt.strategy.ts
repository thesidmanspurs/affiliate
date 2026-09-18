import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AffiliateJwtPayload } from './affiliate-auth.service';

@Injectable()
export class AffiliateJwtStrategy extends PassportStrategy(Strategy, 'affiliate-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AFFILIATE_JWT_SECRET,
    });
  }

  // Giá trị return sẽ gắn vào request.user - dùng trong controller qua @Req().
  async validate(payload: AffiliateJwtPayload) {
    return { affiliateId: payload.sub, merchantId: payload.merchantId };
  }
}
