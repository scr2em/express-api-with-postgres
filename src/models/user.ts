import db from "../db/db";
import { Store, UserI } from "../types";
import bcrypt from "bcrypt";

export class UserStore implements Omit<Store<UserI>, "delete"> {
	async index(): Promise<UserI[]> {
		try {
			const conn = await db.connect();
			const sql = "SELECT id, email, first_name, last_name FROM users";
			const result = await conn.query(sql);
			conn.release();
			return Promise.resolve(result.rows);
		} catch (e) {
			throw new Error(`cannot get users.`);
		}
	}
	async show(id: number): Promise<UserI> {
		try {
			const sql = "SELECT id, email, first_name, last_name FROM users WHERE id=($1)";
			const conn = await db.connect();
			const result = await conn.query(sql, [id]);
			conn.release();
			return result.rows[0];
		} catch (err) {
			throw new Error(`Could not find user with id ${id}.`);
		}
	}

	async create({ email, firstName, lastName, password }: Partial<UserI>): Promise<UserI> {
		try {
			const sql =
				"INSERT INTO users (email,first_name,last_name,password) VALUES($1, $2, $3, $4) RETURNING id, email, first_name, last_name";
			const conn = await db.connect();

			const { BCRYPT_SALT_ROUNDS = 5, BCRYPT_PEPPER = "" } = process.env;
			const encryptedPassword = bcrypt.hashSync(password + BCRYPT_PEPPER, +BCRYPT_SALT_ROUNDS);
			const result = await conn.query(sql, [email, firstName, lastName, encryptedPassword]);
			const category = result.rows[0];
			conn.release();
			return category;
		} catch (err) {
			throw new Error(`Could not add new user ${email}.`);
		}
	}

	// async authenticate();
}
