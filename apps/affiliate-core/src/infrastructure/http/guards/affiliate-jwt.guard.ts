import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Dùng cho các endpoint tự-phục-vụ của affiliate (dashboard: xem stats,
// yêu cầu payout...). Áp dụng strategy 'affiliate-jwt' đã đăng ký ở
// AffiliateAuthModule - hoàn toàn tách biệt guard/JWT của bất kỳ sản phẩm nào.
@Injectable()
export class AffiliateJwtGuard extends AuthGuard('affiliate-jwt') {}
