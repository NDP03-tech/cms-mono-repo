// application/use-cases/list-stock-outs.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IStockOutRepository,
  STOCK_OUT_REPOSITORY,
} from '../../domain/repositories/stock-out.repository.interface';
import { StockOutFiltersInput } from '../dto/stock-out-filters.input';
import { StockOutOutput } from '../dto/stock-out.output';

@Injectable()
export class ListStockOutsUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
  ) {}

  async execute(filters?: StockOutFiltersInput): Promise<StockOutOutput[]> {
    const stockOuts = await this.stockOutRepo.findAll(filters);
    return stockOuts.map(StockOutOutput.from);
  }
}
