import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockInController } from './presentation/stock-in.controller';
import { CreateStockInUseCase } from './application/use-cases/create-stock-in';
import { AddStockInItemUseCase } from './application/use-cases/add-stock-in-item';
import { UpdateStockInItemUseCase } from './application/use-cases/update-stock-in-item';
import { RemoveStockInItemUseCase } from './application/use-cases/remove-stock-in-item';
import { SubmitStockInUseCase } from './application/use-cases/submit-stock-in';
import { ApproveStockInUseCase } from './application/use-cases/approve-stock-in';
import { RejectStockInUseCase } from './application/use-cases/reject-stock-in';
import { GetStockInUseCase } from './application/use-cases/get-stock-in';
import { ListStockInsUseCase } from './application/use-cases/list-stock-ins';
import { StockInRepository } from './infrastructure/repositories/stock-in.repository';
import { StockInOrmEntity } from './infrastructure/persistence/stock-in.orm-entity';
import { StockInItemOrmEntity } from './infrastructure/persistence/stock-in-item.orm-entity';
import { STOCK_IN_REPOSITORY } from './domain/repositories/stock-in.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([StockInOrmEntity, StockInItemOrmEntity])],
  controllers: [StockInController],
  providers: [
    CreateStockInUseCase,
    AddStockInItemUseCase,
    UpdateStockInItemUseCase,
    RemoveStockInItemUseCase,
    SubmitStockInUseCase,
    ApproveStockInUseCase,
    RejectStockInUseCase,
    GetStockInUseCase,
    ListStockInsUseCase,
    { provide: STOCK_IN_REPOSITORY, useClass: StockInRepository },
  ],
  exports: [STOCK_IN_REPOSITORY],
})
export class StockInModule {}
