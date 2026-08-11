// src/components/features/products/product-sheet.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Package } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Product } from "@/types/product.types";
import { productService } from "@/services/product.service";

const schema = z.object({
  sku: z.string().trim().min(1, "SKU không được để trống"),

  name: z.string().trim().min(1, "Tên sản phẩm không được để trống"),

  unit: z.string().trim().optional(),

  costPrice: z.coerce.number().min(0, "Giá nhập không được âm"),

  currency: z
    .string()
    .trim()
    .min(1, "Đơn vị tiền tệ không được để trống")
    .max(10, "Đơn vị tiền tệ không quá 10 ký tự"),
});

type FormValues = z.infer<typeof schema>;

interface ProductSheetProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (product?: Product) => void;
  product?: Product | null;
}

const EMPTY_FORM: FormValues = {
  sku: "",
  name: "",
  unit: "",
  costPrice: 0,
  currency: "VND",
};

export function ProductSheet({
  open,
  onClose,
  onSuccess,
  product,
}: ProductSheetProps) {
  const isEdit = Boolean(product);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_FORM,
  });

  /**
   * Populate dữ liệu khi:
   * - Mở sheet
   * - Chuyển create -> edit
   * - Chuyển sang product khác
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (product) {
      reset({
        sku: product.sku?.toUpperCase() ?? "",
        name: product.name ?? "",
        unit: product.unit ?? "",
        costPrice: product.costPrice ?? 0,
        currency: product.currency?.toUpperCase() ?? "VND",
      });
    } else {
      reset(EMPTY_FORM);
    }

    setError(null);
  }, [open, product, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setError(null);

    const payload: FormValues = {
      ...values,
      sku: values.sku.trim().toUpperCase(),
      name: values.name.trim(),
      unit: values.unit?.trim() || undefined,
      currency: values.currency.trim().toUpperCase(),
    };

    try {
      let result: Product | undefined;

      if (isEdit && product) {
        /**
         * EDIT
         */
        await productService.update(product.id, payload);

        /**
         * Nếu API update không trả Product,
         * lấy lại product mới nhất.
         */
        result = await productService.getById(product.id);
      } else {
        /**
         * CREATE
         *
         * productService.create() hiện tại trả về id.
         */
        const id = await productService.create(payload);

        /**
         * Lấy lại Product vừa tạo để trả về component cha.
         */
        result = await productService.getById(id);
      }

      onSuccess(result);
      onClose();
    } catch (submitError: unknown) {
      console.error("Product submit error:", submitError);

      setError(
        getApiErrorMessage(
          submitError,
          isEdit
            ? "Không thể cập nhật sản phẩm. Vui lòng thử lại."
            : "Không thể thêm sản phẩm. Vui lòng thử lại.",
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
        side="right"
        className="
          flex
          h-full
          w-full
          flex-col
          gap-0
          overflow-hidden
          p-0
          sm:max-w-md
        "
      >
        {/* ================= HEADER ================= */}
        <SheetHeader className="shrink-0 space-y-1 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <Package className="h-4 w-4 text-slate-700" />
            </div>

            <div className="min-w-0">
              <SheetTitle className="text-base font-semibold text-slate-900">
                {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
              </SheetTitle>

              <SheetDescription className="mt-0.5 text-xs text-slate-500">
                {isEdit
                  ? "Cập nhật thông tin sản phẩm"
                  : "Nhập thông tin để tạo sản phẩm mới"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* ================= SCROLLABLE BODY ================= */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-6 px-6 py-6">
              {/* API ERROR */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                >
                  <p className="text-sm leading-5 text-red-700">{error}</p>
                </div>
              )}

              {/* ================= BASIC INFORMATION ================= */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Thông tin sản phẩm
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Thông tin cơ bản để nhận diện sản phẩm.
                  </p>
                </div>

                {/* SKU */}
                <div className="space-y-2">
                  <Label
                    htmlFor="product-sku"
                    className="text-sm font-medium text-slate-700"
                  >
                    SKU
                    <span className="ml-1 text-red-500">*</span>
                  </Label>

                  <Input
                    id="product-sku"
                    {...register("sku")}
                    placeholder="VD: SP-001"
                    disabled={isEdit || isLoading}
                    onChange={(event) => {
                      setValue("sku", event.target.value.toUpperCase(), {
                        shouldValidate: true,
                      });
                    }}
                    className="h-10 border-slate-200 text-sm uppercase"
                  />

                  {isEdit ? (
                    <p className="text-xs leading-4 text-slate-400">
                      SKU không thể thay đổi sau khi sản phẩm được tạo.
                    </p>
                  ) : (
                    <p className="text-xs leading-4 text-slate-400">
                      SKU là mã định danh duy nhất của sản phẩm.
                    </p>
                  )}

                  {errors.sku && (
                    <p className="text-xs leading-4 text-red-600">
                      {errors.sku.message}
                    </p>
                  )}
                </div>

                {/* NAME */}
                <div className="space-y-2">
                  <Label
                    htmlFor="product-name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Tên sản phẩm
                    <span className="ml-1 text-red-500">*</span>
                  </Label>

                  <Input
                    id="product-name"
                    {...register("name")}
                    placeholder="VD: Áo thun nam cổ tròn"
                    disabled={isLoading}
                    className="h-10 border-slate-200 text-sm"
                  />

                  <p className="text-xs leading-4 text-slate-400">
                    Nhập tên dễ nhận biết để thuận tiện tìm kiếm và quản lý.
                  </p>

                  {errors.name && (
                    <p className="text-xs leading-4 text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* UNIT */}
                <div className="space-y-2">
                  <Label
                    htmlFor="product-unit"
                    className="text-sm font-medium text-slate-700"
                  >
                    Đơn vị tính
                  </Label>

                  <Input
                    id="product-unit"
                    {...register("unit")}
                    placeholder="VD: cái, chiếc, đôi..."
                    disabled={isLoading}
                    className="h-10 border-slate-200 text-sm"
                  />

                  <p className="text-xs leading-4 text-slate-400">
                    Ví dụ: cái, hộp, kg, chiếc, đôi...
                  </p>
                </div>
              </section>

              <Separator />

              {/* ================= PRICE ================= */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Thông tin giá
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Thiết lập giá nhập và đơn vị tiền tệ.
                  </p>
                </div>

                <div className="grid grid-cols-[1fr_100px] gap-3">
                  {/* COST PRICE */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="product-cost-price"
                      className="text-sm font-medium text-slate-700"
                    >
                      Giá nhập
                      <span className="ml-1 text-red-500">*</span>
                    </Label>

                    <Input
                      id="product-cost-price"
                      {...register("costPrice")}
                      type="number"
                      min={0}
                      step="1"
                      placeholder="0"
                      disabled={isLoading}
                      className="h-10 border-slate-200 text-sm"
                    />

                    {errors.costPrice && (
                      <p className="text-xs leading-4 text-red-600">
                        {errors.costPrice.message}
                      </p>
                    )}
                  </div>

                  {/* CURRENCY */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="product-currency"
                      className="text-sm font-medium text-slate-700"
                    >
                      Tiền tệ
                    </Label>

                    <Input
                      id="product-currency"
                      {...register("currency")}
                      maxLength={10}
                      disabled={isLoading}
                      onChange={(event) => {
                        setValue("currency", event.target.value.toUpperCase(), {
                          shouldValidate: true,
                        });
                      }}
                      placeholder="VND"
                      className="h-10 border-slate-200 text-sm uppercase"
                    />

                    {errors.currency && (
                      <p className="text-xs leading-4 text-red-600">
                        {errors.currency.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 px-4 py-3">
                  <p className="text-xs leading-5 text-slate-500">
                    💡 Giá nhập là chi phí bạn trả cho nhà cung cấp, không phải
                    giá bán cho khách hàng.
                  </p>
                </div>
              </section>

              {/* Extra bottom spacing */}
              <div className="h-2" />
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <Separator />

          <div className="shrink-0 bg-white px-6 py-4">
            <div className="flex gap-3">
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
                disabled={isLoading}
                className="h-10 flex-1 bg-slate-900 text-white hover:bg-slate-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                    {isEdit ? "Đang lưu..." : "Đang tạo..."}
                  </>
                ) : isEdit ? (
                  "Lưu thay đổi"
                ) : (
                  "Tạo sản phẩm"
                )}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Parse API error.
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
