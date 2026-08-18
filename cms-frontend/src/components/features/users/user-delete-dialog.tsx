// src/components/features/users/user-delete-dialog.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { User } from "@/types/user.types";
import { userService } from "@/services/user.service";

interface UserDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export function UserDeleteDialog({
  open,
  onClose,
  onSuccess,
  user,
}: UserDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!user) return;
    setIsLoading(true);
    try {
      await userService.delete(user.id);
      onSuccess();
      onClose();
    } catch {
      // soft delete nên không cần handle lỗi FK
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-slate-900">
            Vô hiệu hóa tài khoản
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-500">
            Bạn có chắc muốn vô hiệu hóa tài khoản{" "}
            <span className="font-medium text-slate-700">{user?.username}</span>
            ? Tài khoản sẽ không thể đăng nhập nhưng dữ liệu vẫn được giữ lại.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="h-9 border-slate-200 text-slate-700"
            disabled={isLoading}
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="h-9 bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Vô hiệu hóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
