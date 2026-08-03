import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { StockInModule } from './modules/stock-in/stock-in.module';
import { StockOutModule } from './modules/stock-out/stock-out.module';

const isMysql =
  (
    process.env.DB_TYPE || (process.env.DB_HOST ? 'mysql' : 'sqljs')
  ).toLowerCase() === 'mysql';
const dbConfig = isMysql
  ? {
      type: 'mysql' as const,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'your_password',
      database: process.env.DB_NAME || 'cms_db',
      autoLoadEntities: true,
      synchronize: true,
    }
  : {
      type: 'sqljs' as const,
      autoLoadEntities: true,
      synchronize: true,
      autoSave: false,
    };

@Module({
  imports: [
    AuthModule,
    InventoryModule,
    TypeOrmModule.forRoot(dbConfig as never),
    StockInModule,
    StockOutModule,
  ],
})
export class AppModule {}
