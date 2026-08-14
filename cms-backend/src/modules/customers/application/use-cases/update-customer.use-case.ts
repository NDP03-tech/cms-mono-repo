import { Inject, Injectable } from '@nestjs/common';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CUSTOMER_REPOSITORY } from '../../domain/repositories/customer.repository.interface';
import { UpdateCustomerInput } from '../dtos/update-customer.input';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(id: string, input: UpdateCustomerInput): Promise<void> {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new Error(`Customer ${id} not found`);

    if (input.name !== undefined) customer.updateName(input.name);
    if (input.phone !== undefined) customer.updatePhone(input.phone);
    if (input.email !== undefined) customer.updateEmail(input.email);
    if (input.address !== undefined) customer.updateAddress(input.address);
    if (input.isActive === true) customer.activate();
    if (input.isActive === false) customer.deactivate();

    await this.customerRepo.save(customer);
  }
}
