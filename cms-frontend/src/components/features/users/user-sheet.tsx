// src/components/features/users/user-sheet.tsx

"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { User } from "@/types/user.types";
import { userService } from "@/services/user.service";

// ============================================================
// CREATE SCHEMA
// ============================================================

const createSchema = z.object({
  username: z
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(50, "Tên đăng nhập không được vượt quá 50 ký tự")
    .regex(/^[a-z0-9_]+$/, "Chỉ được dùng chữ thường, số và dấu _"),

  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt",
    ),

  role: z.enum(["ADMIN", "STAFF"]),
});

// ============================================================
// EDIT SCHEMA
// ============================================================

const editSchema = z.object({
  role: z.enum(["ADMIN", "STAFF"]),
  isActive: z.boolean(),
});

// ============================================================
// TYPES
// ============================================================

type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;

interface UserSheetProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
}

// ============================================================
// COMPONENT
// ============================================================

export function UserSheet({ open, onClose, onSuccess, user }: UserSheetProps) {
  const isEdit = !!user;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // ============================================================
  // CREATE FORM
  // ============================================================

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema) as Resolver<CreateFormValues>,
    defaultValues: {
      username: "",
      password: "",
      role: "STAFF",
    },
  });

  // ============================================================
  // EDIT FORM
  // ============================================================

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editSchema) as Resolver<EditFormValues>,
    defaultValues: {
      role: "STAFF",
      isActive: true,
    },
  });

  // ============================================================
  // FORM WATCH
  // ============================================================

  const createRole = useWatch({
    control: createForm.control,
    name: "role",
  });

  const editRole = useWatch({
    control: editForm.control,
    name: "role",
  });

  const editIsActive = useWatch({
    control: editForm.control,
    name: "isActive",
  });

  // ============================================================
  // RESET FORMS
  // ============================================================

  useEffect(() => {
    if (!open) return;

    if (user) {
      editForm.reset({
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      createForm.reset({
        username: "",
        password: "",
        role: "STAFF",
      });
    }
  }, [open, user, createForm, editForm]);

  // ============================================================
  // CLOSE
  // ============================================================

  function handleClose() {
    setError(null);
    setShowPassword(false);
    onClose();
  }

  // ============================================================
  // CREATE
  // ============================================================

  async function handleCreate(values: CreateFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      await userService.create(values);

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Create user error:", error);

      setError("Tên đăng nhập đã tồn tại hoặc có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  }

  // ============================================================
  // EDIT
  // ============================================================

  async function handleEdit(values: EditFormValues) {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      if (values.role !== user.role) {
        await userService.changeRole(user.id, values.role);
      }

      if (values.isActive !== user.isActive) {
        if (values.isActive) {
          await userService.activate(user.id);
        } else {
          await userService.deactivate(user.id);
        }
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Update user error:", error);

      setError("Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
    >
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        {/* HEADER */}

        <SheetHeader className="pb-4">
          <SheetTitle className="text-base font-semibold text-slate-900">
            {isEdit ? "Chỉnh sửa tài khoản" : "Thêm nhân viên"}
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {/* CREATE FORM */}

        {!isEdit && (
          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="flex-1 overflow-y-auto py-4 space-y-4"
          >
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* USERNAME */}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Tên đăng nhập <span className="text-red-500">*</span>
              </Label>

              <Input
                {...createForm.register("username")}
                placeholder="VD: staff01"
                disabled={isLoading}
                onChange={(e) => {
                  createForm.setValue(
                    "username",
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                    {
                      shouldValidate: true,
                    },
                  );
                }}
                className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900"
              />

              {createForm.formState.errors.username && (
                <p className="text-xs text-red-600">
                  {createForm.formState.errors.username.message}
                </p>
              )}

              <p className="text-xs text-slate-400">
                Chỉ dùng chữ thường, số và dấu _
              </p>
            </div>

            {/* PASSWORD */}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Mật khẩu <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  {...createForm.register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự"
                  disabled={isLoading}
                  className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={isLoading}
                  className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {createForm.formState.errors.password && (
                <p className="text-xs text-red-600">
                  {createForm.formState.errors.password.message}
                </p>
              )}

              <p className="text-xs text-slate-400">
                Phải có chữ hoa, chữ thường, số và ký tự đặc biệt
              </p>
            </div>

            {/* ROLE */}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Vai trò <span className="text-red-500">*</span>
              </Label>

              <Select
                value={createRole}
                disabled={isLoading}
                onValueChange={(value) =>
                  createForm.setValue("role", value as "ADMIN" | "STAFF", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-9 border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="STAFF">Nhân viên</SelectItem>

                  <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* PERMISSION */}

            <div className="rounded-md bg-slate-50 border border-slate-200 px-4 py-3 space-y-1">
              <p className="text-xs font-medium text-slate-500">Phân quyền</p>

              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">Nhân viên:</span>{" "}
                Tạo và gửi phiếu nhập/xuất, xem tồn kho
              </p>

              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">
                  Quản trị viên:
                </span>{" "}
                Duyệt phiếu, quản lý danh mục, điều chỉnh tồn kho
              </p>
            </div>
          </form>
        )}

        {/* EDIT FORM */}

        {isEdit && (
          <form
            onSubmit={editForm.handleSubmit(handleEdit)}
            className="flex-1 overflow-y-auto py-4 space-y-4"
          >
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* PROFILE */}

            <div className="flex items-center gap-3 rounded-md bg-slate-50 border border-slate-200 px-4 py-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-slate-900 text-sm font-medium text-white">
                  {user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.username}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {user?.role === "ADMIN" ? (
                    <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      Nhân viên
                    </span>
                  )}
                  {user?.isActive ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
                      Vô hiệu
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* ROLE */}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Vai trò
              </Label>

              <Select
                value={editRole}
                disabled={isLoading}
                onValueChange={(value) =>
                  editForm.setValue("role", value as "ADMIN" | "STAFF", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-9 border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="STAFF">Nhân viên</SelectItem>

                  <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* STATUS */}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Trạng thái
              </Label>

              <Select
                value={editIsActive ? "active" : "inactive"}
                disabled={isLoading}
                onValueChange={(value) =>
                  editForm.setValue("isActive", value === "active", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-9 border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>

                  <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* PERMISSION */}

            <div className="rounded-md bg-slate-50 border border-slate-200 px-4 py-3 space-y-1">
              <p className="text-xs font-medium text-slate-500">Phân quyền</p>

              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">Nhân viên:</span>{" "}
                Tạo và gửi phiếu nhập/xuất, xem tồn kho
              </p>

              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">
                  Quản trị viên:
                </span>{" "}
                Duyệt phiếu, quản lý danh mục, điều chỉnh tồn kho
              </p>
            </div>
          </form>
        )}

        {/* FOOTER */}

        <Separator />

        <SheetFooter className="pt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1 h-9 border-slate-200 text-slate-700"
            disabled={isLoading}
          >
            Hủy
          </Button>

          <Button
            type="button"
            onClick={() => {
              if (isEdit) {
                void editForm.handleSubmit(handleEdit)();
              } else {
                void createForm.handleSubmit(handleCreate)();
              }
            }}
            className="flex-1 h-9 bg-slate-900 hover:bg-slate-800"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}

            {isEdit ? "Lưu thay đổi" : "Tạo tài khoản"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
