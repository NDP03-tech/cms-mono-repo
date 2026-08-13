// application/use-cases/get-stock-out.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IStockOutRepository,
  STOCK_OUT_REPOSITORY,
} from '../../domain/repositories/stock-out.repository.interface';
import {
  type ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../customers/domain/repositories/customer.repository.interface';
import { StockOutOutput } from '../dto/stock-out.output';

@Injectable()
export class GetStockOutUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(id: string): Promise<StockOutOutput> {
    const stockOut = await this.stockOutRepo.findById(id);
    if (!stockOut) throw new Error(`StockOut ${id} not found`);

    const customer = await this.customerRepo.findById(stockOut.customerId);

    return StockOutOutput.from(stockOut, {
      customerName: customer?.name,
    });
  }
}
