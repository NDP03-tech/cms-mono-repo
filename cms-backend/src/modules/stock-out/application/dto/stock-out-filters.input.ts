// application/dto/stock-out-filters.input.ts
import { StockOutEnum } from '../../domain/enums/stock-out-status.enum';

export interface StockOutFiltersInput {
  code?: string;
  customerId?: string;
  createdBy?: string;
  status?: StockOutEnum;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}
