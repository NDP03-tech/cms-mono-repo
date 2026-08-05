// src/components/layout/header.tsx
"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <p className="text-sm text-slate-500">{dateStr}</p>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="h-8 w-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors relative">
          <Bell className="h-4 w-4" />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-100 transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-slate-900 text-white text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-slate-700">Admin</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-slate-500">
              Tài khoản
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm cursor-pointer">
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm cursor-pointer">
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm text-red-600 cursor-pointer">
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
