import {
  type IStockOutRepository,
  STOCK_OUT_REPOSITORY,
} from '../../domain/repositories/stock-out.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
@Injectable()
export class SubmitStockOutUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
  ) {}
  async execute(stockOutId: string): Promise<void> {
    const stockOut = await this.stockOutRepo.findById(stockOutId);
    if (!stockOut) throw new Error(`${stockOutId} is not found`);
    stockOut.submit();
    await this.stockOutRepo.save(stockOut);
  }
}
