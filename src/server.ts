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

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

app.use(morgan("combined"));

app.use(categoryRouter);
app.use(userRouter);
app.use(orderRouter);

app.get("/", function (req: Request, res: Response) {
	res.send("Hello World!");
});

app.listen(3000, function () {
	console.log(`Server is up and running at port: ${port} in mode: ${process.env.ENV}`);
});
