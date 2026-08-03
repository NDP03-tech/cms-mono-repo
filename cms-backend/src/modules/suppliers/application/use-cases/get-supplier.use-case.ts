// application/use-cases/get-supplier.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import type { ISupplierRepository } from '../../domain/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository.interface';
import { SupplierOutput } from '../dtos/supplier.output';

@Injectable()
export class GetSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepo: ISupplierRepository,
  ) {}

  async execute(id: string): Promise<SupplierOutput> {
    const supplier = await this.supplierRepo.findById(id);
    if (!supplier) throw new Error(`Supplier ${id} not found`);
    return SupplierOutput.from(supplier);
  }
}
