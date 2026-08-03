// application/use-cases/remove-stock-in-item.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import type { IStockInRepository } from '../../domain/repositories/stock-in.repository.interface';
@Injectable()
export class RemoveStockInItemUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepo: IStockInRepository,
  ) {}

  async execute(stockInId: string, itemId: string): Promise<void> {
    const stockIn = await this.stockInRepo.findById(stockInId);
    if (!stockIn) throw new Error(`StockIn ${stockInId} not found`);

    stockIn.removeItem(itemId);
    await this.stockInRepo.save(stockIn);
  }
}
