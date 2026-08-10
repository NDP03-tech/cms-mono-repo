import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from '../presentation/products.controller';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import { GetProductUseCase } from '../application/use-cases/get-product.use-case';
import { ProductRepository } from './persistence/product.repository';
import { ProductOrmEntity } from './orm/product.orm-entity';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ListProductsUseCase,
    GetProductUseCase,
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
