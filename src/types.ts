export interface CategoryI {
	id: number;
	name: string;
}

export interface UserI {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}
export interface DbUser {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
}
export interface OrderI {
	id: number;
	userId: number;
	status: "active" | "completed" | "canceled";
	products: { id: number; quantity: number }[];
}

export interface ProductI {
	id: number;
	name: string;
	price: number;
	stock: number;
	categoryName: string;
	userId: number;
}

export interface DbProductI {
	id: number;
	name: string;
	price: number;
	available: number;
	consumed: number;
	categoryId: number;
	userId: number;
}
