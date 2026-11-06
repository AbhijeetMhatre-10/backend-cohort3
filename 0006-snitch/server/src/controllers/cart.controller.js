import cartModel from "../models/cart.model";
import productModel from "../models/product.model";
import userModel from "../models/user.model";

const createCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

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

    let cart = await cartModel.findOne({ user: req.user.id });

    if (!cart) {
      cart = await cartModel.create({
        user: req.user.id,
      });
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === productId,
    );

    if (productInCart) {
      if (productInCart.quantity + quantity > selectedSize.stock) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }

      await cartModel.updateOne(
        {
          user: req.user.id,
          "products.product": productId,
          "products.size": size,
        },
        {
          $inc: {
            "products.$.quantity": quantity,
          },
        },
      );

      return res.status(200).json({
        message: "Product quantity updated in cart.",
      });
    }

    await cartModel.findOneAndUpdate(
      {
        user: req.user.id,
      },
      {
        $push: {
          products: {
            product: productId,
            quantity,
            size,
          },
        },
      },
    );
  } catch (error) {
    console.log("Error in the create cart controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getCart = async (req, res) => {
  const cart =
    (await cartModel.findOne({ user: req.user.id })) ??
    (await cartModel.create({ user: req.user.id }));

  return res.status(200).json({
    message: "Cart retrieved successfully.",
    data: {
      cart,
    },
  });
};

export { createCart, getCart };
