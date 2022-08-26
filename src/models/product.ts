import db from "../db/db";

export class ProductStore {
	async index(): Promise<
		{ id: number; name: string; price: number; stock: number; category_name: string; user_id: number }[]
	> {
		try {
			const conn = await db.connect();
			const sql = `SELECT pr.id, pr.name, price, (available-consumed) as stock, ct.name as category_name , user_id
						 FROM products pr 
						 INNER JOIN categories ct on pr.category_id = ct.id`;
			const result = await conn.query(sql);
			conn.release();
			return Promise.resolve(result.rows);
		} catch (e) {
			throw new Error(`cannot get products.`);
		}
	}
	async show(
		id: number,
	): Promise<{ id: number; name: string; price: number; stock: number; category_name: string; user_id: number }> {
		try {
			const sql = `SELECT pr.id, pr.name, price, (available-consumed) as stock, ct.name as category_name , user_id
						 FROM products pr 
						 INNER JOIN categories ct on pr.category_id = ct.id
						 WHERE pr.id=($1)`;
			const conn = await db.connect();
			const result = await conn.query(sql, [id]);
			conn.release();

			return result.rows[0];
		} catch (err) {
			throw new Error(`Could not find a product with id ${id}.`);
		}
	}

	async create({
		name,
		price,
		available,
		categoryId,
		userId,
	}: {
		name: string;
		price: number;
		available: number;
		categoryId: number;
		userId: number;
	}): Promise<{
		id: number;
		name: string;
		price: number;
		stock: number;
		category_name: string;
		user_id: number;
	}> {
		const conn = await db.connect();
		try {
			const sql = `INSERT INTO products (name,price,available,category_id, user_id)
 						 VALUES($1, $2, $3, $4, $5) RETURNING id`;

			const result = await conn.query(sql, [name, price, available, categoryId, userId]);
			const product_id = result.rows[0].id;

			return this.show(product_id);
		} catch (err) {
			throw new Error(`Could not add new product ${name}.`);
		} finally {
			conn.release();
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
	async isAllowedToDeleteProduct(productId: number, userId: number): Promise<boolean> {
		const conn = await db.connect();
		try {
			const result = await db.query("SELECT user_id FROM products WHERE id=$1", [productId]);
			const product_user_id = result.rows[0]?.user_id;

			return product_user_id === userId;
		} catch (e) {
			throw new Error("this user doesn't have permission to delete this product");
		} finally {
			conn.release();
		}
		return true;
	}
	async getProductsByCategory(
		categoryId: number,
	): Promise<{ id: number; name: string; price: number; stock: number; category_name: string; user_id: number }[]> {
		try {
			const sql = `SELECT pr.id, pr.name, price, (available-consumed) as stock, ct.name as category_name , user_id
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

	async getTopPopularProducts(
		limit = 0,
	): Promise<{ id: number; name: string; price: number; stock: number; category_name: string; user_id: number }[]> {
		try {
			const sql = `SELECT pr.id, pr.name, price, (available-consumed) as stock, ct.name as category_name , user_id
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
