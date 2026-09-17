import express from "express";
import postRouter from "./routes/post.route.js";

const app = express();

app.use(express.json());

// routes
// app.use("/", controller)
app.use("/post", postRouter)

export default app;
