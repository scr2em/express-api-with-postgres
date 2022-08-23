import express, { Request, Response, Application } from 'express'
import bodyParser from 'body-parser'
import orderRouter from "./handlers/orderHandler";
import 'dotenv/config'
import categoryRouter from "./handlers/categoryHandler";

const app: Application = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())


app.use(categoryRouter)
app.use(orderRouter)

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.listen(3000, function () {
    console.log(`Server is up and running at port: ${port}`)
})
