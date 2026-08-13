import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  STOCK_IN_REPOSITORY,
  type IStockInRepository,
} from '../../domain/repositories/stock-in.repository.interface';

import {
  SUPPLIER_REPOSITORY,
  type ISupplierRepository,
} from '../../../suppliers/domain/repositories/supplier.repository.interface';

import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../auth/domain/repositories/user.repository.interface';

import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from '../../../products/domain/repositories/product.repository.interface';

import { StockInFiltersInput } from '../dto/stock-in-filters.input';
import { StockInOutput, StockInEnrichment } from '../dto/stock-in.output';

@Injectable()
export class ListStockInsUseCase {
  private readonly logger = new Logger(ListStockInsUseCase.name);

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

  /**
   * Kiểm tra UUID trước khi đưa xuống PostgreSQL.
   */
  private static normalizeUuid(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }

    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      trimmed,
    )
      ? trimmed
      : undefined;
  }

  async execute(filters?: StockInFiltersInput): Promise<StockInOutput[]> {
    const stockIns = await this.stockInRepo.findAll(filters);

    if (stockIns.length === 0) {
      return [];
    }

    // ============================================================
    // 1. Collect valid IDs
    // ============================================================

    const supplierIds = [
      ...new Set(
        stockIns
          .map((stockIn) =>
            ListStockInsUseCase.normalizeUuid(stockIn.supplierId),
          )
          .filter((id): id is string => typeof id === 'string'),
      ),
    ];

    const userIds = [
      ...new Set(
        stockIns
          .map((stockIn) =>
            ListStockInsUseCase.normalizeUuid(stockIn.createdBy),
          )
          .filter((id): id is string => typeof id === 'string'),
      ),
    ];

    const productIds = [
      ...new Set(
        stockIns.flatMap((stockIn) =>
          stockIn.items
            .map((item) => ListStockInsUseCase.normalizeUuid(item.productId))
            .filter((id): id is string => typeof id === 'string'),
        ),
      ),
    ];

    // ============================================================
    // 2. Load related data
    // ============================================================

    let suppliers = [] as Array<{ id: string; name: string }>;
    let users = [] as Array<{ id: string; username: string }>;
    let products = [] as Array<{
      id: string;
      name: string;
      sku: { skuValue: string };
    }>;

    if (supplierIds.length > 0) {
      try {
        suppliers = await this.supplierRepo.findByIds(supplierIds);
      } catch (error) {
        this.logger.warn(
          'Supplier lookup failed while listing stock-ins, continuing without supplier names',
          error as Error,
        );
      }
    }

    if (userIds.length > 0) {
      try {
        users = await this.userRepo.findByIds(userIds);
      } catch (error) {
        this.logger.warn(
          'User lookup failed while listing stock-ins, continuing without createdBy names',
          error as Error,
        );
      }
    }

    if (productIds.length > 0) {
      try {
        products = await this.productRepo.findByIds(productIds);
      } catch (error) {
        this.logger.warn(
          'Product lookup failed while listing stock-ins, continuing without item enrichments',
          error as Error,
        );
      }
    }

    // ============================================================
    // 3. Build lookup maps
    // ============================================================

    const supplierMap = new Map(
      suppliers.map((supplier) => [supplier.id, supplier.name]),
    );

    // User domain của bạn chỉ có username
    const userMap = new Map(users.map((user) => [user.id, user.username]));

    // SKU là Value Object -> lấy string
    const productMap = new Map(
      products.map((product) => [
        product.id,
        {
          productName: product.name,
          productSku: product.sku.skuValue,
        },
      ]),
    );

    // ============================================================
    // 4. Enrich
    // ============================================================

    return stockIns.map((stockIn) => {
      const enrichment: StockInEnrichment = {
        supplierName: supplierMap.get(stockIn.supplierId),

        createdByName: userMap.get(stockIn.createdBy),

        items: Object.fromEntries(
          stockIn.items.map((item) => [
            item.productId,
            productMap.get(item.productId),
          ]),
        ),
      };

      return StockInOutput.from(stockIn, enrichment);
    });
  }
}
