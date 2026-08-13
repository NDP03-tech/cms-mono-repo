// application/use-cases/create-stock-in.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import { StockIn } from '../../domain/entities/stock-in.entity';
import type { IStockInRepository } from '../../domain/repositories/stock-in.repository.interface';
import { CreateStockInInput } from '../dto/create-stock-in.input';

@Injectable()
export class CreateStockInUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepo: IStockInRepository,
  ) {}

  async execute(input: CreateStockInInput): Promise<string> {
    const stockIn = StockIn.create({
      supplierId: input.supplierId,
      createdBy: input.createdBy,
      currency: input.currency,
    });

    for (const item of input.items ?? []) {
      stockIn.addItem({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
      });
    }

    await this.stockInRepo.save(stockIn);
    return stockIn.id;
  }
}
