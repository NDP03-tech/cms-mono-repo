// src/modules/inventory/application/use-cases/check-stock-availability.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IInventoryBalanceRepository,
  INVENTORY_BALANCE_REPOSITORY,
} from '../../domain/repositories/inventory-balance.repository.interface';

export interface StockAvailabilityItem {
  productId: string;
  quantity: number;
}

export interface StockShortage {
  productId: string;
  requested: number;
  available: number;
}

export interface StockAvailabilityResult {
  available: boolean;
  shortages: StockShortage[];
}

@Injectable()
export class CheckStockAvailabilityUseCase {
  constructor(
    @Inject(INVENTORY_BALANCE_REPOSITORY)
    private readonly balanceRepo: IInventoryBalanceRepository,
  ) {}

  /**
   * Chỉ ĐỌC tồn kho, không trừ. Dùng để validate trước khi submit stock-out,
   * tránh trường hợp admin duyệt xong mới phát hiện thiếu hàng.
   */
  async execute(
    items: StockAvailabilityItem[],
  ): Promise<StockAvailabilityResult> {
    const shortages: StockShortage[] = [];

    for (const item of items) {
      const balance = await this.balanceRepo.findByProductId(item.productId);
      const available = balance?.quantity ?? 0;

      if (available < item.quantity) {
        shortages.push({
          productId: item.productId,
          requested: item.quantity,
          available,
        });
      }
    }

    return { available: shortages.length === 0, shortages };
  }
}
