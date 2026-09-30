import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/auth.util.js";

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

export { register, login };
