import db from "../db/db";
import { Store, UserI } from "../types";
import { createToken } from "../utils/token";
import { encryptPassword, verifyPassword } from "../utils/password";

export class UserStore implements Omit<Store<UserI>, "delete"> {
	async index(): Promise<UserI[]> {
		const conn = await db.connect();
		try {
			const sql = "SELECT id, email, first_name, last_name FROM users";
			const result = await conn.query(sql);

			return Promise.resolve(result.rows);
		} catch (e) {
			throw new Error(`cannot get users.`);
		} finally {
			conn.release();
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

	async create({
		email,
		firstName,
		lastName,
		password,
	}: Pick<UserI, "email" | "firstName" | "lastName" | "password">): Promise<{ token: string }> {
		const conn = await db.connect();
		try {
			const sql =
				"INSERT INTO users (email,first_name,last_name,password) VALUES($1, $2, $3, $4) RETURNING id, email, first_name, last_name";

			const encryptedPassword = encryptPassword(password);
			const result = await conn.query(sql, [email, firstName, lastName, encryptedPassword]);
			const user = result.rows[0];

			return {
				token: createToken({ id: user.id, email }, { expiresIn: 400 }),
			};
		} catch (err) {
			throw new Error(`Could not add new user ${email}.`);
		} finally {
			conn.release();
		}
	}

	async authenticate({ email, password }: Pick<UserI, "email" | "password">): Promise<string | undefined> {
		const conn = await db.connect();

		try {
			const result = await db.query("SELECT id, email, password FROM users where email = $1", [email]);
			const id = result.rows[0].id;
			const password_hashed = result.rows[0].password;
			const dbEmail = result.rows[0].email;
			const isPasswordCorrect = verifyPassword(password, password_hashed);
			if (isPasswordCorrect) {
				return createToken({ id, email: dbEmail });
			} else {
				return;
			}
		} catch (e) {
			throw new Error(`Could not login user with email: ${email}.`);
		} finally {
			conn.release();
		}
	}
}
