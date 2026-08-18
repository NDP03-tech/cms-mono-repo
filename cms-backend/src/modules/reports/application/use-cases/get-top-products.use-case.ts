// src/modules/reports/application/use-cases/get-top-products.use-case.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StockOutItemOrmEntity } from '../../../stock-out/infrastructure/persistence/stock-out-item.orm-entity';
import { ProductOrmEntity } from '../../../products/infrastructure/orm/product.orm-entity';

export interface TopProductRow {
  productId: string;
  productName: string;
  sku: string;
  totalQuantity: number;
  totalRevenue: number;
}

@Injectable()
export class GetTopProductsUseCase {
  constructor(
    @InjectRepository(StockOutItemOrmEntity)
    private readonly itemRepo: Repository<StockOutItemOrmEntity>,
    @InjectRepository(ProductOrmEntity)
    private readonly productRepo: Repository<ProductOrmEntity>,
  ) {}

  async execute(limit = 10): Promise<TopProductRow[]> {
    const rows = await this.itemRepo
      .createQueryBuilder('item')
      .innerJoin('stock_out', 'so', 'so.id = item."stockOutId"')
      .select('item."productId"', 'productId')
      .addSelect('SUM(item.quantity)', 'totalQuantity')
      .addSelect('SUM(item."totalPrice")', 'totalRevenue')
      .where('so.status = :status', { status: 'approved' })
      .groupBy('item."productId"')
      .orderBy('"totalQuantity"', 'DESC')
      .limit(limit)
      .getRawMany<{
        productId: string;
        totalQuantity: string;
        totalRevenue: string;
      }>();

    if (rows.length === 0) return [];

    const products = await this.productRepo.findBy({
      id: In(rows.map((r) => r.productId)),
    });
    const productById = new Map(products.map((p) => [p.id, p]));

    return rows.map((r) => {
      const product = productById.get(r.productId);
      return {
        productId: r.productId,
        productName: product?.name ?? r.productId,
        sku: product?.sku ?? '—',
        totalQuantity: Number(r.totalQuantity),
        totalRevenue: Number(r.totalRevenue),
      };
    });
  }
}
