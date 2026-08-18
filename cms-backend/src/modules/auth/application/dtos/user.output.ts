// application/dto/user.output.ts
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/enums/roles.enum';

// KHÔNG bao giờ trả password/hash ra ngoài — chỉ expose field an toàn.
export class UserOutput {
  id: string;
  username: string;
  fullName: string | null;
  role: Role;
  isActive: boolean;

  static from(user: User): UserOutput {
    const output = new UserOutput();
    output.id = user.id;
    output.username = user.username;
    output.fullName = user.fullName;
    output.role = user.role;
    output.isActive = user.isActive;
    return output;
  }
}
