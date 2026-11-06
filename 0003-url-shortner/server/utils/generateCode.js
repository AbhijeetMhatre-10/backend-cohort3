import crypto from "crypto";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateCode = () => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[crypto.randomInt(chars.length)];
  }

  return code;
};

export default generateCode;
