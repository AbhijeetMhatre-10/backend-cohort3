import express from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";
import {
  hydrateUser,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

/**
 *  @route   POST /api/auth/register
 *  @desc    Register a new user
 *  @access  Public
 */
authRouter.post("/register", registerValidator, registerUser);

/**
 *  @route   POST /api/auth/login
 *  @desc    Authenticate an existing user
 *  @access  Public
 */
authRouter.post("/login", loginValidator, loginUser);

/**
 *  @route   POST /api/auth/refresh-token
 *  @desc    Generate a new access token using a refresh token
 *  @access  Public
 */
authRouter.post("/refresh-token", authenticate, refreshTokens);

/**
 *  @route   POST /api/auth/logout
 *  @desc    Log out the authenticated user and invalidate their session or tokens
 *  @access  Authenticated
 */
authRouter.post("/logout", logoutUser);

/**
 *  @route   GET /api/auth/register
 *  @desc    Get the currently authenticated user's details
 *  @access  Authenticated
 */
authRouter.get("/me", authenticate, hydrateUser);

export default authRouter;
