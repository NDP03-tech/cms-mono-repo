#!/bin/bash

# ============================================================
# CMS Quản Lý Kho - DDD Project Structure Generator
# Chạy trong thư mục gốc của NestJS project (cùng cấp với src/)
# ============================================================

set -e

BASE="src"

echo "🚀 Đang tạo cấu trúc DDD cho CMS Quản Lý Kho..."
echo ""

# ─── 1. TẠO THƯ MỤC ─────────────────────────────────────────────────────────

dirs=(
  "$BASE/modules/auth/domain/entities"
  "$BASE/modules/auth/domain/value-objects"
  "$BASE/modules/auth/domain/repositories"
  "$BASE/modules/auth/application/use-cases"
  "$BASE/modules/auth/application/dtos"
  "$BASE/modules/auth/infrastructure/persistence"
  "$BASE/modules/auth/infrastructure/orm"
  "$BASE/modules/auth/presentation"

  "$BASE/modules/products/domain/entities"
  "$BASE/modules/products/domain/repositories"
  "$BASE/modules/products/application/use-cases"
  "$BASE/modules/products/application/dtos"
  "$BASE/modules/products/infrastructure/persistence"
  "$BASE/modules/products/infrastructure/orm"
  "$BASE/modules/products/presentation"

  "$BASE/modules/suppliers/domain/entities"
  "$BASE/modules/suppliers/domain/repositories"
  "$BASE/modules/suppliers/application/use-cases"
  "$BASE/modules/suppliers/application/dtos"
  "$BASE/modules/suppliers/infrastructure/persistence"
  "$BASE/modules/suppliers/infrastructure/orm"
  "$BASE/modules/suppliers/presentation"

  "$BASE/modules/customers/domain/entities"
  "$BASE/modules/customers/domain/repositories"
  "$BASE/modules/customers/application/use-cases"
  "$BASE/modules/customers/application/dtos"
  "$BASE/modules/customers/infrastructure/persistence"
  "$BASE/modules/customers/infrastructure/orm"
  "$BASE/modules/customers/presentation"

  "$BASE/modules/inventory/domain/entities"
  "$BASE/modules/inventory/domain/value-objects"
  "$BASE/modules/inventory/domain/repositories"
  "$BASE/modules/inventory/domain/services"
  "$BASE/modules/inventory/application/use-cases"
  "$BASE/modules/inventory/application/dtos"
  "$BASE/modules/inventory/infrastructure/persistence"
  "$BASE/modules/inventory/infrastructure/orm"
  "$BASE/modules/inventory/presentation"

  "$BASE/modules/finance/domain/entities"
  "$BASE/modules/finance/domain/repositories"
  "$BASE/modules/finance/application/use-cases"
  "$BASE/modules/finance/application/dtos"
  "$BASE/modules/finance/infrastructure/persistence"
  "$BASE/modules/finance/infrastructure/orm"
  "$BASE/modules/finance/presentation"

  "$BASE/modules/reports/application/use-cases"
  "$BASE/modules/reports/application/dtos"
  "$BASE/modules/reports/infrastructure"
  "$BASE/modules/reports/presentation"

  "$BASE/modules/audit-log/domain/entities"
  "$BASE/modules/audit-log/domain/repositories"
  "$BASE/modules/audit-log/application"
  "$BASE/modules/audit-log/infrastructure/persistence"
  "$BASE/modules/audit-log/infrastructure/orm"
  "$BASE/modules/audit-log/presentation"

  "$BASE/shared/domain"
  "$BASE/shared/infrastructure/database/migrations"
  "$BASE/shared/infrastructure/redis"
  "$BASE/shared/infrastructure/audit"
  "$BASE/shared/exceptions"
  "$BASE/shared/decorators"
  "$BASE/shared/guards"
  "$BASE/shared/interceptors"
  "$BASE/shared/filters"
)

for dir in "${dirs[@]}"; do
  mkdir -p "$dir"
done

echo "✅ Tạo xong ${#dirs[@]} thư mục"

# ─── 2. SHARED ───────────────────────────────────────────────────────────────

