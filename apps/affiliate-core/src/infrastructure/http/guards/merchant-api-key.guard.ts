import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { MERCHANT_REPOSITORY, MerchantRepository } from '../../../domain/ports';

// Dùng cho các endpoint mà PRODUCT BACKEND gọi vào (track click, record
// conversion) - không phải affiliate hay admin. Header:
//   x-merchant-api-key: <api key được cấp khi tạo Merchant>
@Injectable()
export class MerchantApiKeyGuard implements CanActivate {
  constructor(@Inject(MERCHANT_REPOSITORY) private readonly merchants: MerchantRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const apiKey = req.headers['x-merchant-api-key'];
    if (!apiKey) throw new UnauthorizedException('Thiếu x-merchant-api-key');

    const apiKeyHash = createHash('sha256').update(apiKey).digest('hex');
    const merchant = await this.merchants.findByApiKeyHash(apiKeyHash);
    if (!merchant) throw new UnauthorizedException('API key không hợp lệ');

    req.merchant = merchant;
    return true;
  }
}
