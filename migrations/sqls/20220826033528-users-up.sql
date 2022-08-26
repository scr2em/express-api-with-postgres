/* Replace with your SQL commands */

ALTER TABLE products ADD COLUMN user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE;
