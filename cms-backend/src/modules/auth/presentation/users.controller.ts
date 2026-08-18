// presentation/users.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
// GIẢ ĐỊNH path — nếu file này đặt ở auth/presentation/, path guard là
// '../infrastructure/guards/...' (khác với path khi import TỪ NGOÀI module
// khác, ví dụ stock-out.controller.ts dùng '../../auth/infrastructure/...').
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/guards/role.guard';
import { Roles } from '../../../shared/decorators/role.decorator';
import { Role } from '../domain/enums/roles.enum';
import type { UserFilters } from '../domain/repositories/user.repository.interface';
import { CreateStaffUseCase } from '../application/use-cases/create-staff.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { ChangeUserRoleUseCase } from '../application/use-cases/change-user-role.use-case';
import { ActivateUserUseCase } from '../application/use-cases/activate-user.use-case';
import { DeactivateUserUseCase } from '../application/use-cases/deactivate-user.use-case';
import type { CreateStaffInput } from '../application/dtos/create-staff.input';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN) // toàn bộ endpoint quản lý user chỉ dành cho ADMIN
export class UsersController {
  constructor(
    private readonly createStaff: CreateStaffUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly changeUserRole: ChangeUserRoleUseCase,
    private readonly activateUser: ActivateUserUseCase,
    private readonly deactivateUser: DeactivateUserUseCase,
    private readonly getUser: GetUserUseCase,
  ) {}

  @Post()
  create(@Body() input: CreateStaffInput) {
    return this.createStaff.execute(input);
  }

  @Get()
  list(@Query() filters: UserFilters) {
    return this.listUsers.execute(filters);
  }
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.getUser.execute(id);
  }
  @Patch(':id/role')
  changeRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.changeUserRole.execute(id, role);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.activateUser.execute(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.deactivateUser.execute(id);
  }
}
