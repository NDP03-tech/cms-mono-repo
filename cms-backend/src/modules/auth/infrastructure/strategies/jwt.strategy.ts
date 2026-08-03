// src/modules/auth/infrastructure/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Chỉ định lấy Token từ thuộc tính Authorization: Bearer <Token> trong Header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Bật tính năng kiểm tra thời hạn Token (Hết hạn là chặn luôn)
      secretOrKey: 'phuc2112003', // ⚠️ Thay bằng chuỗi mã hóa bảo mật của bạn
    });
  }

  // 2. Sau khi Token hợp lệ, dữ liệu thô (Payload) nằm trong Token sẽ chảy vào hàm này
  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Token không hợp lệ!');
    }
    // 🌟 Dữ liệu return ở đây sẽ được NestJS tự động nạp vào biến `request.user`
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role, // Trích xuất Role để tí nữa RolesGuard xài
    };
  }
}
