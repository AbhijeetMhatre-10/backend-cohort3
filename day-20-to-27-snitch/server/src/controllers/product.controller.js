const createProduct = async (req, res) => {
  try {
    res.send(req.body);
  } catch (error) {
    console.log("Error in create product controller", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { createProduct };
