// src/hooks/use-auth.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { LoginInput } from "@/types/auth.types";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(input: LoginInput) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(input);
      authService.setToken(response.accessToken);
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Email hoặc mật khẩu không đúng";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    await authService.logout();
    router.push("/login");
  }

  return { login, logout, isLoading, error };
}
