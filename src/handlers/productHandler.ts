import { Router } from "express";
import { getError } from "../utils/errorHandling";
import { ProductStore } from "../models/product";
const router: Router = Router();

const store = new ProductStore();

router.get("/product", async (req, res) => {
	const category_id = req.query.category_id;
	try {
		if (category_id) {
			const products = await store.getProductsByCategory(+category_id);
			res.send(products);
		} else {
			const products = await store.index();
			res.send(products);
		}
	} catch (e) {
		res.status(400).send(getError(e));
	}
});
router.get("/popularProducts", async (req, res) => {
	const { limit = 2 } = req.query;
	try {
		const products = await store.getTopPopularProducts(+limit);
		res.send(products);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});

router.get("/product/:id", async (req, res) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).send("id param is missing");
	}
	try {
		const products = await store.show(+id);
		res.send(products);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});
router.post("/product", async (req, res) => {
	const { name, price, available, categoryId } = req.body;

	try {
		const product = await store.create({ name, price, available, categoryId });
		res.status(201).send(product);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});

router.delete("/product/:id", async (req, res) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).send("id param is missing");
	}
	try {
		const isDeleted = await store.delete(+id);
		res.send();
	} catch (e) {
		res.status(400).send(getError(e));
	}
});

export default router;
