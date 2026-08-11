"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProductTable } from "@/components/features/products/product-table";
import { ProductSheet } from "@/components/features/products/product-sheet";
import { ProductDeleteDialog } from "@/components/features/products/product-delete-dialog";

import { productService } from "@/services/product.service";
import { Product } from "@/types/product.types";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await productService.list();
      setAllProducts(data ?? []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = allProducts.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.isActive) ||
      (statusFilter === "inactive" && !product.isActive);

    return matchesSearch && matchesStatus;
  });

  function handleEdit(product: Product) {
    setEditProduct(product);
    setSheetOpen(true);
  }

  function handleDelete(product: Product) {
    setDeleteProduct(product);
    setDeleteOpen(true);
  }

  function handleAddNew() {
    setEditProduct(null);
    setSheetOpen(true);
  }

  async function handleSheetSuccess() {
    setSheetOpen(false);
    setEditProduct(null);

    await fetchProducts();
  }

  async function handleDeleteSuccess() {
    setDeleteOpen(false);
    setDeleteProduct(null);

    await fetchProducts();
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Sản phẩm</h1>

          <p className="mt-0.5 text-sm text-slate-500">
            Quản lý danh mục sản phẩm
          </p>
        </div>

        <Button
          onClick={handleAddNew}
          size="sm"
          className="h-9 bg-slate-900 text-sm hover:bg-slate-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Tìm theo tên, SKU..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 border-slate-200 pl-9 text-sm"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[140px] border-slate-200 text-sm">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang bán</SelectItem>
            <SelectItem value="inactive">Ngừng bán</SelectItem>
          </SelectContent>
        </Select>

        <p className="ml-auto text-xs text-slate-400">
          {filteredProducts.length} sản phẩm
        </p>
      </div>

      {/* Table */}
      <ProductTable
        products={filteredProducts}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create / Edit Sheet */}
      <ProductSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setEditProduct(null);
        }}
        onSuccess={handleSheetSuccess}
        product={editProduct}
      />

      {/* Delete Dialog */}
      <ProductDeleteDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteProduct(null);
        }}
        onSuccess={handleDeleteSuccess}
        product={deleteProduct}
      />
    </div>
  );
}
