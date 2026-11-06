import express from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";
import {
  login,
  me,
  refresh,
  register,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);

authRouter.post("/login", loginValidator, login);

authRouter.get("/refresh", refresh);

authRouter.get("/me", authenticate, me);

export default authRouter;
