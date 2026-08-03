// infrastructure/persistence/supplier.orm-entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('suppliers')
export class SupplierOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string | null;

  @Column({ nullable: true })
  address: string | null;

  @Column({ nullable: true })
  email: string | null;

  @Column({ default: true })
  isActive: boolean;
}
