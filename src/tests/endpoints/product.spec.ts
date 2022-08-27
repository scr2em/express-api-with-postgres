import request from "supertest";
import app from "../../server";
import { UserStore } from "../../models/user";
import { CategoryStore } from "../../models/category";

describe("/product suite test", () => {
	let user: { id: number; token: string };
	let category: { id: number; name: string };
	let mockedProduct: { name: string; price: number; available: number; categoryId: number };

	beforeAll(async () => {
		const mockedUser = {
			email: "user-endpoint-test@gmail.com",
			firstName: "mohamed",
			lastName: "ali",
			password: "test",
		};
		const response = await request(app).post("/user").send(mockedUser);
		user = response.body;

		const categoryResponse = await request(app)
			.post("/category")
			.send({ name: "test-category" })
			.set("Authorization", "Bearer " + user.token);

		category = categoryResponse.body;
		mockedProduct = { name: "test-product", price: 100, available: 10, categoryId: category.id };
	});

	it("GET - empty list of products", async () => {
		const response = await request(app).get("/product");

		expect(response.status).toEqual(200);
		expect(response.body).toEqual([]);
	});

	let productId: number;
	it("POST - a new product ", async () => {
		const response = await request(app)
			.post("/product")
			.send(mockedProduct)
			.set("Authorization", "Bearer " + user.token);

		productId = response.body.id;
		expect(response.status).toEqual(201);
	});

	it("GET - list of products", async () => {
		const response = await request(app).get("/product");

		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: productId,
				name: mockedProduct.name,
				stock: mockedProduct.available,
				price: mockedProduct.price,
				category_name: category.name,
				user_id: user.id,
			},
		]);
	});
	it("GET - a product by id", async () => {
		const response = await request(app).get("/product/" + productId);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: productId,
			name: mockedProduct.name,
			stock: mockedProduct.available,
			price: mockedProduct.price,
			category_name: category.name,
			user_id: user.id,
		});
	});

	it("DELETE - a product by id", async () => {
		let response = await request(app)
			.delete("/product/" + productId)
			.set("Authorization", "Bearer " + user.token);

		expect(response.status).toEqual(200);
		response = await request(app).get("/product");

		expect(response.body).toEqual([]);
	});

	// clean up
	afterAll(async () => {
		const userStore = new UserStore();
		const categoryStore = new CategoryStore();

		await categoryStore.delete(category.id);
		await userStore.delete(user.id);
	});
});
