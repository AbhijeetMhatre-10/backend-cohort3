import mongoose from "mongoose";
import config from "./config.js";

const connectToDB = async (req, res) => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to DB.")
  } catch (error) {
    console.log("Error in connecting to DB.", error);
    res.status(500).json({
      message: "Error in connecting to DB.",
    });
  }
};

export default connectToDB;
