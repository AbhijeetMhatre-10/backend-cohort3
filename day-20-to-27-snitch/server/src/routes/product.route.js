import express from "express";
import { createProductValidator } from "../validators/product.validator.js";
import { createProduct } from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.post("/create", createProductValidator, createProduct);

export default productRouter;
