// application/use-cases/get-stock-in.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import { StockInOutput } from '../dto/stock-in.output';
import type { IStockInRepository } from '../../domain/repositories/stock-in.repository.interface';
@Injectable()
export class GetStockInUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepo: IStockInRepository,
  ) {}

  async execute(id: string): Promise<StockInOutput> {
    const stockIn = await this.stockInRepo.findById(id);
    if (!stockIn) throw new Error(`StockIn ${id} not found`);
    return StockInOutput.from(stockIn);
  }
}
