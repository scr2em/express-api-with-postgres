import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import orderRouter from "./handlers/orderHandler";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import categoryRouter from "./handlers/categoryHandler";
import userRouter from "./handlers/userHandler";
import productRouter from "./handlers/productHandler";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

if (process.env.ENV === "dev") {
	app.use(morgan("combined"));
}

app.use(categoryRouter);
app.use(userRouter);
app.use(orderRouter);
app.use(productRouter);

app.get("/", function (req: Request, res: Response) {
	res.send("Hello World!");
});

app.all("*", (_, res) => {
	res.status(404).end("page not found");
});
app.listen(port, function () {
	console.log(`Server is up and running at port: ${port} in mode: ${process.env.ENV}`);
});

export default app;
