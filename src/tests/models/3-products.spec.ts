import { ProductStore } from "../../models/product";
import { UserStore } from "../../models/user";
import { CategoryStore } from "../../models/category";

const productStore = new ProductStore();
const userStore = new UserStore();
const categoryStore = new CategoryStore();

describe("Product model test", () => {
	let user: { id: number; token: string };
	let category: { id: number; name: string };
	beforeAll(async () => {
		user = await userStore.create({
			email: "testing-products-email@google.com",
			firstName: "test",
			lastName: "test",
			password: "test",
		});
		category = await categoryStore.create({ name: "product-category" });
	});

	it("should have an index method", () => {
		expect(productStore.index).toBeDefined();
	});

	it("should have a show method", () => {
		expect(productStore.show).toBeDefined();
	});

	it("should have a create method", () => {
		expect(productStore.create).toBeDefined();
	});
	it("should have a delete method", () => {
		expect(productStore.delete).toBeDefined();
	});
	it("should have a isAllowedToDeleteProduct method", () => {
		expect(productStore.isAllowedToDeleteProduct).toBeDefined();
	});
	it("should have a getTopPopularProducts method", () => {
		expect(productStore.getTopPopularProducts).toBeDefined();
	});

	it("should return an empty list of users", async () => {
		const users = await productStore.index();
		expect(users).toEqual([]);
	});

	it("create method should add a new product", async () => {
		const product = await productStore.create({
			name: "product name here",
			userId: user.id,
			price: 100,
			available: 99,
			categoryId: category.id,
		});
		expect(product).toEqual({
			id: 1,
			name: "product name here",
			price: 100,
			stock: 99,
			category_name: "product-category",
			user_id: 2,
		});
	});
	it("should delete a product", async () => {
		await productStore.delete(1);

		const products = await productStore.index();
		expect(products).toEqual([]);
	});
});
