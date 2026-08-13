// infrastructure/persistence/stock-out.orm-entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockOutEnum } from '../../domain/enums/stock-out-status.enum';
import { StockOutItemOrmEntity } from './stock-out-item.orm-entity';

@Entity('stock_out')
export class StockOutOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  customerId: string;

  @Column()
  createdBy: string;

  @Column({ type: 'enum', enum: StockOutEnum, default: StockOutEnum.DRAFT })
  status: StockOutEnum;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ length: 10 })
  currency: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  approvedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  // Thông tin người nhận hàng — nhập khi tạo phiếu, hiển thị ở chi tiết phiếu
  @Column({ type: 'varchar', length: 255, nullable: true })
  recipientName: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  recipientPhone: string | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  // orphanedRowAction: 'delete' — BẮT BUỘC để TypeORM tự xoá row item
  // đã bị loại khỏi mảng `items` khi save() (vd: sau khi removeItem()).
  // Thiếu option này thì item bị xoá ở domain vẫn còn sót trong DB.
  @OneToMany(() => StockOutItemOrmEntity, (item) => item.stockOut, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  items: StockOutItemOrmEntity[];
}
