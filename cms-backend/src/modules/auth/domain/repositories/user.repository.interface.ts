// user.repository.interface.ts
import { User } from '../entities/user.entity';

// domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByIds(ids: string[]): Promise<User[]>; // ← thêm mới
  findByUsername(username: string): Promise<User | null>;
  existsByUsername(username: string): Promise<boolean>;
  save(user: User): Promise<void>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
