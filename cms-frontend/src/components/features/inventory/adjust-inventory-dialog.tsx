// src/components/features/inventory/adjust-inventory-dialog.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InventoryBalance } from "@/types/inventory.types";
import { inventoryService } from "@/services/inventory.service";

const schema = z.object({
  newQuantity: z.number().min(0, "Số lượng không được âm"),
  reason: z.string().min(1, "Vui lòng nhập lý do điều chỉnh"),
});

type FormValues = z.infer<typeof schema>;

interface AdjustInventoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (productId: string, newQuantity: number) => void;
  balance: InventoryBalance | null;
}

export function AdjustInventoryDialog({
  open,
  onClose,
  onSuccess,
  balance,
}: AdjustInventoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      newQuantity: 0,
      reason: "",
    },
  });

  useEffect(() => {
    if (balance) {
      reset({
        newQuantity: balance.quantity,
        reason: "",
      });
    }
    setError(null);
  }, [balance, open, reset]);

  async function onSubmit(values: FormValues) {
    if (!balance) return;
    setIsLoading(true);
    setError(null);
    try {
      await inventoryService.adjust({
        productId: balance.productId,
        newQuantity: values.newQuantity,
        reason: values.reason,
      });

      onSuccess(balance.productId, values.newQuantity);
      onClose();
    } catch (err) {
      console.error("Adjust inventory failed:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-900">
            Điều chỉnh tồn kho
          </DialogTitle>
        </DialogHeader>

        <Separator />

        {balance && (
          <div className="rounded-md bg-slate-50 border border-slate-200 px-4 py-3 space-y-1">
            <p className="text-sm font-medium text-slate-700">
              {balance.productName}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-xs font-mono text-slate-400">
                {balance.productSku}
              </p>
              <p className="text-xs text-slate-500">
                Tồn kho hiện tại:{" "}
                <span className="font-semibold text-slate-700">
                  {balance.quantity}
                </span>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Số lượng mới <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("newQuantity", { valueAsNumber: true })}
              type="number"
              min={0}
              className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900"
            />
            {errors.newQuantity && (
              <p className="text-xs text-red-600">
                {errors.newQuantity.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Lý do điều chỉnh <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("reason")}
              placeholder="VD: Kiểm kho thực tế lệch hệ thống"
              className="h-9 border-slate-200 text-sm focus-visible:ring-slate-900"
            />
            {errors.reason && (
              <p className="text-xs text-red-600">{errors.reason.message}</p>
            )}
          </div>
        </form>

        <Separator />

        <DialogFooter className="flex gap-2">
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
            onClick={handleSubmit(onSubmit)}
            className="flex-1 h-9 bg-slate-900 hover:bg-slate-800"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
