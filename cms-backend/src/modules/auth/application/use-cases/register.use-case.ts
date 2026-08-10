import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { RegisterUser } from '../dtos/register.dto';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from '../../domain/enums/roles.enum';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterUser): Promise<void> {
    console.log('=== REGISTER DEBUG ===');
    console.log('1. dto received:', dto);
    console.log('2. dto.username:', dto?.username);
    console.log(
      '3. dto.password:',
      dto?.password ? '***exists***' : 'undefined',
    );
    console.log('4. typeof dto:', typeof dto);

    const existingUser = await this.userRepository.findByUsername(dto.username);
    console.log('5. existingUser:', !!existingUser);

    if (existingUser) {
      throw new ConflictException('Tài khoản này đã tồn tại trên hệ thống!');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    console.log('6. hashedPassword generated:', !!hashedPassword);

    const newUser = User.create({
      username: dto.username,
      passwordHash: hashedPassword,
      role: Role.STAFF,
      isActive: true,
    });
    console.log('7. newUser created:', newUser.username);

    await this.userRepository.save(newUser);
    console.log('8. user saved successfully');
  }
}
