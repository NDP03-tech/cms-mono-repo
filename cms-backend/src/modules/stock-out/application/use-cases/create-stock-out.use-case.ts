import { Inject, Injectable } from '@nestjs/common';
import { CreateStockOutInput } from '../dto/create-stock-out.input';
import { StockOut } from '../../domain/entities/stock-out.entity';
import { STOCK_OUT_REPOSITORY } from '../../domain/repositories/stock-out.repository.interface';
import type { IStockOutRepository } from '../../domain/repositories/stock-out.repository.interface';
@Injectable()
export class CreateStockOutUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
  ) {}

  async execute(input: CreateStockOutInput): Promise<string> {
    const stockOut = StockOut.create({
      customerId: input.customerId,
      createdBy: input.createdBy,
      currency: input.currency,
    });
    for (const item of input.items) {
      stockOut.addItem({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
      });
    }
    await this.stockOutRepo.save(stockOut);
    return stockOut.id;
  }
}
