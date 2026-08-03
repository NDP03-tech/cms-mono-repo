// application/use-cases/list-stock-ins.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import { StockInFiltersInput } from '../dto/stock-in-filters.input';
import { StockInOutput } from '../dto/stock-in.output';
import type { IStockInRepository } from '../../domain/repositories/stock-in.repository.interface';
@Injectable()
export class ListStockInsUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepo: IStockInRepository,
  ) {}

  async execute(filters?: StockInFiltersInput): Promise<StockInOutput[]> {
    const stockIns = await this.stockInRepo.findAll(filters);
    return stockIns.map(StockInOutput.from);
  }
}
