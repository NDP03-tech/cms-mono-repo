// src/database/seeders/seeder.ts
import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { AdminSeeder } from './admin.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule, {
    logger: false,
  });

  try {
    console.log('🌱 Starting database seeder...');
    const seeder = app.get(AdminSeeder);
    await seeder.seed();
    console.log('🎉 Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
