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
import type {
  CreateStockOutInput,
  CreateStockOutItemInput,
} from '../application/dto/create-stock-out.input';
import type { UpdateStockOutItemInput } from '../application/dto/update-stock-out-item.input';
import type { StockOutFiltersInput } from '../application/dto/stock-out-filters.input';

@Controller('stock-out')
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
  create(@Body() input: CreateStockOutInput) {
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
  addItem(
    @Param('id') stockOutId: string,
    @Body() input: CreateStockOutItemInput,
  ) {
    return this.addStockOutItem.execute(stockOutId, input);
  }

  @Patch(':id/items/:itemId')
  updateItem(
    @Param('id') stockOutId: string,
    @Param('itemId') itemId: string,
    @Body() input: UpdateStockOutItemInput,
  ) {
    return this.updateStockOutItem.execute(stockOutId, {
      ...input,
      itemId,
    });
  }

  @Delete(':id/items/:itemId')
  removeItem(@Param('id') stockOutId: string, @Param('itemId') itemId: string) {
    return this.removeStockOutItem.execute(stockOutId, itemId);
  }

  // ----------------------------------------------------------------
  // Status transitions
  // ----------------------------------------------------------------

  @Patch(':id/submit')
  submit(@Param('id') id: string) {
    return this.submitStockOut.execute(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.approveStockOut.execute(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.rejectStockOut.execute(id);
  }
}
