// user.repository.interface.ts
import { User } from '../entities/user.entity';
import { Role } from '../enums/roles.enum';

export interface UserFilters {
  role?: Role;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByIds(ids: string[]): Promise<User[]>;
  findByUsername(username: string): Promise<User | null>;
  existsByUsername(username: string): Promise<boolean>;
  findAll(filters?: UserFilters): Promise<User[]>; // ← MỚI — cần thêm implementation ở UserRepository
  save(user: User): Promise<void>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
