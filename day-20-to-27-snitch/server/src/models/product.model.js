import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 2,
    maxLength: 20,
    required: true,
  },
  description: {
    type: String,
    minLength: 20,
    maxLength: 100,
    required: true,
  },
  images: {
    type: [
      {
        type: String,
      },
    ],
    validate: [
      {
        validator: (images) => images.length <= 5,
        message: "A product can have at most 5 images.",
      },
      {
        validator: (images) => images.length > 0,
        message: "A product should have at least 1 image.",
      },
    ],
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },
  },
  sizes: [
    {
      size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true,
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
    },
  ],
  
});

const productModel = mongoose.model("products", productSchema);

export default productModel;
