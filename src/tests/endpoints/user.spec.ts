import request from "supertest";
import app from "../../server";
import { UserStore } from "../../models/user";

const mockedUser = { email: "user-endpoint-test@gmail.com", firstName: "mohamed", lastName: "ali", password: "test" };

describe("ENDPOINT /user suite test", () => {
	let userId: number;
	let token: string;
	it("POST - create a new user", async () => {
		const response = await request(app).post("/user").send(mockedUser);

		userId = response.body.id;
		token = response.body.token;
		expect(response.status).toEqual(201);
		expect(response.body.token).toBeTruthy();
		expect(response.body.id).toBeTruthy();
	});

	describe("test protected routes", () => {
		it("GET -  a user by id", async () => {
			const response = await request(app)
				.get("/user/" + userId)
				.set("Authorization", "Bearer " + token);

			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				email: mockedUser.email,
				id: userId,
				first_name: mockedUser.firstName,
				last_name: mockedUser.lastName,
			});
		});
		it("GET - all users", async () => {
			const response = await request(app)
				.get("/user")
				.set("Authorization", "Bearer " + token);

			expect(response.status).toEqual(200);
			expect(response.body).toBeInstanceOf(Array);
		});
	});
	// clean up
	afterAll(async () => {
		const store = new UserStore();
		await store.delete(userId);
	});
});
