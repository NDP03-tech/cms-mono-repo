// application/use-cases/list-suppliers.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import type { ISupplierRepository } from '../../domain/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository.interface';
import { SupplierFiltersInput } from '../dtos/supplier-filters.input';
import { SupplierOutput } from '../dtos/supplier.output';

@Injectable()
export class ListSuppliersUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepo: ISupplierRepository,
  ) {}

  async execute(filters?: SupplierFiltersInput): Promise<SupplierOutput[]> {
    const suppliers = await this.supplierRepo.findAll(filters);
    return suppliers.map(SupplierOutput.from);
  }
}
