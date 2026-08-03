import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm/user.orm-entity';

export class UserMapper {
  public static toDomain(orm: UserOrmEntity): User {
    return User.reconstitute({
      id: orm.id,
      username: orm.username,
      passwordHash: orm.passwordHash,
      role: orm.role,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  public static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.username = user.username;
    orm.passwordHash = user.password.getValue();
    orm.role = user.role;
    orm.isActive = user.isActive;
    return orm;
  }
}
