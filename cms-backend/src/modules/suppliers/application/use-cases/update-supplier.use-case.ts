// application/use-cases/update-supplier.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import type { ISupplierRepository } from '../../domain/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository.interface';
import { UpdateSupplierInput } from '../dtos/update-supplier.input';

@Injectable()
export class UpdateSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepo: ISupplierRepository,
  ) {}

  async execute(id: string, input: UpdateSupplierInput): Promise<void> {
    const supplier = await this.supplierRepo.findById(id);
    if (!supplier) throw new Error(`Supplier ${id} not found`);

    if (input.name !== undefined) supplier.updateName(input.name);
    if (input.phone !== undefined) supplier.updatePhone(input.phone);
    if (input.address !== undefined) supplier.updateAddress(input.address);
    if (input.email !== undefined) supplier.updateEmail(input.email);
    if (input.isActive === true) supplier.activate();
    if (input.isActive === false) supplier.deactivate();

    await this.supplierRepo.save(supplier);
  }
}
