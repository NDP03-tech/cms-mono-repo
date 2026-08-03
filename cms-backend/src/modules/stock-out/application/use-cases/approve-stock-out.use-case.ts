// application/use-cases/approve-stock-out.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IStockOutRepository,
  STOCK_OUT_REPOSITORY,
} from '../../domain/repositories/stock-out.repository.interface';

@Injectable()
export class ApproveStockOutUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const stockOut = await this.stockOutRepo.findById(id);
    if (!stockOut) throw new Error(`StockOut ${id} not found`);

    stockOut.approve();
    await this.stockOutRepo.save(stockOut);
  }
}
