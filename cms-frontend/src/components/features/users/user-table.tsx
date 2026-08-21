// src/components/features/users/user-table.tsx
"use client";

import { Pencil, Ban } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { User } from "@/types/user.types";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  currentUserId?: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({
  users,
  isLoading,
  currentUserId,
  onEdit,
  onDelete,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {[
                "Tên đăng nhập",
                "Vai trò",
                "Trạng thái",
                "Họ và tên",
                "Thao tác",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <Skeleton className="h-4 w-full bg-slate-100" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <p className="text-sm font-medium text-slate-900">
            Chưa có tài khoản nào
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Thêm nhân viên đầu tiên để bắt đầu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Tên đăng nhập
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Vai trò
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Họ và tên
              </th>
              <th className="px-4 py-3 w-[100px] text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-900 text-xs font-medium text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {user.username}
                      </p>
                      {currentUserId === user.id && (
                        <p className="text-xs text-slate-400">Bạn</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {user.role === "ADMIN" ? (
                    <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white">
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      Nhân viên
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.isActive ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
                      Vô hiệu
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {user.fullName || "-"}
                </td>
                <td className="px-4 py-3">
                  <TooltipProvider delayDuration={200}>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onEdit(user)}
                            disabled={currentUserId === user.id}
                            className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {currentUserId === user.id
                            ? "Không thể tự chỉnh sửa tài khoản của mình"
                            : "Chỉnh sửa"}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onDelete(user)}
                            disabled={
                              currentUserId === user.id || !user.isActive
                            }
                            className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {currentUserId === user.id
                            ? "Không thể tự vô hiệu hóa tài khoản của mình"
                            : !user.isActive
                              ? "Đã vô hiệu hóa — vào Sửa để kích hoạt lại"
                              : "Vô hiệu hóa"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
