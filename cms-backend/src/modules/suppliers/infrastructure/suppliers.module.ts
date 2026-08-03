import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersController } from '../presentation/suppliers.controller';
import { CreateSupplierUseCase } from '../application/use-cases/create-supplier.use-case';
import { UpdateSupplierUseCase } from '../application/use-cases/update-supplier.use-case';
import { DeleteSupplierUseCase } from '../application/use-cases/delete-supplier.use-case';
import { ListSuppliersUseCase } from '../application/use-cases/list-suppliers.use-case';
import { GetSupplierUseCase } from '../application/use-cases/get-supplier.use-case';
import { SupplierRepository } from './persistence/supplier.repository.implementation';
import { SupplierOrmEntity } from './persistence/supplier.orm-entity';
import { SUPPLIER_REPOSITORY } from '../domain/repositories/supplier.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierOrmEntity])],
  controllers: [SuppliersController],
  providers: [
    CreateSupplierUseCase,
    UpdateSupplierUseCase,
    DeleteSupplierUseCase,
    ListSuppliersUseCase,
    GetSupplierUseCase,
    { provide: SUPPLIER_REPOSITORY, useClass: SupplierRepository },
  ],
  exports: [SUPPLIER_REPOSITORY],
})
export class SuppliersModule {}
