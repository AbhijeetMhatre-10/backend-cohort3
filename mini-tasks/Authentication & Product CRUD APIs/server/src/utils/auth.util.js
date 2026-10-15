import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateTokens = ({ id }) => {
  const refreshToken = jwt.sign({ id }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign({ id }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "15min",
  });

  return {
    refreshToken,
    accessToken,
  };
};

const verifyRefreshToken = (accessToken) => {
  const decode = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
  return decode;
};

const verifyAccessToken = (accessToken) => {
  const decode = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
  return decode;
};

export { generateTokens, verifyAccessToken, verifyRefreshToken };
