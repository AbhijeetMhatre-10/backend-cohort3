import express from "express";
import { createProductValidator } from "../validators/product.validator.js";
import { createProduct } from "../controllers/product.controller.js";
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

export default productRouter;
