const jwt = require("jsonwebtoken");
const User = require("../models/users")();
const secretKey = process.env.SECRETKEY;
const querystring = require("querystring");

createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      level: user.level,
      social_media: user.social_media,
    },
    secretKey,
    { expiresIn: 43200 }
  ); // for 12 hours
};

exports.facebookAuth = async (req, res) => {
  const { id, name, email } = req.user;
  let message = "";
  try {
    const users = await User.findOne({ email });
    if (users.social_media == false) {
      return res.send(400, "Please sign in with facebook");
    }

    if (!req.user) {
      return res.send(401, "User not authenticated");
    }

    //Cek data gender dan intensity
    let status = false;
    if (users.gender == "0" || users.level == "0") {
      status = false;
    } else {
      status = true;
    }

    // CREATE TOKEN
    const token = jwt.sign(
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

    const query = querystring.stringify({ token: token, status: status });

    res.setHeader("Content-Type", "application/json");
    res.status(200).redirect("/?" + query);
  } catch (err) {
    res.status(500).send(err);
  }
};

// // NOT DISPLAY TOKEN
// exports.facebookAuth = async (req, res) => {
//     const { id, name, email } = req.user;
//     let message = "";
//     try {
//         const users = await User.findOne({email});
//         if (users.social_media == false) {
//             return res.send(400, "Please sign in with facebook")
//         }

//         if (!req.user) {
//             return res.send(401, 'User not authenticated');
//         }

//         // CREATE TOKEN
//         const token = createToken(id);
//         res.setHeader("Content-Type", "application/json");
//         res.status(200).json({
//             status: "success",
//             token: token,
//             message: `Welcome to Sportsman, ${name}`,
//         });

//     } catch (err) {
//         res.status(500).send(err);
//     }
// }
