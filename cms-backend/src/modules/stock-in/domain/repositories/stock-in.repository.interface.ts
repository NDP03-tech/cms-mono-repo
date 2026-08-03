// domain/repositories/stock-in.repository.interface.ts
import { StockIn } from '../entities/stock-in.entity';
import { StockInStatus } from '../enums/stock-in-status.enum';

export const STOCK_IN_REPOSITORY = 'STOCK_IN_REPOSITORY';

export interface StockInFilters {
  code?: string;
  supplierId?: string;
  createdBy?: string;
  status?: StockInStatus;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export interface IStockInRepository {
  findById(id: string): Promise<StockIn | null>;
  findByCode(code: string): Promise<StockIn | null>;
  findAll(filters?: StockInFilters): Promise<StockIn[]>;
  existsById(id: string): Promise<boolean>;
  save(stockIn: StockIn): Promise<void>;
  delete(id: string): Promise<void>;
}
