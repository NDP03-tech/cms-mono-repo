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
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../auth/domain/repositories/user.repository.interface';
import { StockOutFiltersInput } from '../dto/stock-out-filters.input';
import { StockOutOutput } from '../dto/stock-out.output';

@Injectable()
export class ListStockOutsUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(filters?: StockOutFiltersInput): Promise<StockOutOutput[]> {
    const stockOuts = await this.stockOutRepo.findAll(filters);

    // Lấy danh sách customerId / createdBy (userId) duy nhất rồi fetch
    // song song theo batch, tránh N+1 khi list nhiều phiếu.
    const uniqueCustomerIds = Array.from(
      new Set(stockOuts.map((s) => s.customerId)),
    );
    const uniqueUserIds = Array.from(
      new Set(stockOuts.map((s) => s.createdBy)),
    );

    const [customers, users] = await Promise.all([
      Promise.all(
        uniqueCustomerIds.map((id) => this.customerRepo.findById(id)),
      ),
      this.userRepo.findByIds(uniqueUserIds),
    ]);

    const customerNameById = new Map<string, string | undefined>(
      uniqueCustomerIds.map((id, index) => [id, customers[index]?.name]),
    );
    const userNameById = new Map<string, string>(
      users.map((u) => [u.id, u.displayName]),
    );

    return stockOuts.map((stockOut) =>
      StockOutOutput.from(stockOut, {
        customerName: customerNameById.get(stockOut.customerId),
        createdByName: userNameById.get(stockOut.createdBy),
      }),
    );
  }
}
