const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    res.send("Hello");
  } catch (error) {
    console.log("Error in create product controller", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { createProduct };
