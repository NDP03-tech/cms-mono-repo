// src/types/user.types.ts
//
// Khớp với UserOutput thật ở BE (chỉ map id/username/fullName/role/isActive
// — KHÔNG có createdAt/updatedAt dù BaseEntity có 2 field này).
export type UserRole = "ADMIN" | "STAFF";

export interface User {
  id: string;
  username: string;
  fullName: string | null;
  role: UserRole;
  isActive: boolean;
}

export interface CreateUserInput {
  username: string;
  password: string;
  role: UserRole;
  fullName?: string;
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
