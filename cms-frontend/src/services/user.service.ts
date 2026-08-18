// src/services/user.service.ts
import api from "@/lib/axios";
import type {
  User,
  UserFilters,
  CreateUserInput,
  UserRole,
} from "@/types/user.types";

export const userService = {
  async list(filters?: UserFilters): Promise<User[]> {
    const { data } = await api.get<User[]>("/users", { params: filters });
    return data ?? [];
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  /**
   * Admin tạo tài khoản staff — PHẢI gọi /users (CreateStaffUseCase),
   * KHÔNG gọi /auth/register:
   * 1. /auth/register hard-code role=STAFF ở BE, field `role` gửi lên sẽ
   *    bị bỏ qua — không thể tạo ADMIN qua đường này.
   * 2. RegisterUseCase.execute() trả về void, không có `{ id }` — đọc
   *    data.id từ endpoint đó luôn ra undefined.
   * 3. /auth/register là endpoint public tự đăng ký, không bị RolesGuard
   *    chặn — không đúng ý "chỉ admin mới được tạo tài khoản staff".
   */
  async create(input: CreateUserInput): Promise<User> {
    const { data } = await api.post<User>("/users", input);
    return data;
  },

  async changeRole(id: string, role: UserRole): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}/role`, { role });
    return data;
  },

  async activate(id: string): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}/activate`);
    return data;
  },

  async deactivate(id: string): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}/deactivate`);
    return data;
  },

  // Cố tình KHÔNG có delete(): User domain chỉ có deactivate()/activate(),
  // không có hard-delete (khác Customer) — để giữ audit trail (ai tạo/duyệt
  // phiếu nào vẫn tra được dù nhân viên đó đã nghỉ việc). "Xoá" nhân viên
  // trong UI nên là gọi deactivate(), không phải xoá bản ghi khỏi DB.
};
