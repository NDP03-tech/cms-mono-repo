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
import { CreateStockInUseCase } from '../application/use-cases/create-stock-in';
import { AddStockInItemUseCase } from '../application/use-cases/add-stock-in-item';
import { UpdateStockInItemUseCase } from '../application/use-cases/update-stock-in-item';
import { RemoveStockInItemUseCase } from '../application/use-cases/remove-stock-in-item';
import { SubmitStockInUseCase } from '../application/use-cases/submit-stock-in';
import { ApproveStockInUseCase } from '../application/use-cases/approve-stock-in';
import { RejectStockInUseCase } from '../application/use-cases/reject-stock-in';
import { GetStockInUseCase } from '../application/use-cases/get-stock-in';
import { ListStockInsUseCase } from '../application/use-cases/list-stock-ins';
import type {
  CreateStockInInput,
  CreateStockInItemInput,
} from '../application/dto/create-stock-in.input';
import type { UpdateStockInItemInput } from '../application/dto/update-stock-in-item.input';
import type { StockInFiltersInput } from '../application/dto/stock-in-filters.input';

@Controller('stock-in')
export class StockInController {
  constructor(
    private readonly createStockIn: CreateStockInUseCase,
    private readonly addStockInItem: AddStockInItemUseCase,
    private readonly updateStockInItem: UpdateStockInItemUseCase,
    private readonly removeStockInItem: RemoveStockInItemUseCase,
    private readonly submitStockIn: SubmitStockInUseCase,
    private readonly approveStockIn: ApproveStockInUseCase,
    private readonly rejectStockIn: RejectStockInUseCase,
    private readonly getStockIn: GetStockInUseCase,
    private readonly listStockIns: ListStockInsUseCase,
  ) {}

  // ----------------------------------------------------------------
  // CRUD
  // ----------------------------------------------------------------

  @Post()
  create(@Body() input: CreateStockInInput) {
    return this.createStockIn.execute(input);
  }

  @Get()
  list(@Query() filters: StockInFiltersInput) {
    return this.listStockIns.execute(filters);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getStockIn.execute(id);
  }

  // ----------------------------------------------------------------
  // Items
  // ----------------------------------------------------------------

  @Post(':id/items')
  addItem(
    @Param('id') stockInId: string,
    @Body() input: CreateStockInItemInput,
  ) {
    return this.addStockInItem.execute(stockInId, input);
  }

  @Patch(':id/items/:itemId')
  updateItem(
    @Param('id') stockInId: string,
    @Param('itemId') itemId: string,
    @Body() input: UpdateStockInItemInput,
  ) {
    return this.updateStockInItem.execute(stockInId, {
      itemId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      currency: input.currency,
    });
  }

  @Delete(':id/items/:itemId')
  removeItem(@Param('id') stockInId: string, @Param('itemId') itemId: string) {
    return this.removeStockInItem.execute(stockInId, itemId);
  }

  // ----------------------------------------------------------------
  // Status transitions
  // ----------------------------------------------------------------

  @Patch(':id/submit')
  submit(@Param('id') id: string) {
    return this.submitStockIn.execute(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.approveStockIn.execute(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.rejectStockIn.execute(id);
  }
}
