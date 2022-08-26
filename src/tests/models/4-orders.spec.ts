import { ProductStore } from "../../models/product";
import { UserStore } from "../../models/user";
import { CategoryStore } from "../../models/category";
import { OrderStore } from "../../models/order";

const productStore = new ProductStore();
const userStore = new UserStore();
const categoryStore = new CategoryStore();
const orderStore = new OrderStore();

describe("Order model test", () => {
	let user: { id: number; token: string };
	let category: { id: number; name: string };
	let productA: { id: number; name: string; price: number; stock: number; category_name: string; user_id: number };
	let productB: { id: number; name: string; price: number; stock: number; category_name: string; user_id: number };
	beforeAll(async () => {
		user = await userStore.create({
			email: "testing-orders-email@google.com",
			firstName: "test",
			lastName: "test",
			password: "test",
		});
		category = await categoryStore.create({ name: "order-product-category" });
		productA = await productStore.create({
			name: "product A",
			userId: user.id,
			price: 100,
			available: 10,
			categoryId: category.id,
		});
		productB = await productStore.create({
			name: "product B",
			userId: user.id,
			price: 200,
			available: 5,
			categoryId: category.id,
		});
	});

	it("should have an index method", () => {
		expect(orderStore.index).toBeDefined();
	});

	it("should have a show method", () => {
		expect(orderStore.show).toBeDefined();
	});

	it("should have a create method", () => {
		expect(orderStore.create).toBeDefined();
	});
	it("should have a delete method", () => {
		expect(orderStore.delete).toBeDefined();
	});

	it("should have a isAllowedToDeleteOrder method", () => {
		expect(orderStore.isAllowedToDeleteOrder).toBeDefined();
	});

	it("should return an empty list of orders", async () => {
		const orders = await orderStore.index(user.id);
		expect(orders).toEqual([]);
	});

	let orderId: number;
	it("create method should add a new order", async () => {
		const order = await orderStore.create({ userId: user.id, products: [{ id: productA.id, quantity: 5 }] });

		orderId = order.order_id;
		expect(order).toEqual({
			order_id: order.order_id,
			status: "active",
			products: [
				{
					id: productA.id,
					name: productA.name,
					price: productA.price,
					quantity: 5,
					categoryName: category.name,
				},
			],
		});
	});
	it("checks that the product stock is decreased by 5", async () => {
		const product = await productStore.show(productA.id);

		expect(product.stock).toEqual(5);
	});
	it("delete method should delete an order with specific id", async () => {
		const isDeleted = await orderStore.delete(orderId);

		expect(isDeleted).toEqual(true);

		const orders = await orderStore.index(user.id);

		expect(orders).toEqual([]);
	});

	afterAll(async () => {
		await productStore.delete(productA.id);
		await productStore.delete(productB.id);
		await categoryStore.delete(category.id);
		await userStore.delete(user.id);
	});
});
