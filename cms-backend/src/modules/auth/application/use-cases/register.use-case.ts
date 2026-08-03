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
    const existingUser = await this.userRepository.findByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException('Tài khoản này đã tồn tại trên hệ thống!');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // Bước 3: Tạo mới một Entity Domain (Đúng chuẩn nghiệp vụ DDD)
    const newUser = User.create({
      username: dto.username,
      passwordHash: hashedPassword,
      role: Role.STAFF, // Gán quyền mặc định khi mới đăng ký
      isActive: true,
    });

    // Bước 4: Đẩy qua Repository để lưu xuống DB (Repo sẽ tự dùng Mapper để dịch sang OrmEntity)
    await this.userRepository.save(newUser);
  }
}
