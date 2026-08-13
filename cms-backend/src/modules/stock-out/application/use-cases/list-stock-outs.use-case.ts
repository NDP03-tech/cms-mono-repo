// application/use-cases/list-stock-outs.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IStockOutRepository,
  STOCK_OUT_REPOSITORY,
} from '../../domain/repositories/stock-out.repository.interface';
import {
  type ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../customers/domain/repositories/customer.repository.interface';
import { StockOutFiltersInput } from '../dto/stock-out-filters.input';
import { StockOutOutput } from '../dto/stock-out.output';

@Injectable()
export class ListStockOutsUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(filters?: StockOutFiltersInput): Promise<StockOutOutput[]> {
    const stockOuts = await this.stockOutRepo.findAll(filters);

    // Lấy danh sách customerId duy nhất rồi fetch song song,
    // tránh gọi findById lặp lại cho mỗi phiếu (N+1).
    const uniqueCustomerIds = Array.from(
      new Set(stockOuts.map((s) => s.customerId)),
    );

    const customers = await Promise.all(
      uniqueCustomerIds.map((id) => this.customerRepo.findById(id)),
    );

    const customerNameById = new Map<string, string | undefined>(
      uniqueCustomerIds.map((id, index) => [id, customers[index]?.name]),
    );

    return stockOuts.map((stockOut) =>
      StockOutOutput.from(stockOut, {
        customerName: customerNameById.get(stockOut.customerId),
      }),
    );
  }
}
