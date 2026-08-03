import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../presentation/auth.controller';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { UserRepository } from './persistence/user.repository';
import { UserOrmEntity } from './orm/user.orm-entity';
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'phuc2112003', // Phải khớp với chuỗi ở JwtStrategy
      signOptions: { expiresIn: '12h' }, // Thời hạn Token phát ra (Ví dụ: 1 tiếng)
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    JwtStrategy,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
