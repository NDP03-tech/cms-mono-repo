// src/components/features/products/product-sheet.tsx
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
import { Product } from "@/types/product.types";

const schema = z.object({
  sku: z.string().min(1, "SKU không được để trống"),
  name: z.string().min(1, "Tên không được để trống"),
  unit: z.string().optional(),
  costPrice: z.coerce.number().min(0, "Giá không được âm"),
  currency: z.string().min(1, "Đơn vị tiền tệ không được để trống"),
});

type FormValues = z.infer<typeof schema>;

interface ProductSheetProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (product?: Product) => void;
  product?: Product | null;
}

export function ProductSheet({
  open,
  onClose,
  onSuccess,
  product,
}: ProductSheetProps) {
  const isEdit = !!product;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      sku: "",
      name: "",
      unit: "",
      costPrice: 0,
      currency: "VND",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        sku: product.sku.toUpperCase(),
        name: product.name,
        unit: product.unit ?? "",
        costPrice: product.costPrice,
        currency: product.currency,
      });
    } else {
      reset({
        sku: "",
        name: "",
        unit: "",
        costPrice: 0,
        currency: "VND",
      });
    }
    setError(null);
  }, [product, open, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      // Khi kết nối BE thật uncommment phần này:
      // if (isEdit && product) {
      //   await productService.update(product.id, values);
      // } else {
      //   await productService.create(values);
      // }

      onSuccess(values as unknown as Product);
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
            {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
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

          {/* SKU */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              SKU
            </Label>
            <Input
              {...register("sku")}
              placeholder="VD: SP-001"
              disabled={isEdit}
              onChange={(e) => setValue("sku", e.target.value.toUpperCase())}
              className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900 disabled:opacity-50"
            />
            {errors.sku && (
              <p className="text-xs text-red-600">{errors.sku.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Tên sản phẩm
            </Label>
            <Input
              {...register("name")}
              placeholder="VD: Áo thun nam"
              className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Unit */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Đơn vị tính
            </Label>
            <Input
              {...register("unit")}
              placeholder="VD: cái, chiếc, đôi..."
              className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900"
            />
          </div>

          {/* Cost Price + Currency */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Giá nhập
            </Label>
            <div className="flex gap-2">
              <Input
                {...register("costPrice")}
                type="number"
                min={0}
                placeholder="0"
                className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900 flex-1"
              />
              <Input
                {...register("currency")}
                placeholder="VND"
                maxLength={10}
                onChange={(e) =>
                  setValue("currency", e.target.value.toUpperCase().trim())
                }
                className="w-24 h-9 border-slate-200 text-sm focus-visible:ring-slate-900 uppercase"
              />
            </div>
            {errors.costPrice && (
              <p className="text-xs text-red-600">{errors.costPrice.message}</p>
            )}
            {errors.currency && (
              <p className="text-xs text-red-600">{errors.currency.message}</p>
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
            {isEdit ? "Lưu thay đổi" : "Thêm sản phẩm"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
