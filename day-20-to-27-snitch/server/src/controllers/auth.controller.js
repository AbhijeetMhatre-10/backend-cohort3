import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/auth.util.js";

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const oldUser = await userModel.findOne({ email });

    if (oldUser) {
      return res.status(400).json({
        message: "Email already exists.",
        error: [
          {
            path: "email",
            msg: "User already exists with this email id.",
          },
        ],
      });
    }

    const newUser = await userModel.create({
      email,
      name,
      password: await bcrypt.hash(password, 10),
    });

    const { refreshToken, accessToken } = generateTokens({
      userId: newUser._id,
      role: newUser.role,
    });

    await userModel.findByIdAndUpdate(newUser._id, {
      refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    res.status(201).json({
      message: "User created successfully.",
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      accessToken,
    });
  } catch (error) {
    console.log("Error in the register controller", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const { refreshToken, accessToken } = generateTokens({
      userId: user._id,
      role: user.role,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    res.status(200).json({
      message: "User logged in successfully.",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized, refresh token not found",
    });
  }

  try {
    const decode = verifyRefreshToken({ refreshToken });

    const user = await userModel.findById(decode.id);

    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
      });
    }

    if (user.refreshToken !== refreshToken) {
      await userModel.findByIdAndUpdate(user.id, {
        refreshToken: null,
      });

      return res.status(401).json({
        message: "Unauthorized, invalid refresh token",
      });
    }

    const { refreshToken: newRefreshToken, accessToken } = generateTokens({
      userId: user._id,
      role: user.role,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
    });

    await userModel.findByIdAndUpdate(user._id, {
      newRefreshToken,
    });

    res.status(200).json({
      message: "Refreshed Successfully.",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      accessToken,
    });
  } catch (error) {
    console.log("Error in refresh API", error);

    return res.status(401).json({
      message: "Unauthorized, invalid or expired refresh token",
    });
  }
};

const me = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User Authenticated SUccessfully.",
      data: {
        user: {
          name: user.name,
          email: user.email,
          id: user._id,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.log("Error in me API", error);
    res.status(500).json({
      message: "Internal Server Error.",
    });
  }
};

export { register, login, refresh, me };
