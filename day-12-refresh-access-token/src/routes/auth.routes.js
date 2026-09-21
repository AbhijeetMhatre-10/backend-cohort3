import express from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/auth.util.js";

const authRouter = express.Router();

/**
 *   @POST /api/auth/register
 */
authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // check if email already exists
  if (await UserModel.findOne({ email })) {
    return res.status(400).json({
      message: "User Already Exists.",
      error: [
        {
          field: "email",
          message: "Email already exists.",
        },
      ],
    });
  }

  // create new user
  const user = await UserModel.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });

  // get tokens
  const { refreshToken, accessToken } = generateTokens({ userId: user._id });

  // store refreshToken in db
  user.refreshToken = refreshToken;
  await user.save();

  // store refreshToken in client cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  // send response
  res.status(201).json({
    message: "User Created Successfully",
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
    accessToken,
  });
});

/**
 *   @POST /api/auth/login
 */
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // find user
  const user = await UserModel.findOne({ email });

  const isPasswordMatched = user
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!user || !isPasswordMatched) {
    return res.status(400).json({
      message: "Wrong email or password.",
    });
  }

  // get tokens
  const { refreshToken, accessToken } = generateTokens({ userId: user._id });

  // store refreshToken in db
  user.refreshToken = refreshToken;
  await user.save();

  // store refreshToken in client cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  // send response
  return res.status(200).json({
    message: "User Logged In Successfully",
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
    accessToken,
  });
});

/**
 *   @GET /api/auth/me
 */
authRouter.get("/me", async (req, res) => {
  const accessToken = req?.headers?.authorization?.split(" ")[1];

  try {
    const decode = verifyAccessToken({ accessToken });

    const user = await UserModel.findById(decode.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User Fetched Successfully.",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({
      message: "Unauthrized User",
    });
  }
});

/**
 *   @POST /api/auth/refresh
 */
authRouter.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized, refresh token not found",
    });
  }

  try {
    const decode = verifyRefreshToken({ refreshToken });

    const user = await UserModel.findById(decode.id);

    if (user.refreshToken !== refreshToken) {
      user.refreshToken = null;
      await user.save();

      return res.status(401).json({
        message: "Unauthorized, invalid refresh token",
      });
    }

    // get tokens
    const { refreshToken, accessToken } = generateTokens({ userId: user._id });

    // store refreshToken in db
    user.refreshToken = refreshToken;
    await user.save();

    // store refreshToken in client cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    // send response
    return res.status(200).json({
      message: "Access token refreshed successfully",
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
      accessToken,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error occured in verifying refresh token",
    });
  }
});

export default authRouter;
