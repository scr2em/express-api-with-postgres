import { Router } from "express";

const orderRouter: Router = Router();

orderRouter.get("/order", (req, res) => {
	res.send("hi");
});

export default orderRouter;
