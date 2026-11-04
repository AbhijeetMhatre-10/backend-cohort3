import express from "express";
import authRouter from "../routes/auth.route.js";
import cookieParser from "cookie-parser";
import productRouter from "../routes/product.route.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

export default app;
