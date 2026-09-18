import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { RegisterAffiliateUseCase } from '../../../application/use-cases/register-affiliate.usecase';
import { AffiliateAuthService } from '../../auth/affiliate-auth.service';

class RegisterDto {
  @IsString() merchantId: string;
  @IsEmail() email: string;
  @MinLength(8) password: string;
}

class LoginDto {
  @IsString() merchantId: string;
  @IsEmail() email: string;
  @IsString() password: string;
}

// Public - không cần guard. Affiliate tự đăng ký/đăng nhập, tách biệt hoàn
// toàn khỏi hệ thống auth của bất kỳ sản phẩm nào (xem AffiliateAuthModule).
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerAffiliate: RegisterAffiliateUseCase,
    private readonly authService: AffiliateAuthService,
  ) {}

  @ApiOperation({ summary: 'Affiliate tự đăng ký (trạng thái mặc định PENDING_REVIEW)' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerAffiliate.execute(dto);
  }

  @ApiOperation({ summary: 'Đăng nhập affiliate, trả về JWT scope riêng cho affiliate platform' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.merchantId, dto.email, dto.password);
  }
}
