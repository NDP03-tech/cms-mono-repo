import { Injectable, Inject } from '@nestjs/common';
import {
  type IStockOutRepository,
  STOCK_OUT_REPOSITORY,
} from '../../domain/repositories/stock-out.repository.interface';

@Injectable()
export class RemoveStockOutItemUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
  ) {}

  async execute(stockOutId: string, itemId: string): Promise<void> {
    const stockOut = await this.stockOutRepo.findById(stockOutId);
    if (!stockOut) throw new Error(`${stockOutId} is not found`);
    stockOut.removeItem(itemId);
    await this.stockOutRepo.save(stockOut);
  }
}
