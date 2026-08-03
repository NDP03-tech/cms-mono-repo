// application/use-cases/add-stock-in-item.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import { CreateStockInItemInput } from '../dto/create-stock-in.input';
import type { IStockInRepository } from '../../domain/repositories/stock-in.repository.interface';

@Injectable()
export class AddStockInItemUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepo: IStockInRepository,
  ) {}

  async execute(
    stockInId: string,
    input: CreateStockInItemInput,
  ): Promise<void> {
    const stockIn = await this.stockInRepo.findById(stockInId);
    if (!stockIn) throw new Error(`StockIn ${stockInId} not found`);

    stockIn.addItem({
      productId: input.productId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      currency: input.currency,
    });

    await this.stockInRepo.save(stockIn);
  }
}
