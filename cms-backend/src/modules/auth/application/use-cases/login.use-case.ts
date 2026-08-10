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
    const username = dto.username?.trim().toLowerCase();

    console.log('=== LOGIN DEBUG ===');
    console.log('1. username input:', username);
    console.log('2. password input:', dto.password);

    const user = await this.userRepository.findByUsername(username);

    console.log('3. user found:', !!user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('4. user.username:', user.username);
    console.log('5. storedHash:', user.password.getValue());

    const storedHash = user.password.getValue();
    const isMatch = await bcrypt.compare(dto.password, storedHash);

    console.log('6. isMatch:', isMatch);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
