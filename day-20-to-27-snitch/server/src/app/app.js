import express from "express";
import authRouter from "../routes/auth.route.js";
import cookieParser from "cookie-parser";
import productRouter from "../routes/product.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter)

export default app;
