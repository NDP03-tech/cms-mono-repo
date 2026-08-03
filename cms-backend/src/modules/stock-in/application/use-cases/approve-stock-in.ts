// application/use-cases/approve-stock-in.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import type { IStockInRepository } from '../../domain/repositories/stock-in.repository.interface';
@Injectable()
export class ApproveStockInUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepo: IStockInRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const stockIn = await this.stockInRepo.findById(id);
    if (!stockIn) throw new Error(`StockIn ${id} not found`);

    stockIn.approve();
    await this.stockInRepo.save(stockIn);
  }
}
