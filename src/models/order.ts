import db from "../db/db";
import { OrderI } from "../types";
import _sumBy from "lodash/sumBy";

export class OrderStore {
	async index(userId: number): Promise<
		{
			order_id: number;
			status: "active" | "completed" | "canceled";
			products: { id: number; name: string; quantity: number; categoryName: string; price: number }[];
		}[]
	> {
		const conn = await db.connect();

		try {
			const sql = ` SELECT 
							 order_id,
							 status,
							 json_agg(json_build_object('id', p.id, 
							 							'name', p.name,
							 							'quantity', op.quantity,
							 							'categoryName', c.name,
							 							'price', op.product_price)) AS products 
						  FROM order_products op  
						  INNER JOIN products p ON op.product_id = p.id 
						  INNER JOIN categories c on p.category_id = c.id 
						  INNER JOIN orders o on o.id = op.order_id 
						  WHERE o.user_id = ($1)
						  GROUP BY order_id, status
						 `;
			const result = await conn.query(sql, [userId]);

			return result.rows;
		} catch (e) {
			console.log(e);
			throw new Error(`cannot get users.`);
		} finally {
			conn.release();
		}
	}
	async show(id: number): Promise<{
		order_id: number;
		status: "active" | "completed" | "canceled";
		products: { id: number; name: string; quantity: number; categoryName: string; price: number }[];
	}> {
		const conn = await db.connect();
		try {
			const sql = `SELECT 
							 order_id,
							 status,
							 json_agg(json_build_object('id', p.id, 
							 							'name', p.name,
							 							'quantity', op.quantity,
							 							'categoryName', c.name,
							 							'price', op.product_price)) AS products 
						  FROM order_products op 
						  INNER JOIN products p ON op.product_id = p.id 
						  INNER JOIN categories c on p.category_id = c.id 
						  INNER JOIN orders o on o.id = op.order_id 
						  WHERE o.id = $1
						  GROUP BY order_id, status`;

			const result = await conn.query(sql, [id]);

			return result.rows[0];
		} catch (err) {
			throw new Error(`Could not find user with id ${id}.`);
		} finally {
			conn.release();
		}
	}

	async create({ userId, products }: { userId: number; products: { id: number; quantity: number }[] }): Promise<{
		order_id: number;
		status: "active" | "completed" | "canceled";
		products: { id: number; name: string; quantity: number; categoryName: string; price: number }[];
	}> {
		const conn = await db.connect();
		try {
			await db.query("BEGIN");

			let products_price = [];
			for (const product of products) {
				const query = "UPDATE products SET consumed = consumed + $1 WHERE id = $2 RETURNING price";
				const result = await db.query(query, [product.quantity, product.id]);
				products_price.push({ id: product.id, price: result.rows[0].price, quantity: product.quantity });
			}

			const result = await db.query(
				"INSERT INTO orders(user_id,status,order_price) VALUES($1,$2,$3) RETURNING id",
				[userId, "active", _sumBy(products_price.map(({ quantity, price }) => quantity * price))],
			);
			const orderId = result.rows[0].id;

			for (const product of products) {
				const query =
					"INSERT INTO order_products(order_id,product_id,quantity,product_price) VALUES($1,$2,$3,$4)";
				await db.query(query, [
					orderId,
					product.id,
					product.quantity,
					products_price.find((p) => p.id === product.id)?.price,
				]);
			}

			await db.query("COMMIT");
			return this.show(orderId);
		} catch (err) {
			await db.query("ROLLBACK");
			throw new Error(`Could not create new order.`);
		} finally {
			conn.release();
		}
	}

	async delete(id: number): Promise<boolean> {
		const conn = await db.connect();
		try {
			await db.query("BEGIN");
			const result = await db.query("SELECT product_id , quantity FROM order_products WHERE order_id =$1", [id]);
			const productIds_quantities = result.rows;
			for (const product of productIds_quantities) {
				await db.query("UPDATE products SET consumed = consumed - $1 WHERE id = $2", [
					product.quantity,
					product.product_id,
				]);
			}
			await db.query("DELETE FROM orders WHERE id=$1", [id]);
			await db.query("COMMIT");
			return result.rowCount === 1;
		} catch (e) {
			console.log(e);
			await db.query("ROLLBACK");
			throw new Error("Ops sorry couldn't delete this order");
		} finally {
			conn.release();
		}
	}

	async isAllowedToDeleteOrder(userId: number, orderId: number): Promise<boolean> {
		const conn = await db.connect();
		try {
			const result = await db.query("SELECT user_id FROM orders WHERE id=$1", [orderId]);
			const order_user_id = result.rows[0]?.user_id;

			return order_user_id === userId;
		} catch (e) {
			throw new Error("this user doesn't have permission to delete this order");
		} finally {
			conn.release();
		}
	}
}
