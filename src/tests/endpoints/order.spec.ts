import request from "supertest";
import app from "../../server";
import { UserStore } from "../../models/user";
import { CategoryStore } from "../../models/category";
import { ProductStore } from "../../models/product";
import { OrderStore } from "../../models/order";

describe("ENDPOINT /order suite test", () => {
	let user: { id: number; token: string };
	let category: { id: number; name: string };
	let product: { id: number; name: string; price: number; stock: number; category_name: string };

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
		const productResponse = await request(app)
			.post("/product")
			.send({ name: "test-product", price: 100, available: 10, categoryId: category.id })
			.set("Authorization", "Bearer " + user.token);

		product = productResponse.body;
	});

	it("GET - empty list of order", async () => {
		const response = await request(app)
			.get("/order")
			.set("Authorization", "Bearer " + user.token);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual([]);
	});

	let orderId: number;
	it("POST - a new order ", async () => {
		const response = await request(app)
			.post("/order")
			.send({ products: [{ id: product.id, quantity: 3 }] })
			.set("Authorization", "Bearer " + user.token);

		orderId = response.body.order_id;
		expect(response.status).toEqual(201);
		expect(response.body).toEqual({
			order_id: orderId,
			status: "active",
			products: [
				{
					id: product.id,
					name: product.name,
					quantity: 3,
					categoryName: category.name,
					price: 100,
				},
			],
		});
	});

	it("GET - list of orders", async () => {
		const response = await request(app)
			.get("/order")
			.set("Authorization", "Bearer " + user.token);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				order_id: orderId,
				status: "active",
				products: [
					{
						id: product.id,
						name: product.name,
						quantity: 3,
						categoryName: category.name,
						price: 100,
					},
				],
			},
		]);
	});
	it("GET - a order by id", async () => {
		const response = await request(app)
			.get("/order/" + orderId)
			.set("Authorization", "Bearer " + user.token);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			order_id: orderId,
			status: "active",
			products: [{ id: product.id, name: product.name, quantity: 3, categoryName: category.name, price: 100 }],
		});
	});

	it("DELETE - a order by id", async () => {
		let response = await request(app)
			.delete("/order/" + orderId)
			.set("Authorization", "Bearer " + user.token);

		expect(response.status).toEqual(200);

		response = await request(app)
			.get("/order")
			.set("Authorization", "Bearer " + user.token);
		expect(response.body).toEqual([]);
	});

	// clean up
	afterAll(async () => {
		const userStore = new UserStore();
		const categoryStore = new CategoryStore();
		const productStore = new ProductStore();
		await productStore.delete(product.id);
		await categoryStore.delete(category.id);
		await userStore.delete(user.id);
	});
});
