// infrastructure/persistence/supplier.orm-entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('suppliers')
export class SupplierOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  phone: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  address: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  email: string | null;

  @Column({ default: true })
  isActive: boolean;
}
