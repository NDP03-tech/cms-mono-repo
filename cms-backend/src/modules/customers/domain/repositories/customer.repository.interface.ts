import { Customer } from '../entities/customer.entity';

export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';

export interface CustomerFilters {
  name?: string;
  email?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(filters?: CustomerFilters): Promise<Customer[]>;
  existsById(id: string): Promise<boolean>;
  save(customer: Customer): Promise<void>;
  delete(id: string): Promise<void>;
}
