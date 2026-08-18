// src/modules/reports/reports.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ============================================================
// ORM ENTITIES
// ============================================================

// Stock In
import { StockInOrmEntity } from '../stock-in/infrastructure/persistence/stock-in.orm-entity';
import { StockInItemOrmEntity } from '../stock-in/infrastructure/persistence/stock-in-item.orm-entity';

// Stock Out
import { StockOutOrmEntity } from '../stock-out/infrastructure/persistence/stock-out.orm-entity';
import { StockOutItemOrmEntity } from '../stock-out/infrastructure/persistence/stock-out-item.orm-entity';

// Inventory
import { InventoryBalanceOrmEntity } from '../inventory/infrastructure/persistence/inventory-balance.orm-entity';

// Product
import { ProductOrmEntity } from '../products/infrastructure/orm/product.orm-entity';

// Customer
import { CustomerOrmEntity } from '../customers/infrastructure/orm/customer.orm-entity';

// Supplier
import { SupplierOrmEntity } from '../suppliers/infrastructure/persistence/supplier.orm-entity';

// ============================================================
// CONTROLLER
// ============================================================

import { ReportsController } from './presentation/reports.controller';

// ============================================================
// USE CASES
// ============================================================

import { GetDashboardOverviewUseCase } from './application/use-cases/get-dashboard-overview.use-case';
import { GetSalesSummaryUseCase } from './application/use-cases/get-sales-summary.use-case';
import { GetTopCustomersUseCase } from './application/use-cases/get-top-customers.use-case';
import { GetTopProductsUseCase } from './application/use-cases/get-top-products.use-case';
import { GetStockInSummaryUseCase } from './application/use-cases/get-stock-in-summary.use-case';
import { GetStockInBySupplierUseCase } from './application/use-cases/get-stock-in-by-supplier.use-case';
import { GetInventoryValuationUseCase } from './application/use-cases/get-inventory-valuation.use-case';
import { GetInventoryMovementUseCase } from './application/use-cases/get-inventory-movement.use-case';
import { GetLowStockProductsUseCase } from './application/use-cases/get-low-stock-products.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Stock In
      StockInOrmEntity,
      StockInItemOrmEntity,

      // Stock Out
      StockOutOrmEntity,
      StockOutItemOrmEntity,

      // Inventory
      InventoryBalanceOrmEntity,

      // Product
      ProductOrmEntity,

      // Customer
      CustomerOrmEntity,

      // Supplier
      SupplierOrmEntity,
    ]),
  ],

  controllers: [ReportsController],

  providers: [
    GetDashboardOverviewUseCase,
    GetSalesSummaryUseCase,
    GetTopCustomersUseCase,
    GetTopProductsUseCase,
    GetStockInSummaryUseCase,
    GetStockInBySupplierUseCase,
    GetInventoryValuationUseCase,
    GetInventoryMovementUseCase,
    GetLowStockProductsUseCase,
  ],
})
export class ReportsModule {}
