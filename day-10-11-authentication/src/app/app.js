import express from "express";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to API",
  });
});

app.post("/api/auth/register", (req, res) => {
  const { email, name, password } = req.body;
  // db bb

  const token = jwt.sign(
    {
      email,
      name,
    },
    "f4d5f5e7032c77f42b357336c6b707df2ea02c2812cb8aa107233b2a148d868b",
  );

  res.status(201).json({
    message: "User Created Successfully",
    data: {
      user: {
        email,
        name,
      },
      token,
    },
  });
});

export default app;
