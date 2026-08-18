// application/dto/create-staff.input.ts
import { Role } from '../../domain/enums/roles.enum';

export interface CreateStaffInput {
  username: string;
  password: string;
  role: Role;
  fullName?: string;
  isActive?: boolean;
}
