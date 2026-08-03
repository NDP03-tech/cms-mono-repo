// application/use-cases/list-inventory-balances.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IInventoryBalanceRepository,
  INVENTORY_BALANCE_REPOSITORY,
  InventoryBalanceFilters,
} from '../../domain/repositories/inventory-balance.repository.interface';
import { InventoryBalanceOutput } from '../dto/inventory-balance.output';

@Injectable()
export class ListInventoryBalancesUseCase {
  constructor(
    @Inject(INVENTORY_BALANCE_REPOSITORY)
    private readonly balanceRepo: IInventoryBalanceRepository,
  ) {}

  async execute(
    filters?: InventoryBalanceFilters,
  ): Promise<InventoryBalanceOutput[]> {
    const balances = await this.balanceRepo.findAll(filters);
    return balances.map(InventoryBalanceOutput.from);
  }
}
