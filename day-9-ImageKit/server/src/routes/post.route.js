import express from "express";
import postController from "../controllers/post.controller.js";
import upload from "../config/multer.config.js";

const postRouter = express.Router();

postRouter.post("/upload", upload.single("image"), postController);

export default postRouter;
