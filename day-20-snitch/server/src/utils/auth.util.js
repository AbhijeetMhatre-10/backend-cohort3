import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateTokens = ({ userId, role }) => {
  const refreshToken = jwt.sign({ id: userId, role }, config.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });

  const accessToken = jwt.sign({ id: userId, role }, config.ACCESS_SECRET_KEY, {
    expiresIn: "15min",
  });

  return {
    refreshToken,
    accessToken,
  };
};

export { generateTokens };
