// src/components/features/suppliers/supplier-sheet.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { Supplier } from "@/types/supplier.types";

const schema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface SupplierSheetProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (supplier?: Supplier) => void;
  supplier?: Supplier | null;
}

export function SupplierSheet({
  open,
  onClose,
  onSuccess,
  supplier,
}: SupplierSheetProps) {
  const isEdit = !!supplier;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        phone: supplier.phone ?? "",
        email: supplier.email ?? "",
        address: supplier.address ?? "",
      });
    } else {
      reset({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
    setError(null);
  }, [supplier, open, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      // Khi kết nối BE thật uncomment:
      // if (isEdit && supplier) {
      //   await supplierService.update(supplier.id, values);
      // } else {
      //   await supplierService.create(values);
      // }

      await new Promise((resolve) => setTimeout(resolve, 400));
      onSuccess(values as unknown as Supplier);
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base font-semibold text-slate-900">
            {isEdit ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}
          </SheetTitle>
        </SheetHeader>

        <Separator />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto py-4 space-y-4"
        >
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Tên nhà cung cấp <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("name")}
              placeholder="VD: Công ty TNHH Dệt may HN"
              className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Số điện thoại
            </Label>
            <Input
              {...register("phone")}
              placeholder="VD: 0901234567"
              className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900"
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Email
            </Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="VD: contact@supplier.vn"
              className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Địa chỉ
            </Label>
            <Input
              {...register("address")}
              placeholder="VD: 123 Nguyễn Trãi, Hà Nội"
              className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900"
            />
          </div>
        </form>

        <Separator />

        <SheetFooter className="pt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-9 border-slate-200 text-slate-700"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="flex-1 h-9 bg-slate-900 hover:bg-slate-800"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? "Lưu thay đổi" : "Thêm nhà cung cấp"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
