import { verifyAccessToken } from "../utils/auth.util.js";

const authenticate = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(400).json({
        message: "Access Token Not Found",
      });
    }

    const decode = verifyAccessToken({ accessToken });
    req.user = decode;
    next();
  } catch (error) {
    console.log("Error in authenticate middleware", error);
    res.status(500).json({
      message: "Internal Server Error.",
    });
  }
};

export { authenticate };
