import userModel from "../modules/user.model.js";
import bcrypt from "bcrypt";
import { generateTokens, verifyRefreshToken } from "../utils/auth.util.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await userModel.findOne({ email });

    console.log(userExists);

    if (userExists) {
      return res.status(409).json({
        message: "User Already Exists with this email id.",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    res.status(201).json({
      message: "User created successfully.",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error in register user controller", error);
    res.status(400).json({
      message: "Error in register User Controller.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    const isPasswordMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isPasswordMatch) {
      return res.status(401).json({
        message: "Email or Password does not match.",
      });
    }

    const { refreshToken, accessToken } = generateTokens({ id: user._id });

    await userModel.findOneAndUpdate({ email }, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    res.status(200).json({
      message: "User fetched successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    console.log("Error in login user controller", error);
    res.status(400).json({
      message: "Error in login User Controller.",
    });
  }
};

const refreshTokens = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const { id } = req.user;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(400).json({
        message: "Invalid Access Token",
      });
    }

    if (!refreshToken || refreshToken !== user.refreshToken) {
      res.clearCookie("refreshToken");

      return res.status(401).json({
        message: "Invalid Refresh Token",
      });
    }

    const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
      generateTokens({ id });

    await userModel.findByIdAndUpdate(id, { refreshToken: newRefreshToken });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
    });

    res.status(200).json({
      message: "New Tokens created successfully.",
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error in refreshTokens controller", error);
    res.status(400).json({
      message: "Error in refreshTokens Controller.",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies || {};

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);

        await userModel.findByIdAndUpdate(decoded.id, {
          refreshToken: null,
        });
      } catch (error) {
        // Invalid or expired token; continue logout.
      }
    }

    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.error("Error in logout user controller:", error);

    return res.status(500).json({
      message: "Error in logout user controller.",
    });
  }
};

const hydrateUser = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      message: "User hydrated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error in hydrateuser controller", error);
    res.status(500).json({
      message: "Internal Server Error.",
    });
  }
};

export { registerUser, loginUser, refreshTokens, logoutUser, hydrateUser };
