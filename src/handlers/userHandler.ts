import { Router } from "express";
import { getError } from "../utils/errorHandling";
import { UserStore } from "../models/user";
import { authorizeUser } from "../middlewares/authenticate";
const router: Router = Router();

const store = new UserStore();

router.get("/user", authorizeUser, async (req, res) => {
	try {
		const users = await store.index();
		res.send(users);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});

router.get("/user/:id", authorizeUser, async (req, res) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).send("id param is missing");
	}
	try {
		const user = await store.show(+id);
		res.send(user);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});

router.post("/user", async (req, res) => {
	const { email, firstName, lastName, password } = req.body;

	try {
		const user = await store.create({ email, firstName, lastName, password });
		res.status(201).send(user);
	} catch (e) {
		res.status(400).send(getError(e));
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const token = await store.authenticate({ email, password });
		if (token) {
			res.status(201).send(token);
		} else {
			res.status(400).end();
		}
	} catch (e) {
		res.status(400).send(getError(e));
	}
});
export default router;
