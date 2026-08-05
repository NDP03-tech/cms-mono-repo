// src/services/auth.service.ts
import api from '@/lib/axios';
import { AuthResponse, LoginInput } from '@/types/auth.types';

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', input);
    return data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};