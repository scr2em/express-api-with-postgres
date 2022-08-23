import {Router} from 'express'
import {CategoryStore} from "../models/category";
const categoryRouter: Router = Router();


categoryRouter.post("/category",async (req,res)=>{
    const {name } = req.body

    const store = new CategoryStore()
    try {
        const category = await store.create({name})
        res.send(category)
    }catch (e){
        res.status(400).send("error")
    }
})

export default categoryRouter
