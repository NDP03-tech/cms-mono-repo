import { BaseEntity } from '../../../../shared/domain/base.entity';
import {
  BusinessRuleException,
  DomainException,
} from '../../../../shared/exceptions/domain.exception';
import { randomUUID } from 'crypto';
import { Role } from '../enums/roles.enum';
import { HashedPassword } from '../value-objects/hashed-password.vo';

export class User extends BaseEntity {
  private constructor(
    id: string,
    public readonly username: string,
    public readonly password: HashedPassword,
    public readonly role: Role,
    public readonly isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  // ─── Factory: tạo user mới ─────────────────────────────────────────────────

  static create(props: {
    id?: string;
    username: string;
    passwordHash: string;
    role: Role;
    isActive?: boolean;
  }): User {
    if (!props.username || props.username.trim().length === 0) {
      throw new DomainException('Username không được để trống');
    }

    if (props.username.trim().length < 3) {
      throw new DomainException('Username phải có ít nhất 3 ký tự');
    }

    if (!Object.values(Role).includes(props.role)) {
      throw new DomainException(`Role không hợp lệ: ${props.role}`);
    }

    const now = new Date();
    return new User(
      props.id ?? randomUUID(),
      props.username.trim().toLowerCase(),
      HashedPassword.createFromHash(props.passwordHash),
      props.role,
      props.isActive ?? true,
      now,
      now,
    );
  }

  // ─── Factory: khôi phục từ DB (không re-validate) ─────────────────────────

  static reconstitute(props: {
    id: string;
    username: string;
    passwordHash: string;
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      props.id,
      props.username,
      HashedPassword.createFromHash(props.passwordHash),
      props.role,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  // ─── Business methods ──────────────────────────────────────────────────────

  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }

  changeRole(newRole: Role): User {
    if (this.role === newRole) {
      throw new BusinessRuleException(`User đã có role ${newRole} rồi`);
    }

    return new User(
      this.id,
      this.username,
      this.password,
      newRole,
      this.isActive,
      this.createdAt,
      new Date(),
    );
  }

  changePassword(newHashedPassword: HashedPassword): User {
    return new User(
      this.id,
      this.username,
      newHashedPassword,
      this.role,
      this.isActive,
      this.createdAt,
      new Date(),
    );
  }

  deactivate(): User {
    if (!this.isActive) {
      throw new BusinessRuleException('User đã bị vô hiệu hóa rồi');
    }

    return new User(
      this.id,
      this.username,
      this.password,
      this.role,
      false,
      this.createdAt,
      new Date(),
    );
  }

  activate(): User {
    if (this.isActive) {
      throw new BusinessRuleException('User đang hoạt động rồi');
    }

    return new User(
      this.id,
      this.username,
      this.password,
      this.role,
      true,
      this.createdAt,
      new Date(),
    );
  }
}
