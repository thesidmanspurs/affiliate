import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AFFILIATE_REPOSITORY, AffiliateRepository } from '../../domain/ports';
import { generateAffiliateCode } from '../../domain/services/code-generator';
import { Affiliate } from '../../domain/entities';

export interface RegisterAffiliateInput {
  merchantId: string;
  email: string;
  password: string;
}

@Injectable()
export class RegisterAffiliateUseCase {
  constructor(
    @Inject(AFFILIATE_REPOSITORY) private readonly affiliates: AffiliateRepository,
  ) {}

  async execute(input: RegisterAffiliateInput): Promise<Affiliate> {
    const existing = await this.affiliates.findByEmail(input.merchantId, input.email);
    if (existing) throw new ConflictException('This email is already registered as an affiliate partner.');

    const passwordHash = await bcrypt.hash(input.password, 12);

    // Thử sinh code tối đa vài lần để tránh trùng (idempotent với chính DB unique constraint).
    let code = generateAffiliateCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const codeTaken = await this.affiliates.findByCode(code);
      if (!codeTaken) break;
      code = generateAffiliateCode();
    }

    return this.affiliates.create({
      merchantId: input.merchantId,
      email: input.email,
      passwordHash,
      code,
      status: 'ONBOARDING_REQUIRED',
      commissionRate: 0.2,
    });
  }
}
