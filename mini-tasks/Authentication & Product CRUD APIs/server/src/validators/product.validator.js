import { body, param, validationResult } from "express-validator";

const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .bail()
    .isString()
    .withMessage("Product name must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Product description is required")
    .bail()
    .isString()
    .withMessage("Product description must be a string"),
  body("sizes")
    .notEmpty()
    .withMessage("Product sizes are required")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Product sizes must be an array with at least one size")
    .bail()
    .custom((sizes) => {
      const validSizes = ["XS", "S", "M", "L", "XL", "XXL"];
      for (const size of sizes) {
        if (!validSizes.includes(size)) {
          throw new Error(
            `Invalid size: ${size}. Valid sizes are: ${validSizes.join(", ")}`,
          );
        }
      }
      return true;
    }),
  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Product price must be a non-negative number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Product stock must be a non-negative integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const editProductValidator = [
  param("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid Product ID format"),
  body("name")
    .exists()
    .withMessage("Product name is required")
    .bail()
    .isString()
    .withMessage("Product name must be a string"),
  body("description")
    .exists()
    .withMessage("Product description is required")
    .bail() 
    .isString()
    .withMessage("Product description must be a string"),
  body("sizes")
    .exists()
    .withMessage("Product sizes are required")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Product sizes must be an array with at least one size")
    .bail()
    .custom((sizes) => {
      const validSizes = ["XS", "S", "M", "L", "XL", "XXL"];
      for (const size of sizes) {
        if (!validSizes.includes(size)) {
          throw new Error(
            `Invalid size: ${size}. Valid sizes are: ${validSizes.join(", ")}`,
          );
        }
      }
      return true;
    }),
  body("price")
    .exists()
    .withMessage("Product price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Product price must be a non-negative number"),
  body("stock")
    .exists()
    .withMessage("Product stock is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Product stock must be a non-negative integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export { createProductValidator, editProductValidator };