// src/components/features/stock-out/stock-out-detail-items-editor.tsx
//
// Đây là bản ĐÃ ĐỔI TÊN từ file stock-out-items-editor.tsx bạn upload
// (export StockOutItemEditor). Dùng cho trang CHI TIẾT một stock-out ĐÃ TỒN
// TẠI trên BE — mỗi thao tác add/update/remove gọi thẳng API theo stockOutId.
//
// Khác với stock-out-items-editor.tsx (file cùng thư mục, đã viết lại) —
// component đó quản lý item nháp hoàn toàn ở local state, dùng cho trang
// /stock-out/new khi chưa có stockOutId.
"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { stockOutService } from "@/services/stock-out.service";
import type { StockOutItem } from "@/types/stock-out.types";

const currency = (n: number, code: string) =>
  new Intl.NumberFormat("vi-VN").format(n) +
  (code === "VND" ? " ₫" : ` ${code}`);

interface StockOutDetailItemsEditorProps {
  stockOutId: string;
  items: StockOutItem[];
  currency: string;
  /** Chỉ true khi stockOut.status === "draft" — khớp StockOut.guardDraft() ở domain. */
  editable: boolean;
  onChanged: () => void | Promise<void>;
}

interface DraftRow {
  productId: string;
  quantity: string;
  unitPrice: string;
}

const emptyDraft: DraftRow = { productId: "", quantity: "1", unitPrice: "" };

export function StockOutDetailItemsEditor({
  stockOutId,
  items,
  currency: curr,
  editable,
  onChanged,
}: StockOutDetailItemsEditorProps) {
  const [newRow, setNewRow] = useState<DraftRow>(emptyDraft);
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<DraftRow>(emptyDraft);
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [removingItem, setRemovingItem] = useState<StockOutItem | null>(null);
  const [removing, setRemoving] = useState(false);

  const total = items.reduce((sum, i) => sum + i.totalPrice, 0);

  const startEdit = (item: StockOutItem) => {
    setEditingId(item.id);
    setEditRow({
      productId: item.productId,
      quantity: String(item.quantity),
      unitPrice: String(item.unitPrice),
    });
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError(null);
  };

  const handleAdd = async () => {
    const quantity = Number(newRow.quantity);
    const unitPrice = Number(newRow.unitPrice);
    if (!newRow.productId.trim()) return setAddError("Product is required");
    if (!(quantity > 0)) return setAddError("Quantity must be greater than 0");
    if (!(unitPrice > 0))
      return setAddError("Unit price must be greater than 0");
    if (items.some((i) => i.productId === newRow.productId.trim())) {
      return setAddError("This product already exists in the list");
    }
    setAddError(null);
    setAdding(true);
    try {
      await stockOutService.addItem(stockOutId, {
        productId: newRow.productId.trim(),
        quantity,
        unitPrice,
        currency: curr,
      });
      setNewRow(emptyDraft);
      await onChanged();
    } catch (err: any) {
      setAddError(err?.response?.data?.message ?? "Could not add item");
    } finally {
      setAdding(false);
    }
  };

  const handleSaveEdit = async (itemId: string) => {
    const quantity = Number(editRow.quantity);
    const unitPrice = Number(editRow.unitPrice);
    if (!(quantity > 0)) return setEditError("Quantity must be greater than 0");
    if (!(unitPrice > 0))
      return setEditError("Unit price must be greater than 0");
    setEditError(null);
    setSavingEdit(true);
    try {
      await stockOutService.updateItem(stockOutId, itemId, {
        itemId,
        quantity,
        unitPrice,
        currency: curr,
      });
      setEditingId(null);
      await onChanged();
    } catch (err: any) {
      setEditError(err?.response?.data?.message ?? "Could not update item");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleRemove = async () => {
    if (!removingItem) return;
    setRemoving(true);
    try {
      await stockOutService.removeItem(stockOutId, removingItem.id);
      setRemovingItem(null);
      await onChanged();
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-[110px]">
                  Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-[150px]">
                  Unit price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-[150px]">
                  Total
                </th>
                {editable && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide w-[100px]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {item.productId}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editRow.quantity}
                          onChange={(e) =>
                            setEditRow((r) => ({
                              ...r,
                              quantity: e.target.value,
                            }))
                          }
                          className="h-8 w-20 border-slate-200 text-sm"
                        />
                      ) : (
                        <span className="text-sm text-slate-600">
                          {item.quantity}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editRow.unitPrice}
                          onChange={(e) =>
                            setEditRow((r) => ({
                              ...r,
                              unitPrice: e.target.value,
                            }))
                          }
                          className="h-8 w-28 border-slate-200 text-sm"
                        />
                      ) : (
                        <span className="text-sm text-slate-600">
                          {currency(item.unitPrice, item.currency)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {isEditing
                        ? currency(
                            Number(editRow.quantity || 0) *
                              Number(editRow.unitPrice || 0),
                            curr,
                          )
                        : currency(item.totalPrice, item.currency)}
                    </td>
                    {editable && (
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-md text-emerald-600 hover:bg-emerald-50"
                              disabled={savingEdit}
                              onClick={() => handleSaveEdit(item.id)}
                            >
                              {savingEdit ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-md text-slate-500 hover:bg-slate-100"
                              disabled={savingEdit}
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-md"
                              onClick={() => startEdit(item)}
                            >
                              <Pencil className="h-3.5 w-3.5 text-slate-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-md"
                              onClick={() => setRemovingItem(item)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}

              {editable && (
                <tr className="bg-slate-50/60">
                  <td className="px-4 py-3">
                    <Input
                      placeholder="Product ID / SKU"
                      value={newRow.productId}
                      onChange={(e) =>
                        setNewRow((r) => ({ ...r, productId: e.target.value }))
                      }
                      className="h-8 border-slate-200 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      value={newRow.quantity}
                      onChange={(e) =>
                        setNewRow((r) => ({ ...r, quantity: e.target.value }))
                      }
                      className="h-8 w-20 border-slate-200 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      placeholder="0"
                      value={newRow.unitPrice}
                      onChange={(e) =>
                        setNewRow((r) => ({ ...r, unitPrice: e.target.value }))
                      }
                      className="h-8 w-28 border-slate-200 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {currency(
                      Number(newRow.quantity || 0) *
                        Number(newRow.unitPrice || 0),
                      curr,
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-md text-slate-900"
                      disabled={adding}
                      onClick={handleAdd}
                    >
                      {adding ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {items.length === 0 && !editable && (
          <div className="py-10 text-center text-sm text-slate-400">
            No items
          </div>
        )}
      </div>

      {(addError || editError) && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {addError || editError}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Total
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {currency(total, curr)}
        </span>
      </div>

      <AlertDialog
        open={Boolean(removingItem)}
        onOpenChange={(o) => !o && setRemovingItem(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">
              Remove item
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Remove product{" "}
              <span className="font-medium text-slate-700">
                {removingItem?.productId}
              </span>{" "}
              from this stock-out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={removing}
              onClick={handleRemove}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
