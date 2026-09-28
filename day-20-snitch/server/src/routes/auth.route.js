import express from "express";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { register } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);

authRouter.post("/login", loginValidator, login)

export default authRouter;
