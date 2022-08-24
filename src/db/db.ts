import { Pool } from "pg";
import "dotenv/config";

const {
	POSTGRES_HOST,
	POSTGRES_DB,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_DB_TEST,
	POSTGRES_USER_TEST,
	POSTGRES_PASSWORD_TEST,
	ENV,
} = process.env;

const isTestMode = ENV === "test";

const db = new Pool({
	host: POSTGRES_HOST,
	database: isTestMode ? POSTGRES_DB_TEST : POSTGRES_DB,
	user: isTestMode ? POSTGRES_USER_TEST : POSTGRES_USER,
	password: isTestMode ? POSTGRES_PASSWORD_TEST : POSTGRES_PASSWORD,
});

export default db;
