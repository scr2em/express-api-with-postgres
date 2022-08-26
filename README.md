# GETTING STARTED

1- clone this repo

2- run `npm install` to install all dependencies.

3- Rename `.env.local` to `.env` and set these variables accordingly.

4- use `npm run start` or `npm run watch` to run the server in watch mode

5- use `npm run build` to build the app to `dist` folder

6- use `npm run tesst` to run the tests files.

7- use `npm run fmt` to apply eslint rules and format all files.

8- there are 2 databases `dev` for development and `test` for testing  (default ports).


# DATABASE TABLES

### 1- users
| COLUMN     | TYPE           | CONSTRAINTS        | DESCRIPTION         |
|------------|----------------|--------------------|---------------------|
| id         | integer        | SERIAL PRIMARY KEY |                     |
| first_name | CHAR VAR(50)   | NOT NULL           |                     |
| last_name  | CHAR VAR(50)   | NOT NULL           |                     |
| password   | CHAR VAR(255)  | NOT NULL           | the hashed password |
| email      | CHAR VAR(100)  | UNIQUE             |                     |



### 2- categories
| COLUMN      | TYPE     | CONSTRAINTS        | DESCRIPTION |
|-------------|----------|--------------------|-------------|
| id          | integer  | SERIAL PRIMARY KEY |             |
| name        | CHAR VAR | NOT NULL UNIQUE    |             |

### 3- products

| COLUMN      | TYPE      | CONSTRAINTS        | DESCRIPTION                                  |
|-------------|-----------|--------------------|----------------------------------------------|
| id          | integer   | SERIAL PRIMARY KEY |                                              |
| name        | CHAR VAR  | NOT NULL           |                                              |
| price       | integer   | NOT NULL  >=0      |                                              |
| category_id | integer   | NOT NULL           | refers to the category of this product       |
| available   | integer   | default 0 >=0      | how many items are available of this product |
| consumed    | integer   | default 0 >=0      | how many products have been sold             |
| user_id     | integer   | NOT NULL           | refers to the user who created this product  |

* there is a constraint to check that (available-consumed) >= 0

### 4- orders

| COLUMN      | TYPE     | CONSTRAINTS                          | DESCRIPTION                                             |
|-------------|----------|--------------------------------------|---------------------------------------------------------|
| id          | integer  | SERIAL PRIMARY KEY                   |                                                         |
| user_id     | CHAR VAR | NOT NULL                             | refers to the user who created this order               |
| status      | integer  | "active" or "complete" or "canceled" |                                                         |
| order_price | integer  | NOT NULL                             | the total price of this order at the moment of creation |

* when a user is deleted, the associated orders are deleted as well
*
### 5- order_products

because the relation between order and products are many to many
(any product can be in different orders and any order can have many products)
we have to make a separate table for this relation

| COLUMN        | TYPE    | CONSTRAINTS        | DESCRIPTION                                                 |
|---------------|---------|--------------------|-------------------------------------------------------------|
| order_id      | integer | SERIAL PRIMARY KEY | refers to the order                                         |
| product_id    | integer | NOT NULL           | refers to the product in this order                         |
| quantity      | integer | NOT NULL  >=0      | the quantity of this product in this order                  |
| product_price | integer | NOT NULL           | the price of the product the moment the user made the order |

* when an order or product is deleted, the associated rows in the order_products table are deleted automatically
