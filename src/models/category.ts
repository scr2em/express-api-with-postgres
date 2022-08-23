import db from "../db/db"
import {Store} from "../types";

export interface CategoryI {
    id : number;
    name : string
}

export class CategoryStore implements Store<CategoryI>{
    async index(): Promise<CategoryI[]> {
        try{
            const conn = await  db.connect()
            const sql = "SELECT * FROM categories"
            const result = await conn.query(sql)
            conn.release()
            return Promise.resolve(result.rows);
        }catch (e){
            throw new Error(`cannot get categories ${e}`)
        }

    }
    async show(id: number): Promise<CategoryI> {
        try {
            const sql = 'SELECT * FROM categories WHERE id=($1)'
            const conn = await db.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find category with id ${id}.`)
        }
    }

    async create({name}: {name :string}): Promise<CategoryI> {
        try {
            const sql = 'INSERT INTO categories (name) VALUES($1) RETURNING *'
            const conn = await db.connect()
            const result = await conn
                .query(sql, [name])
            const category = result.rows[0]
            conn.release()
            return category
        } catch (err) {
            throw new Error(`Could not add new category ${name}.`)
        }
    }
    async delete(id: number): Promise<CategoryI> {
        try {
            const sql = 'DELETE FROM categories WHERE id=($1)'
            const conn = await db.connect()
            const result = await conn.query(sql, [id])
            const category = result.rows[0]
            conn.release()
            return category
        } catch (err) {
            throw new Error(`Could not delete category ${id}.`)
        }
    }
}

