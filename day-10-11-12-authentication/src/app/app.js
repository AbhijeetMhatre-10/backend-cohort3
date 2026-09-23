import express from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import authentication from "../middlewares/auth.middleware.js";
import dotenv from "dotenv";
import bcrypt, { hash } from "bcrypt";

const app = express();

app.use(express.json());
dotenv.config();

// backend working
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to API",
  });
});

// register user
app.post("/api/auth/register", async (req, res) => {
  const { email, name, password } = req.body;

  const user = await UserModel.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.status(201).json({
    message: "User Created Successfully",
    data: {
      user: {
        email,
        name,
        id: user._id,
      },
      token,
    },
  });
});

// verify user on any req based on token
app.get("/api/auth/me", authentication, async (req, res) => {
  res.status(200).json({
    message: "User Authenticated",
    data: req.user,
  });
});

// login user
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.status(200).json({
    message: "User Logged In",
    data: {
      user,
      token,
    },
  });
});

export default app;
