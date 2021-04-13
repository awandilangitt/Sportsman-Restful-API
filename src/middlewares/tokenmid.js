const { SecretsManager } = require("aws-sdk");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRETKEY;
const user = require('../models/users');

module.exports = {
  validateToken: (req, res, next) => {
    const authenticate = req.headers.authorization;

    if (!authenticate)
      return res.status(401).json({ message: "Access Denied" });

    try {
      const verified = jwt.verify(authenticate, secretKey);
      res.locals.users = verified;

      data = verified;
      next();
    } catch (error) {
      console.log(verified);
      res.status(400).json({ message: "Invalid Token" });
    }
  },
};




// exports.getToken = user => {
//   return jwt.sign(user, secretKey, {expiresIn: 3600});
// }


exports.getToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.secretKey,
    { expiresIn: 43200 }
  );
};