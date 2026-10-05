import { body, validationResult } from "express-validator";

const registerValidator = [
  body("email")
    .exists()
    .withMessage("Email is required.")
    .bail()
    .isString()
    .withMessage("Name must be a String.")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Valid email required."),
  body("name")
    .exists()
    .withMessage("Name is required.")
    .bail()
    .isString()
    .withMessage("Name must be a String.")
    .bail()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters."),
  body("password")
    .exists()
    .withMessage("Password is required.")
    .bail()
    .isString()
    .withMessage("Password must be a String.")
    .bail()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters."),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid Request",
        errors: errors.array(),
      });
    }

    next();
  },
];

const loginValidator = [
  body("email")
    .exists()
    .withMessage("Email is required.")
    .bail()
    .isString()
    .withMessage("Name must be a String.")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Valid email required."),
  body("password")
    .exists()
    .withMessage("Password is required.")
    .bail()
    .isString()
    .withMessage("Password must be a String.")
    .bail()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters."),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid Request",
        errors: errors.array(),
      });
    }

    next();
  },
];

export { registerValidator, loginValidator };
