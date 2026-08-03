import { Inject, Injectable } from '@nestjs/common';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CUSTOMER_REPOSITORY } from '../../domain/repositories/customer.repository.interface';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.customerRepo.existsById(id);
    if (!exists) throw new Error(`Customer ${id} not found`);
    await this.customerRepo.delete(id);
  }
}
