// user.repository.interface.ts
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  existsByUsername(username: string): Promise<boolean>;
  save(user: User): Promise<void>; // ✅ void, không trả về User
}

export const USER_REPOSITORY = Symbol('IUserRepository');
