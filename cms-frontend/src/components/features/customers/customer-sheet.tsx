// src/components/features/customers/customer-sheet.tsx
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
import { Customer } from "@/types/customer.types";

const schema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface CustomerSheetProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (customer?: Customer) => void;
  customer?: Customer | null;
}

export function CustomerSheet({
  open,
  onClose,
  onSuccess,
  customer,
}: CustomerSheetProps) {
  const isEdit = !!customer;
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
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        phone: customer.phone ?? "",
        email: customer.email ?? "",
      });
    } else {
      reset({ name: "", phone: "", email: "" });
    }
    setError(null);
  }, [customer, open, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      // Khi kết nối BE thật uncomment:
      // if (isEdit && customer) {
      //   await customerService.update(customer.id, values);
      // } else {
      //   await customerService.create(values);
      // }

      await new Promise((resolve) => setTimeout(resolve, 400));
      onSuccess(values as unknown as Customer);
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
            {isEdit ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}
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
              Tên khách hàng <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("name")}
              placeholder="VD: Nguyễn Văn An"
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
              placeholder="VD: 0912345678"
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
              placeholder="VD: customer@gmail.com"
              className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
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
            {isEdit ? "Lưu thay đổi" : "Thêm khách hàng"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
