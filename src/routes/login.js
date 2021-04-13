const router = require("express").Router();
const loginControllers = require("../controllers/loginControllers");
const loginMiddleware = require("../middlewares/loginmid");
const validateMid = require("../middlewares/tokenmid");
const passport = require("passport");
const auth = require("../middlewares/fbAuth");
const UsersModel = require("../models/users")();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRETKEY;
const querystring = require("querystring");

router.post("/login", loginMiddleware.loginmid, loginControllers.login);
router.put(
  "/login/update",
  validateMid.validateToken,
  loginControllers.updateGender
);

//Google sign in
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
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
  }
);

router.get("/googlelogin", loginControllers.googleLogin);

// FACEBOOK LOGIN
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  auth.facebookAuth
);

module.exports = router;
