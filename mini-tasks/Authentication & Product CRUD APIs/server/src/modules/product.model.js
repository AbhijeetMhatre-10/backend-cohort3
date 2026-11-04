import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    sizes: {
      type: [
        {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
        },
      ],
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("products", productSchema);

export default productModel;
