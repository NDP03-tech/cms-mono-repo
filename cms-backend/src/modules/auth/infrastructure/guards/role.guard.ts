// src/modules/auth/infrastructure/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Bóc nhãn đặt từ Decorator @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu API không dán nhãn quyền -> Cho phép truy cập tự do
    if (!requiredRoles) {
      return true;
    }

    // 2. Lấy user từ request (Do JwtStrategy nạp sẵn vào sau khi xác thực thành công)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 3. Kiểm tra xem user có quyền hợp lệ không
    const hasPermission =
      user && user.role && requiredRoles.includes(user.role);

    if (!hasPermission) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập vào tính năng này!',
      );
    }

    return true;
  }
}
