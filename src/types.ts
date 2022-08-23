


export abstract class Store<T> {
     abstract index(): Promise<T[]>;
     abstract show(id: number): Promise<T>;
     abstract create(data : Partial<T>): Promise<T>;
     abstract delete(id: number): Promise<T>;

}

