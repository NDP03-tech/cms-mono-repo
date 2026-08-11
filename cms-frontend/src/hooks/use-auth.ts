// src/hooks/use-auth.ts

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { LoginInput } from "@/types/auth.types";

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(input: LoginInput) {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(input);

      const redirect = searchParams.get("redirect") || "/";

      router.replace(redirect);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Username hoặc mật khẩu không đúng";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return {
    login,
    logout,
    isLoading,
    error,
  };
}
