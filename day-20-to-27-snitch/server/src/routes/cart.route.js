import express from "express";
import { createCart } from "../controllers/cart.controller.js";
import { addToCartValidator } from "../validators/cart.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.post("", addToCartValidator,authenticate, createCart);

export default cartRouter;
