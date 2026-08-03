// presentation/inventory.controller.ts
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdjustInventoryUseCase } from '../application/use-cases/adjust-inventory.use-case';
import { GetInventoryBalanceUseCase } from '../application/use-cases/get-inventory-balance.use-case';
import { ListInventoryBalancesUseCase } from '../application/use-cases/list-inventory-balances.use-case';
import { ListInventoryTransactionsUseCase } from '../application/use-cases/list-inventory-transactions.use-case';
import type { AdjustInventoryInput } from '../application/dto/adjust-inventory.input';
import type { InventoryBalanceFilters } from '../domain/repositories/inventory-balance.repository.interface';
import type { InventoryTransactionFiltersInput } from '../application/dto/inventory-transaction-filters.input';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly getInventoryBalance: GetInventoryBalanceUseCase,
    private readonly listInventoryBalances: ListInventoryBalancesUseCase,
    private readonly listInventoryTransactions: ListInventoryTransactionsUseCase,
    private readonly adjustInventory: AdjustInventoryUseCase,
  ) {}

  // ----------------------------------------------------------------
  // Balances
  // ----------------------------------------------------------------

  @Get('balances')
  listBalances(@Query() filters: InventoryBalanceFilters) {
    return this.listInventoryBalances.execute(filters);
  }

  @Get('balances/:productId')
  getBalance(@Param('productId') productId: string) {
    return this.getInventoryBalance.execute(productId);
  }

  @Patch('balances/adjust')
  adjust(@Body() input: AdjustInventoryInput) {
    return this.adjustInventory.execute(input);
  }

  // ----------------------------------------------------------------
  // Transactions
  // ----------------------------------------------------------------

  @Get('transactions')
  listTransactions(@Query() filters: InventoryTransactionFiltersInput) {
    return this.listInventoryTransactions.execute(filters);
  }
}
