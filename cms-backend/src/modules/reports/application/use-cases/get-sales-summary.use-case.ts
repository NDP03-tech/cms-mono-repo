// src/modules/reports/application/use-cases/get-sales-summary.use-case.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockOutOrmEntity } from '../../../stock-out/infrastructure/persistence/stock-out.orm-entity';

export interface SalesSummaryFilters {
  fromDate?: string;
  toDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export interface SalesSummaryPoint {
  period: string;
  revenue: number;
  orderCount: number;
}

export interface SalesSummaryOutput {
  points: SalesSummaryPoint[];
  totalRevenue: number;
  totalOrders: number;
}

@Injectable()
export class GetSalesSummaryUseCase {
  constructor(
    @InjectRepository(StockOutOrmEntity)
    private readonly repo: Repository<StockOutOrmEntity>,
  ) {}

  /**
   * Chỉ tính doanh thu từ phiếu xuất đã APPROVED (đúng nghĩa "đã xuất thật"),
   * group theo approvedAt (không phải createdAt) — vì đó mới là thời điểm
   * doanh thu thực sự phát sinh.
   */
  async execute(
    filters: SalesSummaryFilters = {},
  ): Promise<SalesSummaryOutput> {
    const groupBy = filters.groupBy ?? 'day';
    if (!['day', 'week', 'month'].includes(groupBy)) {
      throw new Error(`Invalid groupBy: ${groupBy}`);
    }

    const qb = this.repo
      .createQueryBuilder('so')
      .select(`DATE_TRUNC('${groupBy}', so."approvedAt")`, 'period')
      .addSelect('SUM(so."totalAmount")', 'revenue')
      .addSelect('COUNT(*)', 'orderCount')
      .where('so.status = :status', { status: 'approved' })
      .groupBy('period')
      .orderBy('period', 'ASC');

    if (filters.fromDate) {
      qb.andWhere('so."approvedAt" >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }
    if (filters.toDate) {
      qb.andWhere('so."approvedAt" <= :toDate', { toDate: filters.toDate });
    }

    const rows = await qb.getRawMany<{
      period: Date;
      revenue: string;
      orderCount: string;
    }>();

    const points: SalesSummaryPoint[] = rows.map((r) => ({
      period: r.period.toISOString(),
      revenue: Number(r.revenue),
      orderCount: Number(r.orderCount),
    }));

    return {
      points,
      totalRevenue: points.reduce((sum, p) => sum + p.revenue, 0),
      totalOrders: points.reduce((sum, p) => sum + p.orderCount, 0),
    };
  }
}
