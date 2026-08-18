// application/use-cases/list-users.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
  type UserFilters,
} from '../../domain/repositories/user.repository.interface';
import { UserOutput } from '../dtos/user.output';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(filters?: UserFilters): Promise<UserOutput[]> {
    const users = await this.userRepository.findAll(filters);
    return users.map(UserOutput.from);
  }
}
