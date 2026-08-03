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
} from '@nestjs/common';
import { CreateCustomerUseCase } from '../application/use-cases/create-customer.use-case';
import { UpdateCustomerUseCase } from '../application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from '../application/use-cases/delete-customer.use-case';
import { ListCustomersUseCase } from '../application/use-cases/list-customers.use-case';
import { GetCustomerUseCase } from '../application/use-cases/get-customer.use-case';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/role.guard';
import { Roles } from '../../../shared/decorators/role.decorator';
import { Role } from '../../auth/domain/enums/roles.enum';
import type { CreateCustomerInput } from '../application/dtos/create-customer.input';
import type { UpdateCustomerInput } from '../application/dtos/update-customer.input';
import type { CustomerFiltersInput } from '../application/dtos/customer-filters.input';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(
    private readonly createUseCase: CreateCustomerUseCase,
    private readonly updateUseCase: UpdateCustomerUseCase,
    private readonly deleteUseCase: DeleteCustomerUseCase,
    private readonly listUseCase: ListCustomersUseCase,
    private readonly getUseCase: GetCustomerUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCustomerInput) {
    const id = await this.createUseCase.execute(dto);
    return { id };
  }

  @Get()
  async list(@Query() filters?: CustomerFiltersInput) {
    return await this.listUseCase.execute(filters);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getUseCase.execute(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerInput) {
    await this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.deleteUseCase.execute(id);
  }
}
