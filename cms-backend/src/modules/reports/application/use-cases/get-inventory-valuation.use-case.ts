// src/modules/reports/application/use-cases/get-inventory-valuation.use-case.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryBalanceOrmEntity } from '../../../inventory/infrastructure/persistence/inventory-balance.orm-entity';
import { ProductOrmEntity } from '../../../products/infrastructure/orm/product.orm-entity';

export interface InventoryValuationRow {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  costPrice: number;
  currency: string;
  value: number;
}

export interface InventoryValuationOutput {
  rows: InventoryValuationRow[];
  totalValue: number;
}

@Injectable()
export class GetInventoryValuationUseCase {
  constructor(
    @InjectRepository(InventoryBalanceOrmEntity)
    private readonly balanceRepo: Repository<InventoryBalanceOrmEntity>,
    @InjectRepository(ProductOrmEntity)
    private readonly productRepo: Repository<ProductOrmEntity>,
  ) {}

  /**
   * Giá trị tồn kho = quantity hiện tại * costPrice của sản phẩm.
   * Chỉ tính sản phẩm có quantity > 0 để báo cáo gọn, không rác các dòng 0.
   */
  async execute(): Promise<InventoryValuationOutput> {
    const balances = await this.balanceRepo
      .createQueryBuilder('b')
      .where('b.quantity > 0')
      .orderBy('b.quantity', 'DESC')
      .getMany();

    if (balances.length === 0) return { rows: [], totalValue: 0 };

    const products = await this.productRepo.findBy({
      id: In(balances.map((b) => b.productId)),
    });
    const productById = new Map(products.map((p) => [p.id, p]));

    const rows: InventoryValuationRow[] = balances.map((b) => {
      const product = productById.get(b.productId);
      const costPrice = Number(product?.amount ?? 0);
      return {
        productId: b.productId,
        productName: product?.name ?? b.productId,
        sku: product?.sku ?? '—',
        quantity: Number(b.quantity),
        costPrice,
        currency: product?.currency ?? 'VND',
        value: Number(b.quantity) * costPrice,
      };
    });

    return {
      rows,
      totalValue: rows.reduce((sum, r) => sum + r.value, 0),
    };
  }
}
