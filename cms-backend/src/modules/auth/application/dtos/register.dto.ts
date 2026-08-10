// src/modules/auth/application/dtos/register.dto.ts
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterUser {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password phải có ít nhất 8 ký tự' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'Password phải có chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  password: string;
}
