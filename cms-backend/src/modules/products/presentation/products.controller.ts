import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import { GetProductUseCase } from '../application/use-cases/get-product.use-case';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/role.guard';
import { Roles } from '../../../shared/decorators/role.decorator';
import { Role } from '../../auth/domain/enums/roles.enum';
import type { CreateProductInput } from '../application/dtos/create-product.input';
import type { UpdateProductInput } from '../application/dtos/update-product.input';
import type { ProductFiltersInput } from '../application/dtos/product-filters.input';
import { ProductOutput } from '../application/dtos/product.output';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(
    private readonly createUseCase: CreateProductUseCase,
    private readonly updateUseCase: UpdateProductUseCase,
    private readonly deleteUseCase: DeleteProductUseCase,
    private readonly listUseCase: ListProductsUseCase,
    private readonly getUseCase: GetProductUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateProductInput) {
    const id = await this.createUseCase.execute(dto);
    return { id };
  }

  @Get()
  async list(@Query() filters?: ProductFiltersInput) {
    const items = await this.listUseCase.execute(filters);
    return items.map((p) => ProductOutput.from(p));
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const product = await this.getUseCase.execute(id);
    if (!product) return null;
    return ProductOutput.from(product);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateProductInput) {
    await this.updateUseCase.execute(id, dto);
    return { id };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    await this.deleteUseCase.execute(id);
    return { id };
  }
}