cat > "$BASE/shared/domain/base.entity.ts" << 'EOF'
export abstract class BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
EOF

cat > "$BASE/shared/exceptions/domain.exception.ts" << 'EOF'
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class BusinessRuleException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleException';
  }
}
EOF

cat > "$BASE/shared/interceptors/audit.interceptor.ts" << 'EOF'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // TODO: ghi audit log
    return next.handle();
  }
}
EOF

cat > "$BASE/shared/filters/domain-exception.filter.ts" << 'EOF'
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { DomainException } from '../exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(422).json({ message: exception.message });
  }
}
EOF

# ─── 3. AUTH MODULE ──────────────────────────────────────────────────────────

cat > "$BASE/modules/auth/domain/entities/user.entity.ts" << 'EOF'
import { BaseEntity } from '../../../../shared/domain/base.entity';

export class User extends BaseEntity {
  readonly email: string;
  readonly passwordHash: string;
  readonly roleId: string;
  readonly isActive: boolean;
}
EOF

cat > "$BASE/modules/auth/domain/value-objects/email.vo.ts" << 'EOF'
import { DomainException } from '../../../../shared/exceptions/domain.exception';

export class Email {
  readonly value: string;

  constructor(email: string) {
    if (!email || !email.includes('@')) {
      throw new DomainException('Email không hợp lệ');
    }
    this.value = email.toLowerCase().trim();
  }
}
EOF

cat > "$BASE/modules/auth/domain/repositories/user.repository.interface.ts" << 'EOF'
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
EOF

cat > "$BASE/modules/auth/application/dtos/login.dto.ts" << 'EOF'
export class LoginDto {
  email: string;
  password: string;
}

export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}
EOF

cat > "$BASE/modules/auth/application/use-cases/login.use-case.ts" << 'EOF'
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { LoginDto, TokenResponseDto } from '../dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: LoginDto): Promise<TokenResponseDto> {
    // TODO: implement login logic
    throw new Error('Not implemented');
  }
}
EOF

cat > "$BASE/modules/auth/application/use-cases/refresh-token.use-case.ts" << 'EOF'
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenUseCase {
  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    // TODO: validate refresh token từ Redis, cấp access token mới
    throw new Error('Not implemented');
  }
}
EOF

cat > "$BASE/modules/auth/infrastructure/orm/user.orm-entity.ts" << 'EOF'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
EOF

cat > "$BASE/modules/auth/infrastructure/persistence/user.repository.ts" << 'EOF'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm/user.orm-entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    // TODO: map ORM entity → domain entity
    throw new Error('Not implemented');
  }

  async findById(id: string): Promise<User | null> {
    throw new Error('Not implemented');
  }

  async save(user: User): Promise<User> {
    throw new Error('Not implemented');
  }
}
EOF

cat > "$BASE/modules/auth/presentation/auth.controller.ts" << 'EOF'
import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { LoginDto } from '../application/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
EOF

cat > "$BASE/modules/auth/infrastructure/auth.module.ts" << 'EOF'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../presentation/auth.controller';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { UserRepository } from './persistence/user.repository';
import { UserOrmEntity } from './orm/user.orm-entity';
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RefreshTokenUseCase,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
})
export class AuthModule {}
EOF

# ─── 4. INVENTORY MODULE ─────────────────────────────────────────────────────

cat > "$BASE/modules/inventory/domain/entities/inventory-balance.entity.ts" << 'EOF'
import { BaseEntity } from '../../../../shared/domain/base.entity';
import { BusinessRuleException } from '../../../../shared/exceptions/domain.exception';

export class InventoryBalance extends BaseEntity {
  readonly productId: string;
  readonly quantity: number;

  decreaseQuantity(amount: number): InventoryBalance {
    if (this.quantity < amount) {
      throw new BusinessRuleException(
        `Tồn kho không đủ. Hiện có: ${this.quantity}, cần xuất: ${amount}`,
      );
    }
    return Object.assign(Object.create(Object.getPrototypeOf(this)), {
      ...this,
      quantity: this.quantity - amount,
    });
  }
}
EOF

