CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    price INT NOT NULL,
    category_id INT NOT NULL REFERENCES categories (id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(255)
);

CREATE TYPE order_status AS ENUM ('active', 'complete', 'canceled');

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL  REFERENCES users (id) ON DELETE CASCADE,
    status order_status,
    order_price INT NOT NULL
);
