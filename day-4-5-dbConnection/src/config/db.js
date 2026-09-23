const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://leoxdodo10_db_user:rSL6XCwDuUPcTSwc@cluster0.zzaq5wj.mongodb.net/",
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error in connecting DB", error);
  }
};

module.exports = connectDB