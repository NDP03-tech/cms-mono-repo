// application/use-cases/delete-supplier.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import type { ISupplierRepository } from '../../domain/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository.interface';

@Injectable()
export class DeleteSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepo: ISupplierRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const supplier = await this.supplierRepo.findById(id);
    if (!supplier) throw new Error(`Supplier ${id} not found`);

    supplier.deactivate();
    await this.supplierRepo.save(supplier);
  }
}
