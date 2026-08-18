// application/use-cases/list-inventory-transactions.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IInventoryTransactionRepository,
  INVENTORY_TRANSACTION_REPOSITORY,
} from '../../domain/repositories/inventory-transaction.repository.interface';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../products/domain/repositories/product.repository.interface';

import { InventoryTransactionFiltersInput } from '../dto/inventory-transaction-filters.input';
import { InventoryTransactionOutput } from '../dto/inventory-transaction.output';

@Injectable()
export class ListInventoryTransactionsUseCase {
  constructor(
    @Inject(INVENTORY_TRANSACTION_REPOSITORY)
    private readonly transactionRepo: IInventoryTransactionRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(
    filters?: InventoryTransactionFiltersInput,
  ): Promise<InventoryTransactionOutput[]> {
    const transactions = await this.transactionRepo.findAll(filters);
    if (transactions.length === 0) return [];

    const productIds = [...new Set(transactions.map((t) => t.productId))];
    const products = await this.productRepo.findByIds(productIds);
    const productMap = new Map(products.map((p) => [p.id, p]));

    return transactions.map((transaction) =>
      InventoryTransactionOutput.from(
        transaction,
        productMap.get(transaction.productId),
      ),
    );
  }
}
