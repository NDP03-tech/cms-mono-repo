import { Inject, Injectable } from '@nestjs/common';
import { STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../../suppliers/domain/repositories/supplier.repository.interface';
import { USER_REPOSITORY } from '../../../auth/domain/repositories/user.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository.interface';
import { StockInOutput, StockInEnrichment } from '../dto/stock-in.output';
import type { IStockInRepository } from '../../domain/repositories/stock-in.repository.interface';
import type { ISupplierRepository } from '../../../suppliers/domain/repositories/supplier.repository.interface';
import type { IUserRepository } from '../../../auth/domain/repositories/user.repository.interface';
import type { IProductRepository } from '../../../products/domain/repositories/product.repository.interface';

@Injectable()
export class GetStockInUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepo: IStockInRepository,
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepo: ISupplierRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(id: string): Promise<StockInOutput> {
    const stockIn = await this.stockInRepo.findById(id);
    if (!stockIn) throw new Error(`StockIn ${id} not found`);

    const productIds = stockIn.items.map((i) => i.productId);

    const [supplier, user, products] = await Promise.all([
      this.supplierRepo.findById(stockIn.supplierId),
      this.userRepo.findById(stockIn.createdBy),
      productIds.length
        ? this.productRepo.findByIds(productIds)
        : Promise.resolve([]),
    ]);

    const enrichment: StockInEnrichment = {
      supplierName: supplier?.name, // bỏ "as any"
      createdByName: (user as any)?.username, // vẫn cần any vì chưa xác nhận User entity
      items: Object.fromEntries(
        products.map((p: any) => [
          p.id,
          { productName: p.name, productSku: p.sku?.toString?.() ?? p.sku },
        ]),
      ),
    };

    return StockInOutput.from(stockIn, enrichment);
  }
}
