import { Inject, Injectable } from '@nestjs/common';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CUSTOMER_REPOSITORY } from '../../domain/repositories/customer.repository.interface';
import { Customer } from '../../domain/entities/customer.entity';
import { CreateCustomerInput } from '../dtos/create-customer.input';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(input: CreateCustomerInput): Promise<string> {
    const customer = Customer.create({
      name: input.name,
      phone: input.phone,
      email: input.email,
      address: input.address,
    });

    await this.customerRepo.save(customer);
    return customer.id;
  }
}
