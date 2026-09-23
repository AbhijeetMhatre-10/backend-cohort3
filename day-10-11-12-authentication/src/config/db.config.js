import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/test");
    console.log("connected to DB");
  } catch (error) {
    console.log("error in connecting to DB", error);
  }
};

export default connectDB;
