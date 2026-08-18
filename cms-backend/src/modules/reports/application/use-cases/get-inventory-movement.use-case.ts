// src/modules/reports/application/use-cases/get-inventory-movement.use-case.ts
//
// GIẢ ĐỊNH SCHEMA: StockInItemOrmEntity có shape giống StockOutItemOrmEntity
// (stockInId, productId, quantity, totalPrice), join qua bảng stock_in. Sửa
// lại tên bảng/cột nếu khác.
//
// Vì hệ thống không lưu snapshot tồn kho theo ngày, "tồn cuối kỳ" lấy từ
// InventoryBalance hiện tại, rồi suy ngược ra "tồn đầu kỳ" = tồn cuối - nhập
// trong kỳ + xuất trong kỳ. Cách này đúng miễn là InventoryBalance phản ánh
// đúng tồn tại thời điểm gọi API (tức toDate ~ hiện tại). Nếu cần tồn kho
// chính xác tại một mốc quá khứ, hệ thống sẽ cần bảng snapshot riêng.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryBalanceOrmEntity } from '../../../inventory/infrastructure/persistence/inventory-balance.orm-entity';
import { ProductOrmEntity } from '../../../products/infrastructure/orm/product.orm-entity';
import { StockInItemOrmEntity } from '../../../stock-in/infrastructure/persistence/stock-in-item.orm-entity';
import { StockOutItemOrmEntity } from '../../../stock-out/infrastructure/persistence/stock-out-item.orm-entity';

export interface InventoryMovementFilters {
  fromDate?: string;
  toDate?: string;
}

export interface InventoryMovementRow {
  productId: string;
  productName: string;
  sku: string;
  openingQuantity: number;
  inQuantity: number;
  outQuantity: number;
  closingQuantity: number;
}

@Injectable()
export class GetInventoryMovementUseCase {
  constructor(
    @InjectRepository(InventoryBalanceOrmEntity)
    private readonly balanceRepo: Repository<InventoryBalanceOrmEntity>,
    @InjectRepository(ProductOrmEntity)
    private readonly productRepo: Repository<ProductOrmEntity>,
    @InjectRepository(StockInItemOrmEntity)
    private readonly stockInItemRepo: Repository<StockInItemOrmEntity>,
    @InjectRepository(StockOutItemOrmEntity)
    private readonly stockOutItemRepo: Repository<StockOutItemOrmEntity>,
  ) {}

  async execute(
    filters: InventoryMovementFilters = {},
  ): Promise<InventoryMovementRow[]> {
    const balances = await this.balanceRepo.find();
    if (balances.length === 0) return [];

    const productIds = balances.map((b) => b.productId);

    const inQb = this.stockInItemRepo
      .createQueryBuilder('item')
      .innerJoin('stock_in', 'si', 'si.id = item."stockInId"')
      .select('item."productId"', 'productId')
      .addSelect('SUM(item.quantity)', 'quantity')
      .where('si.status = :status', { status: 'approved' })
      .andWhere('item."productId" IN (:...productIds)', { productIds })
      .groupBy('item."productId"');

    const outQb = this.stockOutItemRepo
      .createQueryBuilder('item')
      .innerJoin('stock_out', 'so', 'so.id = item."stockOutId"')
      .select('item."productId"', 'productId')
      .addSelect('SUM(item.quantity)', 'quantity')
      .where('so.status = :status', { status: 'approved' })
      .andWhere('item."productId" IN (:...productIds)', { productIds })
      .groupBy('item."productId"');

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

    const [inRows, outRows, products] = await Promise.all([
      inQb.getRawMany<{ productId: string; quantity: string }>(),
      outQb.getRawMany<{ productId: string; quantity: string }>(),
      this.productRepo.findBy({ id: In(productIds) }),
    ]);

    const inByProduct = new Map(
      inRows.map((r) => [r.productId, Number(r.quantity)]),
    );
    const outByProduct = new Map(
      outRows.map((r) => [r.productId, Number(r.quantity)]),
    );
    const productById = new Map(products.map((p) => [p.id, p]));

    return balances
      .map((b) => {
        const product = productById.get(b.productId);
        const closingQuantity = Number(b.quantity);
        const inQuantity = inByProduct.get(b.productId) ?? 0;
        const outQuantity = outByProduct.get(b.productId) ?? 0;
        const openingQuantity = closingQuantity - inQuantity + outQuantity;

        return {
          productId: b.productId,
          productName: product?.name ?? b.productId,
          sku: product?.sku ?? '—',
          openingQuantity,
          inQuantity,
          outQuantity,
          closingQuantity,
        };
      })
      .sort((a, b) => b.closingQuantity - a.closingQuantity);
  }
}
