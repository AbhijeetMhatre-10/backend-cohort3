import express from "express";
import productModel from "../modules/product.model.js";
import { createProduct, editProduct, getAllProducts } from "../controllers/product.controller.js";
import { createProductValidator, editProductValidator } from "../validators/product.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/product.middleware.js";

const productRouter = express.Router();

/**
 *  @route   POST /api/products
 *  @desc    Create a new product
 *  @access  Authenticated
 */
productRouter.post(
  "/",
  createProductValidator,
  authenticate,
  checkAdmin,
  createProduct,
);

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
productRouter.get("/", getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get a product by ID
 * @access  Public
 */
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product by ID
 * @access  Authenticated
 */
productRouter.put(
  "/:id",
  authenticate,
  checkAdmin,
  editProductValidator,
  editProduct,
);

export default productRouter;
