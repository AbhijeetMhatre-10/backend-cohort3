import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  role: {
    // seller, user
    type: String,
    enum: ["seller", "user"],
    default: "user",
  },
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
