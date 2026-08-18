// application/use-cases/approve-stock-in.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import type { IStockInRepository } from '../../domain/repositories/stock-in.repository.interface';
import { RecordStockInUseCase } from '../../../inventory/application/use-cases/record-stock-in.use-case';

@Injectable()
export class ApproveStockInUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepo: IStockInRepository,
    private readonly recordStockIn: RecordStockInUseCase,
  ) {}

  async execute(id: string): Promise<void> {
    const stockIn = await this.stockInRepo.findById(id);
    if (!stockIn) throw new Error(`StockIn ${id} not found`);

    stockIn.approve();

    await this.recordStockIn.execute(stockIn);
    await this.stockInRepo.save(stockIn);
  }
}
