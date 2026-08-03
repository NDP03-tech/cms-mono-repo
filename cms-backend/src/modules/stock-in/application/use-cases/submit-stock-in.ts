// application/use-cases/submit-stock-in.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import type { IStockInRepository } from '../../domain/repositories/stock-in.repository.interface';
@Injectable()
export class SubmitStockInUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepo: IStockInRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const stockIn = await this.stockInRepo.findById(id);
    if (!stockIn) throw new Error(`StockIn ${id} not found`);

    stockIn.submit();
    await this.stockInRepo.save(stockIn);
  }
}
