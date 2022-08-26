export abstract class Store<T> {
	abstract index(): Promise<T[]>;
	abstract show(id: number): Promise<T>;
	abstract create(data: Partial<T>): Promise<T>;
	abstract delete(id: number): Promise<boolean>;
}
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
}

export interface DbProductI {
	id: number;
	name: string;
	price: number;
	available: number;
	consumed: number;
	categoryId: number;
}
