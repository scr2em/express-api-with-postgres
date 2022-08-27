import request from "supertest";
import app from "../../server";
import { UserStore } from "../../models/user";

const mockedCategory = { name: "test" };

describe("/category suite test", () => {
	let userId: number;
	let token: string;

	beforeAll(async () => {
		const mockedUser = {
			email: "user-endpoint-test@gmail.com",
			firstName: "mohamed",
			lastName: "ali",
			password: "test",
		};
		const response = await request(app).post("/user").send(mockedUser);
		userId = response.body.id;
		token = response.body.token;
	});
	let categoryId: number;

	it("GET - empty list of  categories", async () => {
		const response = await request(app).get("/category");

		expect(response.status).toEqual(200);
		expect(response.body).toEqual([]);
	});

	it("POST - a new category ", async () => {
		const response = await request(app)
			.post("/category")
			.send(mockedCategory)
			.set("Authorization", "Bearer " + token);

		categoryId = response.body.id;
		expect(response.status).toEqual(201);
	});
	it("GET - list of categories", async () => {
		const response = await request(app).get("/category");

		expect(response.status).toEqual(200);
		expect(response.body).toEqual([{ id: categoryId, name: mockedCategory.name }]);
	});
	it("GET - a category by id", async () => {
		const response = await request(app).get("/category/" + categoryId);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ id: categoryId, name: mockedCategory.name });
	});

	it("DELETE - a category by id", async () => {
		let response = await request(app)
			.delete("/category/" + categoryId)
			.set("Authorization", "Bearer " + token);

		expect(response.status).toEqual(200);
		response = await request(app).get("/category");

		expect(response.body).toEqual([]);
	});

	// clean up
	afterAll(async () => {
		const store = new UserStore();
		await store.delete(userId);
	});
});
