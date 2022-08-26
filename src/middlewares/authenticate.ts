import { Request, Response, NextFunction } from "express";
import { decodeToken, verifyToken } from "../utils/token";
import { getError } from "../utils/errorHandling";
export const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).end("token required");

	try {
		verifyToken(token);
	} catch (e) {
		const error = getError(e);
		if (error === "jwt expired") {
			return res.status(400).end("token expired");
		}
		return res.status(400).end("invalid token");
	}

	res.locals.decodedToken = decodeToken(token);

	next();
};
