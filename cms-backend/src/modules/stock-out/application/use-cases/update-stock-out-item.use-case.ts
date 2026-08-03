import { Inject, Injectable } from '@nestjs/common';
import {
  STOCK_OUT_REPOSITORY,
  type IStockOutRepository,
} from '../../domain/repositories/stock-out.repository.interface';
import { UpdateStockOutItemInput } from '../dto/update-stock-out-item.input';
@Injectable()
export class UpdateStockOutItemUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
  ) {}

  async execute(
    stockOutId: string,
    input: UpdateStockOutItemInput,
  ): Promise<void> {
    const stockOut = await this.stockOutRepo.findById(stockOutId);
    if (!stockOut) throw new Error(`StockOut ${stockOutId} not found`);
    stockOut.updateItem(
      input.itemId,
      input.quantity,
      input.unitPrice,
      input.currency,
    );
    await this.stockOutRepo.save(stockOut);
  }
}
