
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


# API Requirements

## 1- Users

### API Endpoints
| METHOD | Endpoints | Token | Request body                                                                   | Action                             |
|--------|-----------|-------|--------------------------------------------------------------------------------|------------------------------------|
| GET    | /user     | YES   |                                                                                | To get all users                   |
| GET    | /user/:id | YES   |                                                                                | To get a specific user by id       |
| POST   | /user     | NO    | {email: `string`, firstName: `string`, lastName: `string`, password: `string`} | To create a new user               |
| POST   | /login    | NO    | {email: `string` , password: `string`}                                         | To login as user (returns a token) |


* users can't delete their accounts or any other accounts.

## 2- Categories 

### API Endpoints
| METHOD | Endpoints     | Token | Request body     | Action                              |
|--------|---------------|-------|------------------|-------------------------------------|
| GET    | /category     | No    |                  | To get all categories               |
| GET    | /category/:id | No    |                  | To get a specific category by id    |
| POST   | /category     | YES   | {name: `string`} | To create a new category            |
| DELETE | /category/:id | YES   |                  | To delete a specific category by id |

* anyone can delete any category 
* when a category is deleted it doesn't delete any associated product.

## 3- Products

### API Endpoints
| METHOD | Endpoints        | Token  | Request body                                                                  | Query params           | Action                                                                                       |
|--------|------------------|--------|-------------------------------------------------------------------------------|------------------------|----------------------------------------------------------------------------------------------|
| GET    | /product         | No     |                                                                               | `category_id` optional | To get all products, if the query param exist, it returns all products for specific category |
| GET    | /product/:id     | No     |                                                                               |                        | To get a specific product by id                                                              |
| POST   | /product         | YES    | {name: `string`, price: `number` , available: `number`, categoryId: `number`} |                        | To create a new product                                                                      |
| DELETE | /product/:id     | YES    |                                                                               |                        | To delete a specific product by id                                                           |
| GET    | /popularProducts | NO     |                                                                               | `limit`  default 2     | To get top popular products based on how many times the product is sold                      |

## 4- Orders

### API Endpoints
| METHOD | Endpoints      | Token | Request body                                        | Action                                                     |
|--------|----------------|-------|-----------------------------------------------------|------------------------------------------------------------|
| GET    | /order         | YES   |                                                     | To get all orders for this user                            |
| GET    | /order/:id     | YES   |                                                     | To get a specific order by id                              |
| POST   | /order         | YES   | {products : { id: `number`, `quantity`: number }[]} | To create a new order                                      |
| DELETE | /order/:id     | YES   |                                                     | To delete a specific order by id if it belongs to the user |

* when an order is deleted, the products' quantity gets subtracted from `consumed` property of the product.
