// src/components/layout/header.tsx
"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

export function Header() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  
  const user = useCurrentUser();
  const displayName = user?.username ?? "Người dùng";
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <p className="text-sm text-slate-500">{dateStr}</p>

      <div className="flex items-center gap-3">
        {}
        <div className="flex items-center gap-2 rounded-md px-2 py-1">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-slate-900 text-white text-xs">
              {user ? initial : ""}
            </AvatarFallback>
          </Avatar>

          {user ? (
            <span className="text-sm text-slate-700">{displayName}</span>
          ) : (
            <Skeleton className="h-4 w-16 bg-slate-100" />
          )}
        </div>
      </div>
    </header>
  );
}
