import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { StockInModule } from './modules/stock-in/stock-in.module';
import { StockOutModule } from './modules/stock-out/stock-out.module';
import { CustomersModule } from './modules/customers/infrastructure/customers.module';
import { SuppliersModule } from './modules/suppliers/infrastructure/suppliers.module';
import { ProductsModule } from './modules/products/infrastructure/products.module';
import { ReportsModule } from './modules/reports/reports.module';
const dbType = (
  process.env.DB_TYPE || (process.env.DB_HOST ? 'postgres' : 'sqljs')
).toLowerCase();
const dbConfig =
  dbType === 'mysql'
    ? {
        type: 'mysql' as const,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        username: process.env.DB_USER || process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'your_password',
        database: process.env.DB_NAME || 'cms_db',
        autoLoadEntities: true,
        synchronize: true,
      }
    : dbType === 'postgres' || dbType === 'postgresql'
      ? {
          type: 'postgres' as const,
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT || 5432),
          username:
            process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
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
    CustomersModule,
    SuppliersModule,
    ProductsModule,
    ReportsModule,
  ],
})
export class AppModule {}
