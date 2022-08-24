import { CategoryStore, CategoryI } from "../../models/category";

const store = new CategoryStore();

describe("Category model test", () => {
	it("should have an index method", () => {
		expect(store.index).toBeDefined();
	});

	it("should have a show method", () => {
		expect(store.index).toBeDefined();
	});

	it("should have a create method", () => {
		expect(store.index).toBeDefined();
	});

	it("should have a update method", () => {
		expect(store.index).toBeDefined();
	});

	it("should have a delete method", () => {
		expect(store.index).toBeDefined();
	});

	it("should return an empty list of categories", async () => {
		const categories = await store.index();
		expect(categories).toEqual([]);
	});

	it("create method should add a book", async () => {
		const result = await store.create({
			name: "testName",
		});
		expect(result).toEqual({
			id: 1,
			name: "testName",
		});
	});

	it("index method should return a list of books", async () => {
		const result = await store.index();
		expect(result).toEqual([
			{
				id: 1,
				name: "testName",
			},
		]);
	});

	it("show method should return the correct book", async () => {
		const result = await store.show(1);
		expect(result).toEqual({
			id: 1,
			name: "testName",
		});
	});

	it("delete method should remove the book", async () => {
		await store.delete(1);
		const result = await store.index();

		expect(result).toEqual([]);
	});
});
