// infrastructure/persistence/stock-out-item.orm-entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StockOutOrmEntity } from './stock-out.orm-entity';

@Entity('stock_out_items')
export class StockOutItemOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stockOutId: string;

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

  @ManyToOne(() => StockOutOrmEntity, (stockOut) => stockOut.items)
  stockOut: StockOutOrmEntity;
}
