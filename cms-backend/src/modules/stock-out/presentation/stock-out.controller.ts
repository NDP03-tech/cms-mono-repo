// presentation/stock-out.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateStockOutUseCase } from '../application/use-cases/create-stock-out.use-case';
import { AddStockOutItemUseCase } from '../application/use-cases/add-stock-out-item.use-case';
import { UpdateStockOutItemUseCase } from '../application/use-cases/update-stock-out-item.use-case';
import { RemoveStockOutItemUseCase } from '../application/use-cases/remove-stock-out-item.use-case';
import { SubmitStockOutUseCase } from '../application/use-cases/submit-stock-out.use-case';
import { ApproveStockOutUseCase } from '../application/use-cases/approve-stock-out.use-case';
import { RejectStockOutUseCase } from '../application/use-cases/reject-stock-out.use-case';
import { GetStockOutUseCase } from '../application/use-cases/get-stock-out.use-case';
import { ListStockOutsUseCase } from '../application/use-cases/list-stock-outs.use-case';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/role.guard';
import { Roles } from '../../../shared/decorators/role.decorator';
import { Role } from '../../auth/domain/enums/roles.enum';
import type {
  CreateStockOutInput,
  CreateStockOutItemInput,
} from '../application/dto/create-stock-out.input';
import type { UpdateStockOutItemInput } from '../application/dto/update-stock-out-item.input';
import type { StockOutFiltersInput } from '../application/dto/stock-out-filters.input';

@Controller('stock-out')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockOutController {
  constructor(
    private readonly createStockOut: CreateStockOutUseCase,
    private readonly addStockOutItem: AddStockOutItemUseCase,
    private readonly updateStockOutItem: UpdateStockOutItemUseCase,
    private readonly removeStockOutItem: RemoveStockOutItemUseCase,
    private readonly submitStockOut: SubmitStockOutUseCase,
    private readonly approveStockOut: ApproveStockOutUseCase,
    private readonly rejectStockOut: RejectStockOutUseCase,
    private readonly getStockOut: GetStockOutUseCase,
    private readonly listStockOuts: ListStockOutsUseCase,
  ) {}

  // ----------------------------------------------------------------
  // CRUD
  // ----------------------------------------------------------------

  @Post()
  create(@Body() input: CreateStockOutInput, @Req() req: any) {
    // Dùng user đã authenticate từ JWT làm người tạo,
    // bỏ qua createdBy client tự gửi lên (tránh giả mạo).
    const user = req.user as any;
    if (user && user.id) {
      input.createdBy = user.id;
    }

    return this.createStockOut.execute(input);
  }

  @Get()
  list(@Query() filters: StockOutFiltersInput) {
    return this.listStockOuts.execute(filters);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getStockOut.execute(id);
  }

  // ----------------------------------------------------------------
  // Items
  // ----------------------------------------------------------------

  @Post(':id/items')
  async addItem(
    @Param('id') stockOutId: string,
    @Body() input: CreateStockOutItemInput,
  ) {
    await this.addStockOutItem.execute(stockOutId, input);
    return this.getStockOut.execute(stockOutId);
  }

  @Patch(':id/items/:itemId')
  async updateItem(
    @Param('id') stockOutId: string,
    @Param('itemId') itemId: string,
    @Body() input: UpdateStockOutItemInput,
  ) {
    await this.updateStockOutItem.execute(stockOutId, {
      ...input,
      itemId,
    });
    return this.getStockOut.execute(stockOutId);
  }

  @Delete(':id/items/:itemId')
  async removeItem(
    @Param('id') stockOutId: string,
    @Param('itemId') itemId: string,
  ) {
    await this.removeStockOutItem.execute(stockOutId, itemId);
    return this.getStockOut.execute(stockOutId);
  }

  // ----------------------------------------------------------------
  // Status transitions
  // ----------------------------------------------------------------

  @Patch(':id/submit')
  submit(@Param('id') id: string) {
    return this.submitStockOut.execute(id);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN)
  approve(@Param('id') id: string) {
    return this.approveStockOut.execute(id);
  }

  @Patch(':id/reject')
  @Roles(Role.ADMIN)
  reject(@Param('id') id: string) {
    return this.rejectStockOut.execute(id);
  }
}
