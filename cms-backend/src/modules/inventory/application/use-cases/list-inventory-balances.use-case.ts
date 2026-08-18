// application/use-cases/list-inventory-balances.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IInventoryBalanceRepository,
  INVENTORY_BALANCE_REPOSITORY,
  InventoryBalanceFilters,
} from '../../domain/repositories/inventory-balance.repository.interface';

import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../products/domain/repositories/product.repository.interface';

import { InventoryBalanceOutput } from '../dto/inventory-balance.output';

@Injectable()
export class ListInventoryBalancesUseCase {
  constructor(
    @Inject(INVENTORY_BALANCE_REPOSITORY)
    private readonly balanceRepo: IInventoryBalanceRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(
    filters?: InventoryBalanceFilters,
  ): Promise<InventoryBalanceOutput[]> {
    const balances = await this.balanceRepo.findAll(filters);
    if (balances.length === 0) return [];

    const productIds = [...new Set(balances.map((b) => b.productId))];
    const products = await this.productRepo.findByIds(productIds);
    const productMap = new Map(products.map((p) => [p.id, p]));

    return balances.map((balance) =>
      InventoryBalanceOutput.from(balance, productMap.get(balance.productId)),
    );
  }
}
