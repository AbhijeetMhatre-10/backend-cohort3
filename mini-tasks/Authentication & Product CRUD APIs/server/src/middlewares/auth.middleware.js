import { verifyAccessToken } from "../utils/auth.util.js";

const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    const decode = verifyAccessToken(accessToken);

    if (!decode) {
      return res.status(400).json({
        message: "Invalid Access Token",
      });
    }

    req.user = decode;

    next();
  } catch (error) {
    res.status(400).json({
      message: "Invalid Access Token",
    });
  }
};

export { authenticate };
