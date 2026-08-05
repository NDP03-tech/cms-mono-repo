// src/types/auth.types.ts
export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
