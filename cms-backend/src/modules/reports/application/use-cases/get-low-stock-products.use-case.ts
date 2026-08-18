// src/modules/reports/application/use-cases/get-low-stock-products.use-case.ts
//
// ProductOrmEntity trong context không có sẵn field "minStock", nên dùng một
// ngưỡng (threshold) truyền vào từ query param, mặc định 10. Nếu product đã
// có sẵn field ngưỡng tồn tối thiểu riêng (vd. minStock), thay dòng
// `threshold` bên dưới bằng `product?.minStock ?? defaultThreshold` để mỗi
// sản phẩm có ngưỡng riêng.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryBalanceOrmEntity } from '../../../inventory/infrastructure/persistence/inventory-balance.orm-entity';
import { ProductOrmEntity } from '../../../products/infrastructure/orm/product.orm-entity';

export interface LowStockRow {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  threshold: number;
  status: 'low' | 'out';
}

@Injectable()
export class GetLowStockProductsUseCase {
  constructor(
    @InjectRepository(InventoryBalanceOrmEntity)
    private readonly balanceRepo: Repository<InventoryBalanceOrmEntity>,
    @InjectRepository(ProductOrmEntity)
    private readonly productRepo: Repository<ProductOrmEntity>,
  ) {}

  async execute(threshold = 10): Promise<LowStockRow[]> {
    const balances = await this.balanceRepo
      .createQueryBuilder('b')
      .where('b.quantity <= :threshold', { threshold })
      .orderBy('b.quantity', 'ASC')
      .getMany();

    if (balances.length === 0) return [];

    const products = await this.productRepo.findBy({
      id: In(balances.map((b) => b.productId)),
    });
    const productById = new Map(products.map((p) => [p.id, p]));

    return balances.map((b) => {
      const product = productById.get(b.productId);
      const quantity = Number(b.quantity);
      return {
        productId: b.productId,
        productName: product?.name ?? b.productId,
        sku: product?.sku ?? '—',
        quantity,
        threshold,
        status: quantity <= 0 ? 'out' : 'low',
      };
    });
  }
}
