// domain/repositories/stock-out.repository.interface.ts
import { StockOut } from '../entities/stock-out.entity';
import { StockOutEnum } from '../enums/stock-out-status.enum';

export const STOCK_OUT_REPOSITORY = 'STOCK_OUT_REPOSITORY';

export interface StockOutFilters {
  code?: string;
  customerId?: string;
  createdBy?: string;
  status?: StockOutEnum;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export interface IStockOutRepository {
  findById(id: string): Promise<StockOut | null>;
  findByCode(code: string): Promise<StockOut | null>;
  findAll(filters?: StockOutFilters): Promise<StockOut[]>;
  existsById(id: string): Promise<boolean>;
  save(stockOut: StockOut): Promise<void>;
  delete(id: string): Promise<void>;
}
