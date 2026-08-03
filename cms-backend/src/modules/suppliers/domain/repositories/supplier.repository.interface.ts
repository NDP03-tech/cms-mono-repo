// domain/repositories/supplier.repository.interface.ts
import { Supplier } from '../entities/supplier.entity';

export const SUPPLIER_REPOSITORY = 'SUPPLIER_REPOSITORY';

export interface SupplierFilters {
  name?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ISupplierRepository {
  findById(id: string): Promise<Supplier | null>;
  findByName(name: string): Promise<Supplier[]>;
  findAll(filters?: SupplierFilters): Promise<Supplier[]>;
  existsById(id: string): Promise<boolean>;
  save(supplier: Supplier): Promise<void>;
  delete(id: string): Promise<void>;
}
