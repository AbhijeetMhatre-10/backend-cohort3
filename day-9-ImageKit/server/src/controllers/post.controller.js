import PostModel from "../models/post.models.js";
import { sendFiles } from "../services/storage.service.js";

const postController = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!title || !file) {
      return res.status(400).json({
        message: "Fields are required",
        success: false,
      });
    }

const uploadImage = await sendFiles(file.buffer, file.originalname);

    const post = await PostModel.create({
      title,
      image: uploadImage.url,
    });

    res.send(`Got ${post}`)
  } catch (error) {
    console.log("error in controller", error);
  }
};

export default postController;
