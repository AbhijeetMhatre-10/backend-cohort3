import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateTokens = ({ userId }) => {
  const refreshToken = jwt.sign({ id: userId }, config.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign({ id: userId }, config.ACCESS_SECRET_KEY, {
    expiresIn: "15min",
  });

  return {
    refreshToken,
    accessToken,
  };
};

const verifyAccessToken = ({ accessToken }) => {
  const decode = jwt.verify(accessToken, config.ACCESS_SECRET_KEY);
  return decode;
};

const verifyRefreshToken = ({ refreshToken }) => {
  const decode = jwt.verify(refreshToken, config.REFRESH_SECRET_KEY);
  return decode;
};

export { generateTokens, verifyAccessToken, verifyRefreshToken };
