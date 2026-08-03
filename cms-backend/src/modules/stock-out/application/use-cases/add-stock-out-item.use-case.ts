// application/use-cases/add-stock-out-item.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { STOCK_OUT_REPOSITORY } from '../../domain/repositories/stock-out.repository.interface';
import { CreateStockOutItemInput } from '../dto/create-stock-out.input';
import type { IStockOutRepository } from '../../domain/repositories/stock-out.repository.interface';
@Injectable()
export class AddStockOutItemUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
  ) {}

  async execute(
    stockOutId: string,
    input: CreateStockOutItemInput,
  ): Promise<void> {
    const stockOut = await this.stockOutRepo.findById(stockOutId);
    if (!stockOut) throw new Error(`StockOut ${stockOutId} not found`);

    stockOut.addItem({
      productId: input.productId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      currency: input.currency,
    });

    await this.stockOutRepo.save(stockOut);
  }
}
