import { Customer } from '../../domain/entities/customer.entity';

export class CustomerOutput {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  isActive: boolean;

  static from(customer: Customer): CustomerOutput {
    const output = new CustomerOutput();
    output.id = customer.id;
    output.name = customer.name;
    output.phone = customer.phone?.toString();
    output.email = customer.email?.toString();
    output.isActive = customer.isActive;
    return output;
  }
}
