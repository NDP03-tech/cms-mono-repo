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
import { UsersController } from '../presentation/users.controller';
import { ActivateUserUseCase } from '../application/use-cases/activate-user.use-case';
import { ChangeUserRoleUseCase } from '../application/use-cases/change-user-role.use-case';
import { CreateStaffUseCase } from '../application/use-cases/create-staff.use-case';
import { DeactivateUserUseCase } from '../application/use-cases/deactivate-user.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'phuc2112003', // Phải khớp với chuỗi ở JwtStrategy
      signOptions: { expiresIn: '12h' }, // Thời hạn Token phát ra (Ví dụ: 1 tiếng)
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    JwtStrategy,
    ActivateUserUseCase,
    ChangeUserRoleUseCase,
    CreateStaffUseCase,
    DeactivateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [PassportModule, JwtModule, USER_REPOSITORY],
})
export class AuthModule {}
