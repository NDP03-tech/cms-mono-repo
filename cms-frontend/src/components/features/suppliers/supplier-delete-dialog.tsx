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

import { Supplier } from "@/types/supplier.types";
import { supplierService } from "@/services/supplier.service";

interface SupplierDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier: Supplier | null;
}

export function SupplierDeleteDialog({
  open,
  onClose,
  onSuccess,
  supplier,
}: SupplierDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!supplier) return;

    setIsLoading(true);
    setError(null);

    try {
      await supplierService.delete(supplier.id);

      // API thành công
      onSuccess();

      // Đóng dialog
      onClose();
    } catch (error: unknown) {
      console.error("Delete supplier error:", error);

      setError(
        getApiErrorMessage(
          error,
          "Không thể xóa nhà cung cấp. Vui lòng thử lại.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !isLoading) {
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-slate-900">
            Xóa nhà cung cấp
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm text-slate-500">
            Bạn có chắc muốn xóa nhà cung cấp{" "}
            <span className="font-medium text-slate-700">{supplier?.name}</span>
            ? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            className="h-9 border-slate-200 text-slate-700"
            disabled={isLoading}
          >
            Hủy
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            className="h-9 bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading || !supplier}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}

            {isLoading ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
