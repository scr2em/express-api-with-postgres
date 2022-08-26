import { Request, Response, Router } from "express";
import { OrderStore } from "../models/order";
import { getError } from "../utils/errorHandling";
import router from "./categoryHandler";
const orderRouter: Router = Router();
const store = new OrderStore();

orderRouter.get("/order", async (req: Request, res: Response) => {
	try {
		const orders = await store.index();
		res.send(orders);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});
orderRouter.get("/order/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const orders = await store.show(+id);
		res.send(orders);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});
orderRouter.post("/order", async (req: Request, res: Response) => {
	const { userId, products } = req.body;
	try {
		const order = await store.create({ userId: parseInt(userId), products });
		res.send(order);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});

router.delete("/order/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const isDeleted = await store.delete(+id);
		res.send("done");
	} catch (e) {
		res.status(400).send(getError(e));
	}
});
export default orderRouter;
