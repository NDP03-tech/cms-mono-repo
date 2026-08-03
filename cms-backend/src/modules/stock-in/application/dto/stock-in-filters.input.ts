// application/dto/stock-in-filters.input.ts
import { StockInStatus } from '../../domain/enums/stock-in-status.enum';

export interface StockInFiltersInput {
  code?: string;
  supplierId?: string;
  createdBy?: string;
  status?: StockInStatus;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}
