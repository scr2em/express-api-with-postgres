import bcrypt from "bcrypt";

const { BCRYPT_SALT_ROUNDS = 5, BCRYPT_PEPPER = "" } = process.env;

export function encryptPassword(password: string): string {
	return bcrypt.hashSync(password + BCRYPT_PEPPER, +BCRYPT_SALT_ROUNDS);
}

export function verifyPassword(password: string, password_hashed: string): boolean {
	return bcrypt.compareSync(password + BCRYPT_PEPPER, password_hashed);
}
