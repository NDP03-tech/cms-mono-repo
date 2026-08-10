// src/database/seeders/seeder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { UserOrmEntity } from '../../modules/auth/infrastructure/orm/user.orm-entity';
import { AdminSeeder } from './admin.seeder';

// Load env file dựa theo NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
config({ path: join(process.cwd(), envFile) });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      entities: [UserOrmEntity],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  providers: [AdminSeeder],
})
export class SeederModule {}
