import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
