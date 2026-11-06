import jwt from 'jsonwebtoken'
import UserModel from "../models/user.model.js";

const authentication = async (req, res, next) => {
  const token = req.headers.authorization;

  if(!token){
    return res.status(401).json({
      message: "Token not found"
    })
  }

  const data = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(data?.id);

  req.user = user;

  next()
};

export default authentication;
