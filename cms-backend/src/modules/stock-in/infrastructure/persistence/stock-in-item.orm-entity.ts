// infrastructure/persistence/stock-in-item.orm-entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StockInOrmEntity } from './stock-in.orm-entity';

@Entity('stock_in_items')
export class StockInItemOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stockInId: string;

  @Column()
  productId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalPrice: number;

  @Column({ length: 10 })
  currency: string;

  @ManyToOne(() => StockInOrmEntity, (stockIn) => stockIn.items)
  stockIn: StockInOrmEntity;
}
