// src/modules/auth/application/dtos/login.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}
