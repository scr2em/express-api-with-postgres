import db from "../db/db";
import { Store, ProductI, DbProductI } from "../types";

export class ProductStore implements Store<ProductI> {
	async index(): Promise<ProductI[]> {
		try {
			const conn = await db.connect();
			const sql = `SELECT pr.id, pr.name, price, (available-consumed) as stock, ct.name as category_name 
						 FROM products pr 
						 INNER JOIN categories ct on pr.category_id = ct.id`;
			const result = await conn.query(sql);
			conn.release();
			return Promise.resolve(result.rows);
		} catch (e) {
			throw new Error(`cannot get products.`);
		}
	}
	async show(id: number): Promise<ProductI> {
		try {
			const sql = `SELECT pr.id, pr.name, price, (available-consumed) as stock, ct.name as category_name 
						 FROM products pr 
						 INNER JOIN categories ct on pr.category_id = ct.id
						 WHERE id=($1)`;
			const conn = await db.connect();
			const result = await conn.query(sql, [id]);
			conn.release();
			return result.rows[0];
		} catch (err) {
			throw new Error(`Could not find products with id ${id}.`);
		}
	}

	async create({ name, price, available, category_id }: Partial<DbProductI>): Promise<ProductI> {
		try {
			const sql = `INSERT INTO products (name,price,available,category_id)
 						 VALUES($1, $2, $3, $4) 
 						 RETURNING *`;

			const conn = await db.connect();
			const result = await conn.query(sql, [name, price, available, category_id]);
			const category = result.rows[0];
			conn.release();
			return category;
		} catch (err) {
			console.log(err);
			throw new Error(`Could not add new product ${name}.`);
		}
	}

	async delete(id: number): Promise<boolean> {
		try {
			const sql = "DELETE FROM products WHERE id=($1)";
			const conn = await db.connect();
			const result = await conn.query(sql, [id]);
			const isDeleted = result.rowCount === 1;
			conn.release();
			return isDeleted;
		} catch (err) {
			throw new Error(`Could not delete products ${id}.`);
		}
	}

	async getProductsByCategory(categoryId: number): Promise<ProductI[]> {
		try {
			const sql = `SELECT pr.id, pr.name, price, (available-consumed) as stock, ct.name as category_name 
						 FROM products pr 
						 INNER JOIN categories ct on pr.category_id = ct.id
						 WHERE pr.category_id=($1)`;
			const conn = await db.connect();
			const result = await conn.query(sql, [categoryId]);
			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Could not find products with category id ${categoryId}.`);
		}
	}

	async getTopPopularProducts(limit: number = 0): Promise<ProductI[]> {
		try {
			const sql = `SELECT pr.id, pr.name, price, (available-consumed) as stock, ct.name as category_name
						FROM products pr
						INNER JOIN categories ct on pr.category_id = ct.id
						ORDER BY pr.consumed DESC
						LIMIT ($1)`;
			const conn = await db.connect();
			const result = await conn.query(sql, [limit]);
			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Could not get top popular products.`);
		}
	}
}
