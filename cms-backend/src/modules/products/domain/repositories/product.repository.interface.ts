import { SKU } from '../value-objects/sku.vo';
import { Product } from '../entities/product.entity';

export interface ProductFilters {
  name?: string;
  sku?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  unit?: string;
  page?: number;
  limit?: number;
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: SKU): Promise<Product | null>;
  findByName(name: string): Promise<Product[]>;
  findAll(filters?: ProductFilters): Promise<Product[]>;

  existsById(id: string): Promise<boolean>;
  existsBySku(sku: SKU): Promise<boolean>;

  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');
