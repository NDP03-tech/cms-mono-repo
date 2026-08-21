"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
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
import { supplierService } from "@/services/supplier.service";

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
  const isEdit = Boolean(supplier);

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

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

    setSubmitError(null);
  }, [open, supplier, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      let result: Supplier;
      if (isEdit && supplier) {
        await supplierService.update(supplier.id, values);
        result = await supplierService.getById(supplier.id);
      } else {
        const supplierId = await supplierService.create(values);
        result = await supplierService.getById(supplierId);
      }

      onSuccess(result);
      onClose();
    } catch (error: unknown) {
      console.error("Supplier submit error:", error);

      setSubmitError(
        getApiErrorMessage(
          error,
          isEdit
            ? "Không thể cập nhật nhà cung cấp."
            : "Không thể thêm nhà cung cấp.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetChange = (nextOpen: boolean) => {
    if (!nextOpen && !isLoading) {
      onClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetChange}>
      <SheetContent
        className="
          flex
          h-full
          w-full
          flex-col
          gap-0
          p-0
          sm:max-w-md
        "
      >
        {/* Header */}
        <SheetHeader className="shrink-0 px-6 py-5">
          <SheetTitle className="text-base font-semibold text-slate-900">
            {isEdit ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {/* Scrollable form content */}
        <form
          id="supplier-form"
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-5 px-6 py-6">
            {/* Submit error */}
            {submitError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm leading-5 text-red-600">{submitError}</p>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="supplier-name"
                className="text-sm font-medium text-slate-700"
              >
                Tên nhà cung cấp <span className="text-red-500">*</span>
              </Label>

              <Input
                id="supplier-name"
                {...register("name")}
                placeholder="VD: Công ty TNHH Dệt may HN"
                className="h-10 w-full border-slate-200 text-sm"
                disabled={isLoading}
              />

              {errors.name && (
                <p className="text-xs leading-4 text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="supplier-phone"
                className="text-sm font-medium text-slate-700"
              >
                Số điện thoại
              </Label>

              <Input
                id="supplier-phone"
                {...register("phone")}
                type="tel"
                placeholder="VD: 0901234567"
                className="h-10 w-full border-slate-200 text-sm"
                disabled={isLoading}
              />

              {errors.phone && (
                <p className="text-xs leading-4 text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="supplier-email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </Label>

              <Input
                id="supplier-email"
                {...register("email")}
                type="email"
                placeholder="VD: contact@supplier.vn"
                className="h-10 w-full border-slate-200 text-sm"
                disabled={isLoading}
              />

              {errors.email && (
                <p className="text-xs leading-4 text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor="supplier-address"
                className="text-sm font-medium text-slate-700"
              >
                Địa chỉ
              </Label>

              <Input
                id="supplier-address"
                {...register("address")}
                placeholder="VD: 123 Nguyễn Trãi, Hà Nội"
                className="h-10 w-full border-slate-200 text-sm"
                disabled={isLoading}
              />

              {errors.address && (
                <p className="text-xs leading-4 text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Footer cố định */}
        <Separator />

        <SheetFooter className="shrink-0 bg-white px-6 py-4">
          <div className="flex w-full gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="h-10 flex-1 border-slate-200 text-slate-700"
            >
              Hủy
            </Button>

            <Button
              type="submit"
              form="supplier-form"
              disabled={isLoading}
              className="h-10 flex-1 bg-slate-900 hover:bg-slate-800"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

              {isLoading
                ? isEdit
                  ? "Đang lưu..."
                  : "Đang thêm..."
                : isEdit
                  ? "Lưu thay đổi"
                  : "Thêm nhà cung cấp"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Lấy message từ Axios error / API response.
 */
function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      }
    ).response;

    const message = response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
