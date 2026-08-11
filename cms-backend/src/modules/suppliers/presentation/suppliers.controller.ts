import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Patch,
} from '@nestjs/common';

import { CreateSupplierUseCase } from '../application/use-cases/create-supplier.use-case';
import { UpdateSupplierUseCase } from '../application/use-cases/update-supplier.use-case';
import { DeleteSupplierUseCase } from '../application/use-cases/delete-supplier.use-case';
import { ListSuppliersUseCase } from '../application/use-cases/list-suppliers.use-case';
import { GetSupplierUseCase } from '../application/use-cases/get-supplier.use-case';

import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/role.guard';
import { Roles } from '../../../shared/decorators/role.decorator';
import { Role } from '../../auth/domain/enums/roles.enum';

import type { CreateSupplierInput } from '../application/dtos/create-supplier.input';
import type { UpdateSupplierInput } from '../application/dtos/update-supplier.input';
import type { SupplierFiltersInput } from '../application/dtos/supplier-filters.input';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersController {
  constructor(
    private readonly createUseCase: CreateSupplierUseCase,
    private readonly updateUseCase: UpdateSupplierUseCase,
    private readonly deleteUseCase: DeleteSupplierUseCase,
    private readonly listUseCase: ListSuppliersUseCase,
    private readonly getUseCase: GetSupplierUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSupplierInput) {
    const id = await this.createUseCase.execute(dto);

    return { id };
  }

  @Get()
  async list(@Query() filters?: SupplierFiltersInput) {
    return this.listUseCase.execute(filters);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getUseCase.execute(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSupplierInput,
  ): Promise<void> {
    await this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUseCase.execute(id);
  }
}
