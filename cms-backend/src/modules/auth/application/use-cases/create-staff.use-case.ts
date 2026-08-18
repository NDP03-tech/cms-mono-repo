// application/use-cases/create-staff.use-case.ts
import {
  Inject,
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { HashedPassword } from '../../domain/value-objects/hashed-password.vo';
import { CreateStaffInput } from '../dtos/create-staff.input';
import { UserOutput } from '../dtos/user.output';

@Injectable()
export class CreateStaffUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateStaffInput): Promise<UserOutput> {
    const exists = await this.userRepository.existsByUsername(input.username);
    if (exists) {
      throw new ConflictException('Username đã tồn tại trên hệ thống');
    }

    // RegisterUseCase hiện tại KHÔNG validate độ mạnh password (bỏ qua
    // HashedPassword.createFromPlain, hash thẳng bằng bcrypt). Ở đây mình
    // chủ động validate bằng đúng rule đã định nghĩa sẵn trong domain VO
    // (hoa/thường/số/ký tự đặc biệt, tối thiểu 8 ký tự) — vì đây là admin
    // đặt mật khẩu tạm cho người khác, nên càng cần chắc mật khẩu đủ mạnh.
    try {
      HashedPassword.createFromPlain(input.password);
    } catch (err) {
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Mật khẩu không hợp lệ',
      );
    }

    // Hash bằng bcrypt trực tiếp — giữ nhất quán với RegisterUseCase hiện
    // có, vì IPasswordHasher (dùng trong HashedPassword.toHash()) chưa xác
    // nhận có được wire vào DI container hay chưa.
    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = User.create({
      username: input.username,
      passwordHash,
      role: input.role,
      isActive: input.isActive ?? true,
      fullName: input.fullName,
    });

    await this.userRepository.save(user);
    return UserOutput.from(user);
  }
}
