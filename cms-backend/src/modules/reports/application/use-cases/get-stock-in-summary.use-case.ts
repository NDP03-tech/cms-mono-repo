// src/modules/reports/application/use-cases/get-stock-in-summary.use-case.ts
//
// GIẢ ĐỊNH SCHEMA: mình không có file StockInOrmEntity trong context, nên đoán
// theo đúng convention của StockOutOrmEntity (status/approvedAt/totalAmount).
// Nếu tên bảng/cột hoặc đường dẫn entity khác, chỉ cần sửa lại import + tên cột.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockInOrmEntity } from '../../../stock-in/infrastructure/persistence/stock-in.orm-entity';

export interface StockInSummaryFilters {
  fromDate?: string;
  toDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export interface StockInSummaryPoint {
  period: string;
  value: number;
  voucherCount: number;
}

export interface StockInSummaryOutput {
  points: StockInSummaryPoint[];
  totalValue: number;
  totalVouchers: number;
}

@Injectable()
export class GetStockInSummaryUseCase {
  constructor(
    @InjectRepository(StockInOrmEntity)
    private readonly repo: Repository<StockInOrmEntity>,
  ) {}

  /**
   * Chỉ tính phiếu nhập đã APPROVED, group theo approvedAt — cùng logic với
   * GetSalesSummaryUseCase (báo cáo xuất kho) để hai bên nhất quán.
   */
  async execute(
    filters: StockInSummaryFilters = {},
  ): Promise<StockInSummaryOutput> {
    const groupBy = filters.groupBy ?? 'day';
    if (!['day', 'week', 'month'].includes(groupBy)) {
      throw new Error(`Invalid groupBy: ${groupBy}`);
    }

    const qb = this.repo
      .createQueryBuilder('si')
      .select(`DATE_TRUNC('${groupBy}', si."approvedAt")`, 'period')
      .addSelect('SUM(si."totalAmount")', 'value')
      .addSelect('COUNT(*)', 'voucherCount')
      .where('si.status = :status', { status: 'approved' })
      .groupBy('period')
      .orderBy('period', 'ASC');

    if (filters.fromDate) {
      qb.andWhere('si."approvedAt" >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }
    if (filters.toDate) {
      qb.andWhere('si."approvedAt" <= :toDate', { toDate: filters.toDate });
    }

    const rows = await qb.getRawMany<{
      period: Date;
      value: string;
      voucherCount: string;
    }>();

    const points: StockInSummaryPoint[] = rows.map((r) => ({
      period: r.period.toISOString(),
      value: Number(r.value),
      voucherCount: Number(r.voucherCount),
    }));

    return {
      points,
      totalValue: points.reduce((sum, p) => sum + p.value, 0),
      totalVouchers: points.reduce((sum, p) => sum + p.voucherCount, 0),
    };
  }
}
