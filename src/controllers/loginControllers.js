const UsersModel = require("../models/users")();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRETKEY;
const querystring = require("querystring");

module.exports = {
  login: async (req, res) => {
    let statusCode = 500;

    try {
      const email = req.body.email;
      const password = req.body.password;
      const users = await UsersModel.findOne({ email: email });
      console.log(users);

      //check if users use google sign in
      if (users.social_media == true) {
        statusCode = 400;
        throw new Error("Please login with google sign in or facebook sign in");
      }
      //Validasi Email
      if (!users) {
        statusCode = 404;
        throw new Error("Cannot Find Users");
      }
      const isPasswordMatch = await bcrypt.compare(password, users.password);

      //Validasi Password untuk google sign in
      if (!isPasswordMatch) {
        statusCode = 400;
        throw new Error("Invalid Password");
      }
      //Buat JWT Token untuk google sign in
      const token = jwt.sign(
        {
          userId: users._id,
          name: users.name,
          gender: users.gender,
          level: users.level,
          role: users.roles,
          social_media: users.social_media,
        },
        secretKey
      );
      //Cek data gender dan intensity
      let status = false;
      if (users.gender == "0" || users.level == "0") {
        status = false;
      } else {
        status = true;
      }

      res.json({
        message: "success login",
        data: {
          token: token,
          status: status,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(statusCode).json({ message: error.message });
    }
  },

  updateGender: async (req, res) => {
    try {
      const { body } = req;
      const userId = res.locals.users.userId;

      //Siapkan data yang akan di update

      await UsersModel.findByIdAndUpdate(userId, body);

      const updatedUser = await UsersModel.findById(userId);
      console.log(updatedUser);

      //Buat JWT Token
      const token = jwt.sign(
        {
          userId: updatedUser._id,
          name: updatedUser.name,
          gender: updatedUser.gender,
          level: updatedUser.level,
          role: updatedUser.roles,
          social_media: updatedUser.social_media,
        },
        secretKey
      );

      res.status(200).json({
        message: "Success Update Gender and Intensity",
        token: token,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },

  googleLogin: async (req, res) => {
    try {
      const googleUser = req.user;
      const email = googleUser.email;

      //Find user in database
      const users = await UsersModel.findOne({ email: email });
      const social_media = users.social_media;

      //Check if users use google sign in
      if (social_media == false) {
        throw new Error("Users not registered with google sign in");
      }
      //Buat JWT Token
      const token = jwt.sign(
        {
          userId: users._id,
          name: users.name,
          gender: users.gender,
          level: users.level,
          role: users.roles,
          social_media: users.social_media,
        },
        secretKey
      );
      //Cek data gender dan intensity
      let status = false;
      if (users.gender == "0" || users.level == "0") {
        status = false;
      } else {
        status = true;
      }
      const query = querystring.stringify({
        token: token,
        status: status,
      });

      res.status(200).redirect("/?" + query);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  facebookLogin: async (req, res) => {
    try {
      const facebookUser = req.user;
      const email = facebookUser.email;

      //Find user in database
      const users = await UsersModel.findOne({ email: email });
      const social_media = users.social_media;

      //Check if users use google sign in
      if (social_media == false) {
        throw new Error("Users not registered with google sign in");
      }
      //Buat JWT Token
      const createToken = jwt.sign(
        {
          userId: users._id,
          name: users.name,
          gender: users.gender,
          level: users.level,
          role: users.roles,
          social_media: users.social_media,
        },
        secretKey,
        { expiresIn: 43200 }
      );
      //Cek data gender dan intensity
      let status = false;
      if (users.gender == "0" || users.level == "0") {
        status = false;
      } else {
        status = true;
      }

      const token = createToken({ id: req.user._id });
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
    } catch (error) {
      res.status(401).json({ message: "User not authenticated" });
    }
  },
};
