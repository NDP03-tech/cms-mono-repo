// src/modules/auth/application/use-cases/login.use-case.ts
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { LoginDto } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt'; // 🌟 1. Import JwtService chính thống của NestJS
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import * as bcrypt from 'bcryptjs';

export interface TokenResponseDto {
  accessToken: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    // 🌟 2. Inject JwtService vào đây để ký sinh mã Token bảo mật
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<TokenResponseDto> {
    // Chuẩn hóa username
    const username = dto.username?.trim().toLowerCase();

    if (!username || !dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Tìm user
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Lấy password đã hash trong Domain Entity
    const storedHash = user.password.getValue();

    // So sánh password
    const isMatch = await bcrypt.compare(dto.password, storedHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Payload JWT
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    // Sinh Access Token
    const accessToken = this.jwtService.sign(payload);

    // Trả về cho client
    return {
      accessToken,
    };
  }
}
