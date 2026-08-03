import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from '../presentation/customers.controller';
import { CreateCustomerUseCase } from '../application/use-cases/create-customer.use-case';
import { UpdateCustomerUseCase } from '../application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from '../application/use-cases/delete-customer.use-case';
import { ListCustomersUseCase } from '../application/use-cases/list-customers.use-case';
import { GetCustomerUseCase } from '../application/use-cases/get-customer.use-case';
import { CustomerRepository } from './persistence/customer.repository.implementation';
import { CustomerOrmEntity } from './orm/customer.orm-entity';
import { CUSTOMER_REPOSITORY } from '../domain/repositories/customer.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [CustomersController],
  providers: [
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    ListCustomersUseCase,
    GetCustomerUseCase,
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomersModule {}
