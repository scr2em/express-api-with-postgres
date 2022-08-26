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
