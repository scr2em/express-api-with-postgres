import {CategoryStore} from "../../models/category";

const store = new CategoryStore()

describe("Category model test" , ()=>{


    it("should have an index method" , ()=>{
        expect(store.index).toBeDefined()
    })


    it("should return a list of categories" , async()=>{
        const categories = await store.index();
        expect(categories).toEqual([])
    })
})
