// src/services/product.service.ts
//
// Khớp với ProductsController thật: POST/GET/PUT/DELETE /products.
import api from "@/lib/axios";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from "@/types/product.types";

export const productService = {
  async list(filters?: ProductFilters): Promise<Product[]> {
    const params = Object.fromEntries(
      Object.entries(filters ?? {}).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    );
    const { data } = await api.get<Product[]>("/products", { params });
    return data ?? [];
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  /**
   * QUAN TRỌNG: ProductsController.create() trả về `{ id }` (object), không
   * phải string thuần như StockOutController.create(). Nếu đọc nhầm `data`
   * thay vì `data.id`, biến id trong FE sẽ vô tình chứa nguyên object/response
   * thay vì id thật — đây là nghi phạm số 1 cho lỗi "hiển thị Id thay vì tên".
   */
  async create(input: CreateProductInput): Promise<string> {
    const { data } = await api.post<{ id: string }>("/products", input);
    return data.id;
  },

  async update(id: string, input: UpdateProductInput): Promise<void> {
    await api.put(`/products/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
