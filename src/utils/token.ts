import jwt, { SignOptions } from "jsonwebtoken";

export function createToken(payload: Record<any, unknown>, options?: SignOptions): string {
	return jwt.sign(payload, process.env.JWT_SECRET!, options);
}

export function verifyToken(token: string) {
	return jwt.verify(token, process.env.JWT_SECRET!);
}

export function decodeToken(token: string) {
	return jwt.decode(token);
}
