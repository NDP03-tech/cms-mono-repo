// application/use-cases/get-inventory-balance.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IInventoryBalanceRepository,
  INVENTORY_BALANCE_REPOSITORY,
} from '../../domain/repositories/inventory-balance.repository.interface';
import { InventoryBalanceOutput } from '../dto/inventory-balance.output';

@Injectable()
export class GetInventoryBalanceUseCase {
  constructor(
    @Inject(INVENTORY_BALANCE_REPOSITORY)
    private readonly balanceRepo: IInventoryBalanceRepository,
  ) {}

  async execute(productId: string): Promise<InventoryBalanceOutput> {
    const balance = await this.balanceRepo.findByProductId(productId);
    if (!balance)
      throw new Error(`No inventory balance found for product ${productId}`);
    return InventoryBalanceOutput.from(balance);
  }
}
