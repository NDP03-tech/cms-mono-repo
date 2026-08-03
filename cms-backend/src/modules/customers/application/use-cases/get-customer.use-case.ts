import { Inject, Injectable } from '@nestjs/common';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CUSTOMER_REPOSITORY } from '../../domain/repositories/customer.repository.interface';
import { CustomerOutput } from '../dtos/customer.output';

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(id: string): Promise<CustomerOutput> {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new Error(`Customer ${id} not found`);
    return CustomerOutput.from(customer);
  }
}
