// src/app/(dashboard)/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserTable } from "@/components/features/users/user-table";
import { UserSheet } from "@/components/features/users/user-sheet";
import { UserDeleteDialog } from "@/components/features/users/user-delete-dialog";
import { User, UserRole } from "@/types/user.types";
import { userService } from "@/services/user.service";

function getCurrentUserId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const token = localStorage.getItem("access_token");
  if (!token) return undefined;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch {
    return undefined;
  }
}

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentUserId] = useState<string | undefined>(getCurrentUserId);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const data = await userService.list();
      setAllUsers(data);
    } catch {
      setAllUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = allUsers;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((u) => u.username.toLowerCase().includes(q));
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === (roleFilter as UserRole));
    }

    setUsers(filtered);
  }, [search, roleFilter, allUsers]);

  function handleEdit(user: User) {
    setEditUser(user);
    setSheetOpen(true);
  }

  function handleDelete(user: User) {
    setDeleteUser(user);
    setDeleteOpen(true);
  }

  function handleAddNew() {
    setEditUser(null);
    setSheetOpen(true);
  }

  // Stats
  const totalAdmin = allUsers.filter((u) => u.role === "ADMIN").length;
  const totalStaff = allUsers.filter((u) => u.role === "STAFF").length;
  const totalActive = allUsers.filter((u) => u.isActive).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Quản lý tài khoản
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Thêm và quản lý tài khoản nhân viên
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          size="sm"
          className="h-9 bg-slate-900 hover:bg-slate-800 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Quản trị viên
            </p>
            <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-slate-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-slate-900 mt-2">
            {totalAdmin}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Nhân viên
            </p>
            <div className="h-7 w-7 rounded-md bg-blue-50 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">S</span>
            </div>
          </div>
          <p className="text-2xl font-semibold text-slate-900 mt-2">
            {totalStaff}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Đang hoạt động
            </p>
            <div className="h-7 w-7 rounded-md bg-emerald-50 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-600">✓</span>
            </div>
          </div>
          <p className="text-2xl font-semibold text-emerald-600 mt-2">
            {totalActive}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm theo tên đăng nhập..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm border-slate-200"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm border-slate-200">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="ADMIN">Quản trị viên</SelectItem>
            <SelectItem value="STAFF">Nhân viên</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400 ml-auto">
          {users.length} tài khoản
        </p>
      </div>

      {/* Table */}
      <UserTable
        users={users}
        isLoading={isLoading}
        currentUserId={currentUserId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Sheet */}
      <UserSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSuccess={fetchUsers}
        user={editUser}
      />

      {/* Delete Dialog */}
      <UserDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={fetchUsers}
        user={deleteUser}
      />
    </div>
  );
}
