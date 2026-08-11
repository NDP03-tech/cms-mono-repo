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
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Customer } from "@/types/customer.types";
import { customerService } from "@/services/customer.service";

const schema = z.object({
  name: z.string().trim().min(1, "Tên không được để trống"),

  phone: z.string().optional(),

  email: z
    .string()
    .trim()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),
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
  const isEdit = Boolean(customer);

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
    },
  });

  /**
   * Populate form khi:
   * - Mở Sheet
   * - Chuyển create -> edit
   * - Chuyển sang customer khác
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name: customer?.name ?? "",
      phone: customer?.phone ?? "",
      email: customer?.email ?? "",
    });

    setSubmitError(null);
  }, [open, customer, reset]);

  /**
   * Create / Update customer
   */
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      let result: Customer;

      if (isEdit && customer) {
        // UPDATE
        result = await customerService.update(customer.id, values);
      } else {
        // CREATE
        result = await customerService.create(values);
      }

      /**
       * API thành công
       *
       * Trả customer mới/cập nhật về component cha
       * để component cha refresh/update table.
       */
      onSuccess(result);

      /**
       * Chỉ đóng Sheet sau khi API thành công.
       */
      onClose();
    } catch (error: unknown) {
      console.error("Customer submit error:", error);

      setSubmitError(
        getApiErrorMessage(
          error,
          isEdit
            ? "Không thể cập nhật khách hàng."
            : "Không thể thêm khách hàng.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Không cho đóng Sheet trong lúc đang gọi API.
   */
  const handleSheetChange = (nextOpen: boolean) => {
    if (!nextOpen && !isLoading) {
      onClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetChange}>
      <SheetContent
        side="right"
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
        {/* HEADER */}
        <SheetHeader className="shrink-0 border-b px-6 py-5">
          <SheetTitle className="text-lg font-semibold text-slate-900">
            {isEdit ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}
          </SheetTitle>

          <p className="text-sm text-slate-500">
            {isEdit
              ? "Cập nhật thông tin khách hàng."
              : "Nhập thông tin để tạo khách hàng mới."}
          </p>
        </SheetHeader>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* CONTENT */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="w-full space-y-6 px-6 py-6">
              {/* API ERROR */}
              {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm leading-5 text-red-600">
                    {submitError}
                  </p>
                </div>
              )}

              {/* NAME */}
              <div className="space-y-2">
                <Label
                  htmlFor="customer-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Tên khách hàng
                  <span className="ml-1 text-red-500">*</span>
                </Label>

                <Input
                  id="customer-name"
                  {...register("name")}
                  disabled={isLoading}
                  placeholder="Nguyễn Văn An"
                  className="
                    h-10
                    w-full
                    border-slate-200
                    bg-white
                    text-sm
                    shadow-sm
                    placeholder:text-slate-400
                    focus-visible:border-slate-400
                    focus-visible:ring-1
                    focus-visible:ring-slate-400
                  "
                />

                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* PHONE */}
              <div className="space-y-2">
                <Label
                  htmlFor="customer-phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Số điện thoại
                </Label>

                <Input
                  id="customer-phone"
                  {...register("phone")}
                  type="tel"
                  disabled={isLoading}
                  placeholder="0912345678"
                  className="
                    h-10
                    w-full
                    border-slate-200
                    bg-white
                    text-sm
                    shadow-sm
                    placeholder:text-slate-400
                    focus-visible:border-slate-400
                    focus-visible:ring-1
                    focus-visible:ring-slate-400
                  "
                />

                {errors.phone && (
                  <p className="text-xs text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label
                  htmlFor="customer-email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </Label>

                <Input
                  id="customer-email"
                  {...register("email")}
                  type="email"
                  disabled={isLoading}
                  placeholder="customer@gmail.com"
                  className="
                    h-10
                    w-full
                    border-slate-200
                    bg-white
                    text-sm
                    shadow-sm
                    placeholder:text-slate-400
                    focus-visible:border-slate-400
                    focus-visible:ring-1
                    focus-visible:ring-slate-400
                  "
                />

                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="shrink-0 border-t bg-white px-6 py-4">
            <div className="flex w-full gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="h-10 flex-1 border-slate-200"
              >
                Hủy
              </Button>

              <Button
                type="submit"
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
                    : "Thêm khách hàng"}
              </Button>
            </div>
          </div>
        </form>
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
