import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

const createProduct = async (req, res) => {
  try {
    const { title, description, price, sizes } = req.body;

    // image kit logic to get urls of all images
    const arr = req.files;
    const images = [];
    for (let i = 0; i < arr.length; i++) {
      const response = await uploadFile({
        buffer: arr[i].buffer,
        fileName: Date.now() + " " + arr[i].originalname,
      });
      images.push(response.url);
    }

    const product = await productModel.create({
      title,
      description,
      images,
      sizes,
      price,
    });

    res.status(201).json({
      message: "Product Created Successfully.",
      data: {
        title: product.title,
        description: product.description,
        images: product.images,
        sizes: product.sizes,
        price: product.price,
      },
    });
  } catch (error) {
    console.log("Error in create product controller", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const response = await productModel.find();

    res.status(200).json({
      message: "Data fetched successfully",
      data: response,
    });
  } catch (error) {
    console.log(
      "Error in fetching all products in getAllProducts controller",
      error,
    );
    res.status(500).json({
      message: "Error in fetching products.",
    });
  }
};

export { createProduct, getAllProducts };
