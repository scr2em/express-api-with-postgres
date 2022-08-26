CREATE TABLE order_products (
    order_id INT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    quantity INT NOT NULL default 0,
    product_price INT NOT NULL default 0,
    PRIMARY KEY (order_id,product_id)
);

ALTER TABLE products ADD COLUMN available INT NOT NULL default 0;
ALTER TABLE products ADD COLUMN consumed INT NOT NULL default 0;
ALTER TABLE products ADD CONSTRAINT available_consumed CHECK (consumed <= available);

