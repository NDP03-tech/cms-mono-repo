// application/use-cases/update-stock-in-item.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import { UpdateStockInItemInput } from '../dto/update-stock-in-item.input';
import type { IStockInRepository } from '../../domain/repositories/stock-in.repository.interface';
@Injectable()
export class UpdateStockInItemUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepo: IStockInRepository,
  ) {}

  async execute(
    stockInId: string,
    input: UpdateStockInItemInput,
  ): Promise<void> {
    const stockIn = await this.stockInRepo.findById(stockInId);
    if (!stockIn) throw new Error(`StockIn ${stockInId} not found`);

    stockIn.updateItem(
      input.itemId,
      input.quantity,
      input.unitPrice,
      input.currency,
    );

    await this.stockInRepo.save(stockIn);
  }
}
