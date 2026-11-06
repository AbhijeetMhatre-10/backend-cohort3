const parseProductData = (req, res, next) => {
  if (typeof req.body.price === "string") {
    req.body.price = JSON.parse(req.body.price);
  }

  if (typeof req.body.sizes === "string") {
    req.body.sizes = JSON.parse(req.body.sizes);
  }

  next();
};

export default parseProductData;
