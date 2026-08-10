// src/database/seeders/admin.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserOrmEntity } from '../../modules/auth/infrastructure/orm/user.orm-entity';
import { Role } from '../../modules/auth/domain/enums/roles.enum';

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
  ) {}

  async seed(): Promise<void> {
    const adminUsername = 'admin';

    // Kiểm tra đã tồn tại chưa
    const exists = await this.userRepo.findOne({
      where: { username: adminUsername },
    });

    if (exists) {
      console.log('✅ Admin user already exists — skipping seed');
      return;
    }

    const passwordHash = await bcrypt.hash('Admin@123456', 10);

    const admin = this.userRepo.create({
      username: adminUsername,
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    });

    await this.userRepo.save(admin);

    console.log('✅ Admin user seeded successfully');
    console.log('   Username: admin');
    console.log('   Password: Admin@123456');
    console.log('   Role:     ADMIN');
  }
}
