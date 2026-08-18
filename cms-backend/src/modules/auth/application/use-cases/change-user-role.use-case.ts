// application/use-cases/change-user-role.use-case.ts
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../domain/repositories/user.repository.interface';
import { Role } from '../../domain/enums/roles.enum';
import { BusinessRuleException } from '../../../../shared/exceptions/domain.exception';
import { UserOutput } from '../dtos/user.output';

@Injectable()
export class ChangeUserRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, role: Role): Promise<UserOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    try {
      const updated = user.changeRole(role); // throw nếu role trùng role cũ
      await this.userRepository.save(updated);
      return UserOutput.from(updated);
    } catch (err) {
      if (err instanceof BusinessRuleException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
}
