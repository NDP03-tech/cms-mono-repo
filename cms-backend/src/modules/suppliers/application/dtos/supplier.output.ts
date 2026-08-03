// application/dto/supplier.output.ts
import { Supplier } from '../../domain/entities/supplier.entity';

export class SupplierOutput {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  isActive: boolean;

  static from(supplier: Supplier): SupplierOutput {
    const output = new SupplierOutput();
    output.id = supplier.id;
    output.name = supplier.name;
    output.phone = supplier.phone?.toString();
    output.address = supplier.address?.toString();
    output.email = supplier.email;
    output.isActive = supplier.isActive;
    return output;
  }
}
