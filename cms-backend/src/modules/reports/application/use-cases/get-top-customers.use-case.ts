// src/modules/reports/application/use-cases/get-top-customers.use-case.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StockOutOrmEntity } from '../../../stock-out/infrastructure/persistence/stock-out.orm-entity';
import { CustomerOrmEntity } from '../../../customers/infrastructure/orm/customer.orm-entity';

export interface TopCustomerRow {
  customerId: string;
  customerName: string;
  revenue: number;
  orderCount: number;
}

@Injectable()
export class GetTopCustomersUseCase {
  constructor(
    @InjectRepository(StockOutOrmEntity)
    private readonly stockOutRepo: Repository<StockOutOrmEntity>,
    @InjectRepository(CustomerOrmEntity)
    private readonly customerRepo: Repository<CustomerOrmEntity>,
  ) {}

  async execute(limit = 10): Promise<TopCustomerRow[]> {
    const rows = await this.stockOutRepo
      .createQueryBuilder('so')
      .select('so."customerId"', 'customerId')
      .addSelect('SUM(so."totalAmount")', 'revenue')
      .addSelect('COUNT(*)', 'orderCount')
      .where('so.status = :status', { status: 'approved' })
      .groupBy('so."customerId"')
      .orderBy('revenue', 'DESC')
      .limit(limit)
      .getRawMany<{
        customerId: string;
        revenue: string;
        orderCount: string;
      }>();

    if (rows.length === 0) return [];

    // Enrich tên khách hàng — cùng cách tiếp cận với FE (join thủ công vì
    // ProductOutput/CustomerOutput không tự động kèm nhau).
    const customers = await this.customerRepo.findBy({
      id: In(rows.map((r) => r.customerId)),
    });
    const nameById = new Map(customers.map((c) => [c.id, c.name]));

    return rows.map((r) => ({
      customerId: r.customerId,
      customerName: nameById.get(r.customerId) ?? r.customerId,
      revenue: Number(r.revenue),
      orderCount: Number(r.orderCount),
    }));
  }
}
