DROP TABLE IF EXISTS order_products;

ALTER TABLE products DROP COLUMN available;
ALTER TABLE products DROP COLUMN consumed;
ALTER TABLE products DROP CONSTRAINT IF EXISTS available_consumed;
