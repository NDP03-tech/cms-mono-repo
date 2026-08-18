// src/modules/reports/application/use-cases/get-dashboard-overview.use-case.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryBalanceOrmEntity } from '../../../inventory/infrastructure/persistence/inventory-balance.orm-entity';
import { StockOutOrmEntity } from '../../../stock-out/infrastructure/persistence/stock-out.orm-entity';
import { StockInOrmEntity } from '../../../stock-in/infrastructure/persistence/stock-in.orm-entity';
import { GetInventoryValuationUseCase } from './get-inventory-valuation.use-case';

export interface DashboardOverviewFilters {
  fromDate?: string;
  toDate?: string;
}

export interface DashboardOverviewOutput {
  totalStockInValue: number;
  totalStockOutValue: number;
  stockInVoucherCount: number;
  stockOutVoucherCount: number;
  productsInStockCount: number;
  totalInventoryValue: number;
}

@Injectable()
export class GetDashboardOverviewUseCase {
  constructor(
    @InjectRepository(StockInOrmEntity)
    private readonly stockInRepo: Repository<StockInOrmEntity>,
    @InjectRepository(StockOutOrmEntity)
    private readonly stockOutRepo: Repository<StockOutOrmEntity>,
    @InjectRepository(InventoryBalanceOrmEntity)
    private readonly balanceRepo: Repository<InventoryBalanceOrmEntity>,
    private readonly inventoryValuation: GetInventoryValuationUseCase,
  ) {}

  async execute(
    filters: DashboardOverviewFilters = {},
  ): Promise<DashboardOverviewOutput> {
    const inQb = this.stockInRepo
      .createQueryBuilder('si')
      .select('COALESCE(SUM(si."totalAmount"), 0)', 'value')
      .addSelect('COUNT(*)', 'count')
      .where('si.status = :status', { status: 'approved' });

    const outQb = this.stockOutRepo
      .createQueryBuilder('so')
      .select('COALESCE(SUM(so."totalAmount"), 0)', 'value')
      .addSelect('COUNT(*)', 'count')
      .where('so.status = :status', { status: 'approved' });

    if (filters.fromDate) {
      inQb.andWhere('si."approvedAt" >= :fromDate', {
        fromDate: filters.fromDate,
      });
      outQb.andWhere('so."approvedAt" >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }
    if (filters.toDate) {
      inQb.andWhere('si."approvedAt" <= :toDate', { toDate: filters.toDate });
      outQb.andWhere('so."approvedAt" <= :toDate', {
        toDate: filters.toDate,
      });
    }

    const [inResult, outResult, productsInStockCount, valuation] =
      await Promise.all([
        inQb.getRawOne<{ value: string; count: string }>(),
        outQb.getRawOne<{ value: string; count: string }>(),
        this.balanceRepo
          .createQueryBuilder('b')
          .where('b.quantity > 0')
          .getCount(),
        this.inventoryValuation.execute(),
      ]);

    return {
      totalStockInValue: Number(inResult?.value ?? 0),
      totalStockOutValue: Number(outResult?.value ?? 0),
      stockInVoucherCount: Number(inResult?.count ?? 0),
      stockOutVoucherCount: Number(outResult?.count ?? 0),
      productsInStockCount,
      totalInventoryValue: valuation.totalValue,
    };
  }
}
