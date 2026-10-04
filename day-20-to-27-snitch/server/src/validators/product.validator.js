import { body, validationResult } from "express-validator";

const createProductValidator = [
  body("title")
    .exists()
    .withMessage("Title is required.")
    .bail()
    .isString()
    .withMessage("Title must be a string.")
    .bail()
    .trim()
    .isLength({
      min: 2,
      max: 20,
    })
    .withMessage("Title length should be between 2 to 20 characters.")
    .bail()
    .isAlpha("en-US", { ignore: [" ", "-"] })
    .withMessage("Title must only contains alphabets."),

  body("description")
    .exists()
    .withMessage("Description is required.")
    .bail()
    .isString()
    .withMessage("Description must be a string.")
    .bail()
    .trim()
    .isLength({
      min: 20,
      max: 100,
    })
    .withMessage("Description length should be between 20 to 100 characters.")
    .bail()
    .isAlpha("en-US", { ignore: [" ", "-"] })
    .withMessage("Description must only contains alphabets."),

  body("price.amount")
    .exists()
    .withMessage("Price amount is required.")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price amount should be floating number & must be above 0."),

  body("price.currency")
    .exists()
    .withMessage("Price currency is required.")
    .bail()
    .isString()
    .withMessage("Price currency should be string.")
    .bail()
    .isIn(["INR", "USD"])
    .withMessage("Only INR and USD currency is accepted."),

  body("sizes")
    .exists()
    .withMessage("Sizes required.")
    .bail()
    .isArray()
    .withMessage("Sizes must be in array."),

  body("sizes.*.size")
    .exists()
    .withMessage("At least one size should be declared")
    .bail()
    .isString()
    .withMessage("Size must be a string.")
    .bail()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Size must be from XS to XXL."),

  body("sizes.*.stock")
    .isNumeric({ min: 0 })
    .withMessage("Stock must be a number and above 0."),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "400 error",
        errors: errors.array(),
      });
    }

    next();
  },
];

export { createProductValidator };
