import { UserStore } from "../../models/user";
import objectContaining = jasmine.objectContaining;

const store = new UserStore();

describe("User model test", () => {
	it("should have an index method", () => {
		expect(store.index).toBeDefined();
	});

	it("should have a show method", () => {
		expect(store.show).toBeDefined();
	});

	it("should have a create method", () => {
		expect(store.create).toBeDefined();
	});

	it("should have an authenticate method", () => {
		expect(store.authenticate).toBeDefined();
	});

	it("should return an empty list of users", async () => {
		const users = await store.index();
		expect(users).toEqual([]);
	});
	let userId: number;
	it("create method should add a new user", async () => {
		const { token, id } = await store.create({
			firstName: "mohamed",
			lastName: "abdelgawad",
			email: "mohamed@mohamed.com",
			password: "test",
		});
		userId = id;
		expect(token).toBeInstanceOf(String);
	});

	it("index method should return a list of users", async () => {
		const users = await store.index();
		expect(users).toEqual([
			{
				id: userId,
				email: "mohamed@mohamed.com",
				first_name: "mohamed",
				last_name: "abdelgawad",
			},
		]);
	});

	it("show method should return a user by id", async () => {
		const result = await store.show(userId);
		expect(result).toEqual({
			id: userId,
			email: "mohamed@mohamed.com",
			first_name: "mohamed",
			last_name: "abdelgawad",
		});
	});

	it("authenticate user by correct password", async () => {
		const token = await store.authenticate({ email: "mohamed@mohamed.com", password: "test" });
		expect(token).toBeInstanceOf(String);
	});

	it("doesn't authenticate user by wrong password", async () => {
		const token = await store.authenticate({ email: "mohamed@mohamed.com", password: "wrong password" });
		expect(token).toEqual(undefined);
	});
});
