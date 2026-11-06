import express from "express";
import { createProductValidator, listProductValidator, unlistProductValidator } from "../validators/product.validator.js";
import {
  createProduct,
  getAllProducts,
  listProduct,
  unlistProduct,
} from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";
import parseProductData from "../middlewares/product.middleware.js";

const productRouter = express.Router();

productRouter.post(
  "/create",
  upload.array("images"),
  parseProductData,
  createProductValidator,
  authenticate,
  async (req, res, next) => {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        message: "User is not authorized to visit.",
      });
    }
    next();
  },

  createProduct,
);

productRouter.get("", authenticate, getAllProducts);

productRouter.patch("/unlist/:id", authenticate, (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      message: "Unauthorized.",
    });
  }
}, unlistProductValidator, unlistProduct);

productRouter.patch("/list/:id", authenticate, (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      message: "Unauthorized.",
    });
  }
}, listProductValidator, listProduct);

export default productRouter;
