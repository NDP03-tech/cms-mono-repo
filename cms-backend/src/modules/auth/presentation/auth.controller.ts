import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { LoginDto } from '../application/dtos/login.dto';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { RegisterUser } from '../application/dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterUser) {
    return this.registerUseCase.execute(dto);
  }
}