cat > "$BASE/modules/inventory/domain/entities/stock-in.entity.ts" << 'EOF'
import { BaseEntity } from '../../../../shared/domain/base.entity';
import { BusinessRuleException } from '../../../../shared/exceptions/domain.exception';

export type StockInStatus = 'DRAFT' | 'APPROVED' | 'CANCELLED';

export class StockIn extends BaseEntity {
  readonly code: string;
  readonly supplierId: string;
  readonly status: StockInStatus;
  readonly totalAmount: number;

  approve(): StockIn {
    if (this.status !== 'DRAFT') {
      throw new BusinessRuleException('Chỉ có thể duyệt phiếu ở trạng thái DRAFT');
    }
    return Object.assign(Object.create(Object.getPrototypeOf(this)), {
      ...this,
      status: 'APPROVED',
    });
  }

  cancel(): StockIn {
    if (this.status === 'APPROVED') {
      throw new BusinessRuleException('Không được xóa chứng từ đã duyệt, chỉ được hủy');
    }
    return Object.assign(Object.create(Object.getPrototypeOf(this)), {
      ...this,
      status: 'CANCELLED',
    });
  }
}
EOF

cat > "$BASE/modules/inventory/domain/repositories/inventory-balance.repository.interface.ts" << 'EOF'
import { InventoryBalance } from '../entities/inventory-balance.entity';

export interface IInventoryBalanceRepository {
  findByProductIdWithLock(productId: string): Promise<InventoryBalance | null>;
  save(balance: InventoryBalance): Promise<InventoryBalance>;
}

export const INVENTORY_BALANCE_REPOSITORY = Symbol('IInventoryBalanceRepository');
EOF

cat > "$BASE/modules/inventory/domain/repositories/stock-in.repository.interface.ts" << 'EOF'
import { StockIn } from '../entities/stock-in.entity';

export interface IStockInRepository {
  findById(id: string): Promise<StockIn | null>;
  save(stockIn: StockIn): Promise<StockIn>;
}

export const STOCK_IN_REPOSITORY = Symbol('IStockInRepository');
EOF

cat > "$BASE/modules/inventory/domain/services/inventory-domain.service.ts" << 'EOF'
import { InventoryBalance } from '../entities/inventory-balance.entity';

export class InventoryDomainService {
  validateStockOut(balance: InventoryBalance, requestedQty: number): void {
    balance.decreaseQuantity(requestedQty); // throws nếu âm kho
  }
}
EOF

cat > "$BASE/modules/inventory/application/dtos/create-stock-in.dto.ts" << 'EOF'
export class CreateStockInItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class CreateStockInDto {
  supplierId: string;
  items: CreateStockInItemDto[];
}
EOF

cat > "$BASE/modules/inventory/application/dtos/create-stock-out.dto.ts" << 'EOF'
export class CreateStockOutItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class CreateStockOutDto {
  customerId: string;
  items: CreateStockOutItemDto[];
}
EOF

cat > "$BASE/modules/inventory/application/use-cases/create-stock-in.use-case.ts" << 'EOF'
import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IStockInRepository, STOCK_IN_REPOSITORY } from '../../domain/repositories/stock-in.repository.interface';
import { CreateStockInDto } from '../dtos/create-stock-in.dto';

@Injectable()
export class CreateStockInUseCase {
  constructor(
    @Inject(STOCK_IN_REPOSITORY)
    private readonly stockInRepository: IStockInRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: CreateStockInDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // 1. Tạo phiếu nhập
      // 2. Tạo inventory_transaction
      // 3. Cập nhật inventory_balance
      // 4. Tạo cash_transaction (chi phí)
      throw new Error('Not implemented');
    });
  }
}
EOF

cat > "$BASE/modules/inventory/application/use-cases/create-stock-out.use-case.ts" << 'EOF'
import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IInventoryBalanceRepository, INVENTORY_BALANCE_REPOSITORY } from '../../domain/repositories/inventory-balance.repository.interface';
import { InventoryDomainService } from '../../domain/services/inventory-domain.service';
import { CreateStockOutDto } from '../dtos/create-stock-out.dto';

