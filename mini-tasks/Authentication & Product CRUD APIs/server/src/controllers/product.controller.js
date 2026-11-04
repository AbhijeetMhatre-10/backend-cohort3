import productModel from "../modules/product.model.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, sizes, price, stock } = req.body;

    const productExists = await productModel.findOne({ name });

    if (productExists) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }

    const product = await productModel.create({
      name,
      description,
      sizes,
      price,
      stock,
    });

    if (!product) {
      return res.status(400).json({ message: "Product creation failed" });
    }

    return res.status(201).json({
      message: "Product created successfully",
      product: {
        name: product.name,
        description: product.description,
        sizes: product.sizes,
        price: product.price,
        stock: product.stock,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();

    res.status(200).json({
        message: "Products fetched successfully",
        data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, sizes, price, stock } = req.body;

    const product = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        sizes,
        price,
        stock,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { createProduct, getAllProducts, editProduct };