import { Request, Response, Router } from "express";
import { OrderStore } from "../models/order";
import { getError } from "../utils/errorHandling";
import router from "./categoryHandler";
import { authorizeUser } from "../middlewares/authenticate";
const orderRouter: Router = Router();
const store = new OrderStore();

orderRouter.get("/order", authorizeUser, async (req: Request, res: Response) => {
	try {
		const userId = res.locals.decodedToken.id;
		const orders = await store.index(userId);
		res.send(orders);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});

orderRouter.get("/order/:id", authorizeUser, async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const orders = await store.show(+id);
		res.send(orders);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});
orderRouter.post("/order", authorizeUser, async (req: Request, res: Response) => {
	const { products } = req.body;
	const userId = res.locals.decodedToken.id;
	try {
		const order = await store.create({ userId, products });
		res.status(201).send(order);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});

router.delete("/order/:id", authorizeUser, async (req, res) => {
	const { id: orderId } = req.params;
	const { id: userId } = res.locals.decodedToken;
	try {
		const isAllowedToDelete = await store.isAllowedToDeleteOrder(userId, +orderId);
		if (isAllowedToDelete) {
			await store.delete(+orderId);
			res.send("done");
		} else {
			res.status(401).end();
		}
	} catch (e) {
		res.status(400).send(getError(e));
	}
});
export default orderRouter;
