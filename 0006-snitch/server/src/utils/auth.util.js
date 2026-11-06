import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateTokens = ({ userId, role }) => {
  const refreshToken = jwt.sign(
    { id: userId, role },
    config.REFRESH_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  const accessToken = jwt.sign({ id: userId, role }, config.ACCESS_SECRET_KEY, {
    expiresIn: "15m",
  });

  return {
    refreshToken,
    accessToken,
  };
};

const verifyRefreshToken = ({ refreshToken }) => {
  return jwt.verify(refreshToken, config.REFRESH_SECRET_KEY);
};

const verifyAccessToken = ({ accessToken }) => {
  return jwt.verify(accessToken, config.ACCESS_SECRET_KEY);
};

export { generateTokens, verifyRefreshToken, verifyAccessToken };
