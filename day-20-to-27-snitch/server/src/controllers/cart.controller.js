import productModel from "../models/product.model";

const createCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    const { id } = req.user;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const selectedSize = product.sizes.find((s) => s.size === size);

    if (!selectedSize) {
      return res.status(400).json({
        message: "Size is invalid.",
      });
    }

    if (selectedSize.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient Stock.",
      });
    }

    
  } catch (error) {
    console.log("Error in the create cart controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { createCart };
