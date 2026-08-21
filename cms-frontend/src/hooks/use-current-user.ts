"use client";

import { useEffect, useState } from "react";

import type { UserRole } from "@/types/user.types";

export interface CurrentUser {
  id: string;
  username: string;
  role: UserRole;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) setUser(null);
          return;
        }

        const currentUser = (await response.json()) as CurrentUser;
        if (!cancelled) setUser(currentUser);
      } catch {
        if (!cancelled) setUser(null);
      }
    }

    void loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}

export function useIsAdmin() {
  return useCurrentUser()?.role === "ADMIN";
}

export function useIsStaff() {
  return useCurrentUser()?.role === "STAFF";
}
