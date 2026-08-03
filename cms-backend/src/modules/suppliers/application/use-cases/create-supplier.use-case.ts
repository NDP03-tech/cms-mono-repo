// application/use-cases/create-supplier.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import type { ISupplierRepository } from '../../domain/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository.interface';
import { Supplier } from '../../domain/entities/supplier.entity';
import { CreateSupplierInput } from '../dtos/create-supplier.input';

@Injectable()
export class CreateSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepo: ISupplierRepository,
  ) {}

  async execute(input: CreateSupplierInput): Promise<string> {
    const supplier = Supplier.create({
      name: input.name,
      phone: input.phone,
      address: input.address,
      email: input.email,
    });

    await this.supplierRepo.save(supplier);
    return supplier.id;
  }
}
