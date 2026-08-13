// infrastructure/persistence/stock-out-item.orm-entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  // @JoinColumn khai báo tường minh: quan hệ này dùng ĐÚNG cột
  // stockOutId ở trên, tránh TypeORM tự đoán và có thể tạo/khớp
  // sai cột join khi không có annotation này.
  @ManyToOne(() => StockOutOrmEntity, (stockOut) => stockOut.items)
  @JoinColumn({ name: 'stockOutId' })
  stockOut: StockOutOrmEntity;
}