@Injectable()
export class CreateStockOutUseCase {
  constructor(
    @Inject(INVENTORY_BALANCE_REPOSITORY)
    private readonly balanceRepository: IInventoryBalanceRepository,
    private readonly inventoryDomainService: InventoryDomainService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: CreateStockOutDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      for (const item of dto.items) {
        // 1. SELECT FOR UPDATE → lock tồn kho
        const balance = await this.balanceRepository.findByProductIdWithLock(item.productId);

        // 2. Domain service kiểm tra tồn âm
        this.inventoryDomainService.validateStockOut(balance, item.quantity);

        // 3. Tạo stock_out, stock_out_items
        // 4. Cập nhật inventory_balance
        // 5. Tạo cash_transaction (doanh thu)
      }
      throw new Error('Not implemented');
    });
  }
}
EOF

cat > "$BASE/modules/inventory/presentation/inventory.controller.ts" << 'EOF'
import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateStockInUseCase } from '../application/use-cases/create-stock-in.use-case';
import { CreateStockOutUseCase } from '../application/use-cases/create-stock-out.use-case';
import { CreateStockInDto } from '../application/dtos/create-stock-in.dto';
import { CreateStockOutDto } from '../application/dtos/create-stock-out.dto';

@Controller()
export class InventoryController {
  constructor(
    private readonly createStockIn: CreateStockInUseCase,
    private readonly createStockOut: CreateStockOutUseCase,
  ) {}

  @Post('stock-in')
  stockIn(@Body() dto: CreateStockInDto) {
    return this.createStockIn.execute(dto);
  }

  @Post('stock-out')
  stockOut(@Body() dto: CreateStockOutDto) {
    return this.createStockOut.execute(dto);
  }

  @Get('inventory')
  getInventory() {
    // TODO: gọi use-case
  }
}
EOF

cat > "$BASE/modules/inventory/infrastructure/inventory.module.ts" << 'EOF'
import { Module } from '@nestjs/common';
import { InventoryController } from '../presentation/inventory.controller';
import { CreateStockInUseCase } from '../application/use-cases/create-stock-in.use-case';
import { CreateStockOutUseCase } from '../application/use-cases/create-stock-out.use-case';
import { InventoryDomainService } from '../domain/services/inventory-domain.service';
import { STOCK_IN_REPOSITORY } from '../domain/repositories/stock-in.repository.interface';
import { INVENTORY_BALANCE_REPOSITORY } from '../domain/repositories/inventory-balance.repository.interface';

@Module({
  controllers: [InventoryController],
  providers: [
    CreateStockInUseCase,
    CreateStockOutUseCase,
    InventoryDomainService,
    { provide: STOCK_IN_REPOSITORY, useClass: class {} as any },
    { provide: INVENTORY_BALANCE_REPOSITORY, useClass: class {} as any },
  ],
})
export class InventoryModule {}
EOF

# ─── 5. APP.MODULE ───────────────────────────────────────────────────────────

cat > "$BASE/app.module.ts" << 'EOF'
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { InventoryModule } from './modules/inventory/infrastructure/inventory.module';

@Module({
  imports: [
    AuthModule,
    InventoryModule,
    // TODO: ProductsModule, SuppliersModule, CustomersModule
    // TODO: FinanceModule, ReportsModule, AuditLogModule
  ],
})
export class AppModule {}
EOF

# ─── SUMMARY ─────────────────────────────────────────────────────────────────
echo ""
echo "✅ Hoàn tất! Tổng kết:"
echo "   📁 Thư mục: $(find $BASE -type d | wc -l)"
echo "   📄 File TS: $(find $BASE -name '*.ts' | wc -l)"
echo ""
echo "📦 Cài thêm các package cần thiết:"
echo "   npm install @nestjs/typeorm typeorm pg @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt"
echo "   npm install @nestjs/cache-manager cache-manager ioredis"
echo "   npm install -D @types/bcrypt @types/passport-jwt"
echo ""
echo "🗂️  Cấu trúc thư mục:"
find $BASE -type d | sort | sed 's|[^/]*/|  |g'