// src/services/auth.service.ts

import api from "@/lib/axios";
import { AuthResponse, LoginInput } from "@/types/auth.types";

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", input);

    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
