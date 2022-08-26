import { Router } from "express";
import { CategoryStore } from "../models/category";
import { getError } from "../utils/errorHandling";
import { authorizeUser } from "../middlewares/authenticate";
const router: Router = Router();

const store = new CategoryStore();

router.get("/category", async (req, res) => {
	try {
		const categories = await store.index();
		res.send(categories);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});
router.get("/category/:id", async (req, res) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).send("id param is missing");
	}
	try {
		const category = await store.show(+id);
		res.send(category);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});
router.post("/category", authorizeUser, async (req, res) => {
	const { name } = req.body;

	try {
		const category = await store.create({ name });
		res.status(201).send(category);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});

router.delete("/category/:id", authorizeUser, async (req, res) => {
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
