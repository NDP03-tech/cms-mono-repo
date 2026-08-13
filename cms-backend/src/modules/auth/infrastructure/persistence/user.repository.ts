import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly userRepo: Repository<UserOrmEntity>;

  constructor(
    @InjectRepository(UserOrmEntity)
    repo: Repository<UserOrmEntity>,
  ) {
    this.userRepo = repo as Repository<UserOrmEntity>;
  }
  async findByIds(ids: string[]): Promise<User[]> {
    const validIds = ids
      .map((id) => id.trim())
      .filter(
        (id) =>
          id.length > 0 &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            id,
          ),
      );

    if (validIds.length === 0) return [];

    const found = await this.userRepo.find({ where: { id: In(validIds) } });
    return found.map((f) => UserMapper.toDomain(f));
  }

  async findByUsername(username: string): Promise<User | null> {
    const found: UserOrmEntity | null = await this.userRepo.findOne({
      where: { username },
    });
    if (!found) return null;
    return UserMapper.toDomain(found);
  }

  async findById(id: string): Promise<User | null> {
    const found: UserOrmEntity | null = await this.userRepo.findOne({
      where: { id },
    });
    if (!found) return null;
    return UserMapper.toDomain(found);
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count: number = await this.userRepo.count({ where: { username } });
    return count > 0;
  }

  async save(user: User): Promise<void> {
    const ormEntity: UserOrmEntity = UserMapper.toOrm(user);
    await this.userRepo.save(ormEntity);
  }
}
