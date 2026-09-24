import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to DB.");
  } catch (error) {
    console.log("Error in connecting to DB.", error);
  }
};

export default connectDB;
