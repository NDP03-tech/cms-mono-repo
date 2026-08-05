-- PostgreSQL initialization script for the products table
-- This script creates the products table and inserts sample products

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku varchar(50) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  unit varchar(50) NOT NULL DEFAULT '',
  amount numeric(15, 2) NOT NULL DEFAULT 0,
  currency varchar(10) NOT NULL DEFAULT 'VND',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);

INSERT INTO products (sku, name, unit, amount, currency, is_active)
VALUES
  ('SP-001', 'Áo thun nam', 'cái', 120000.00, 'VND', true),
  ('SP-002', 'Quần jeans nữ', 'cái', 220000.00, 'VND', true),
  ('SP-003', 'Giày thể thao', 'đôi', 450000.00, 'VND', true),
  ('SP-004', 'Mũ lưỡi trai', 'cái', 50000.00, 'VND', false),
  ('SP-005', 'Túi xách nữ', 'cái', 350000.00, 'VND', true);

-- Optional trigger to update updated_at on row changes
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_touch_updated_at ON products;
CREATE TRIGGER trg_touch_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION touch_updated_at();
