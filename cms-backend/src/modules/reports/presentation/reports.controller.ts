// src/modules/reports/presentation/reports.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/role.guard';
import { Roles } from '../../../shared/decorators/role.decorator';
import { Role } from '../../auth/domain/enums/roles.enum';
import { type SalesSummaryFilters } from '../application/use-cases/get-sales-summary.use-case';
import { type StockInSummaryFilters } from '../application/use-cases/get-stock-in-summary.use-case';
import { type InventoryMovementFilters } from '../application/use-cases/get-inventory-movement.use-case';
import { type DashboardOverviewFilters } from '../application/use-cases/get-dashboard-overview.use-case';

import { GetInventoryValuationUseCase } from '../application/use-cases/get-inventory-valuation.use-case';
import { GetSalesSummaryUseCase } from '../application/use-cases/get-sales-summary.use-case';
import { GetTopCustomersUseCase } from '../application/use-cases/get-top-customers.use-case';
import { GetTopProductsUseCase } from '../application/use-cases/get-top-products.use-case';

import { GetStockInSummaryUseCase } from '../application/use-cases/get-stock-in-summary.use-case';
import { GetStockInBySupplierUseCase } from '../application/use-cases/get-stock-in-by-supplier.use-case';
import { GetInventoryMovementUseCase } from '../application/use-cases/get-inventory-movement.use-case';
import { GetLowStockProductsUseCase } from '../application/use-cases/get-low-stock-products.use-case';
import { GetDashboardOverviewUseCase } from '../application/use-cases/get-dashboard-overview.use-case';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ReportsController {
  constructor(
    // Tổng quan
    private readonly dashboardOverview: GetDashboardOverviewUseCase,

    // Xuất kho (đã có sẵn)
    private readonly salesSummary: GetSalesSummaryUseCase,
    private readonly topCustomers: GetTopCustomersUseCase,
    private readonly topProducts: GetTopProductsUseCase,

    // Nhập kho (mới)
    private readonly stockInSummary: GetStockInSummaryUseCase,
    private readonly stockInBySupplier: GetStockInBySupplierUseCase,

    // Tồn kho
    private readonly inventoryValuation: GetInventoryValuationUseCase,
    private readonly inventoryMovement: GetInventoryMovementUseCase,
    private readonly lowStockProducts: GetLowStockProductsUseCase,
  ) {}

  // ===== Tổng quan =====
  @Get('overview')
  getOverview(@Query() query: DashboardOverviewFilters) {
    return this.dashboardOverview.execute(query);
  }

  // ===== Xuất kho =====
  @Get('sales-summary')
  getSalesSummary(@Query() query: SalesSummaryFilters) {
    return this.salesSummary.execute(query);
  }

  @Get('top-customers')
  getTopCustomers(@Query('limit') limit?: string) {
    return this.topCustomers.execute(limit ? Number(limit) : undefined);
  }

  @Get('top-products')
  getTopProducts(@Query('limit') limit?: string) {
    return this.topProducts.execute(limit ? Number(limit) : undefined);
  }

  // ===== Nhập kho =====
  @Get('stock-in-summary')
  getStockInSummary(@Query() query: StockInSummaryFilters) {
    return this.stockInSummary.execute(query);
  }

  @Get('stock-in-by-supplier')
  getStockInBySupplier(@Query('limit') limit?: string) {
    return this.stockInBySupplier.execute(limit ? Number(limit) : undefined);
  }

  // ===== Tồn kho =====
  @Get('inventory-valuation')
  getInventoryValuation() {
    return this.inventoryValuation.execute();
  }

  @Get('inventory-movement')
  getInventoryMovement(@Query() query: InventoryMovementFilters) {
    return this.inventoryMovement.execute(query);
  }

  @Get('low-stock')
  getLowStock(@Query('threshold') threshold?: string) {
    return this.lowStockProducts.execute(
      threshold ? Number(threshold) : undefined,
    );
  }
}
