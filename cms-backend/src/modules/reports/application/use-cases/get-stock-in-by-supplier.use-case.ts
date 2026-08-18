// src/modules/reports/application/use-cases/get-stock-in-by-supplier.use-case.ts
//
// GIẢ ĐỊNH SCHEMA: đoán SupplierOrmEntity có id/name giống CustomerOrmEntity,
// và StockInOrmEntity có supplierId. Sửa lại import/tên cột nếu khác.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StockInOrmEntity } from '../../../stock-in/infrastructure/persistence/stock-in.orm-entity';
import { SupplierOrmEntity } from '../../../suppliers/infrastructure/persistence/supplier.orm-entity';

export interface StockInBySupplierRow {
  supplierId: string;
  supplierName: string;
  value: number;
  voucherCount: number;
}

@Injectable()
export class GetStockInBySupplierUseCase {
  constructor(
    @InjectRepository(StockInOrmEntity)
    private readonly stockInRepo: Repository<StockInOrmEntity>,
    @InjectRepository(SupplierOrmEntity)
    private readonly supplierRepo: Repository<SupplierOrmEntity>,
  ) {}

  async execute(limit = 10): Promise<StockInBySupplierRow[]> {
    const rows = await this.stockInRepo
      .createQueryBuilder('si')
      .select('si."supplierId"', 'supplierId')
      .addSelect('SUM(si."totalAmount")', 'value')
      .addSelect('COUNT(*)', 'voucherCount')
      .where('si.status = :status', { status: 'approved' })
      .groupBy('si."supplierId"')
      .orderBy('value', 'DESC')
      .limit(limit)
      .getRawMany<{
        supplierId: string;
        value: string;
        voucherCount: string;
      }>();

    if (rows.length === 0) return [];

    const suppliers = await this.supplierRepo.findBy({
      id: In(rows.map((r) => r.supplierId)),
    });
    const nameById = new Map(suppliers.map((s) => [s.id, s.name]));

    return rows.map((r) => ({
      supplierId: r.supplierId,
      supplierName: nameById.get(r.supplierId) ?? r.supplierId,
      value: Number(r.value),
      voucherCount: Number(r.voucherCount),
    }));
  }
}
