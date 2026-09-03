const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongodb_uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error in connecting DB", error);
  }
};

module.exports = connectDB;
