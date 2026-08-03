import { Inject, Injectable } from '@nestjs/common';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CUSTOMER_REPOSITORY } from '../../domain/repositories/customer.repository.interface';
import { CustomerFiltersInput } from '../dtos/customer-filters.input';
import { CustomerOutput } from '../dtos/customer.output';

@Injectable()
export class ListCustomersUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(filters?: CustomerFiltersInput): Promise<CustomerOutput[]> {
    const customers = await this.customerRepo.findAll(filters);
    return customers.map(CustomerOutput.from);
  }
}
