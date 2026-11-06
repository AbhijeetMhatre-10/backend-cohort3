import mongoose from "mongoose";
import config from "./config.js";

const connectToDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to Mongo DB");
  } catch (error) {
    console.log("ERROR in connecting to DB", error);
  }
};

export default connectToDB;
