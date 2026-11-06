import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    shortUrl: {
      type: String,
      required: true,
    },
    longUrl: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);


const UrlsModel = mongoose.model("urls", urlSchema);

export default UrlsModel;
