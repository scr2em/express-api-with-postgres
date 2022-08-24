ALTER TABLE orders ADD COLUMN product_id INT NOT NULL REFERENCES products (id) ON DELETE CASCADE;
ALTER TABLE orders ADD COLUMN quantity INT NOT NULL;
ALTER TABLE orders DROP COLUMN order_price;

DROP TABLE IF EXISTS order_products;

ALTER TABLE products DROP COLUMN available;
ALTER TABLE products DROP COLUMN consumed;
ALTER TABLE products DROP CONSTRAINT IF EXISTS available_consumed;
