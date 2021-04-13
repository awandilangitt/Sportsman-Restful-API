//Import Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();
require("./src/config/facebook");
const mongoose = require("mongoose");

//Express
const app = express();
app.use(cors());

//Google Sign In
//const session = require("express-session");
//const MongoStore = require("connect-mongo")(session);
require("./src/config/passport")(passport);
require("./src/config/facebook");

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Import Data
const router = require("./src/routes/index");
const port = process.env.PORT || 4500;
const database = require("./src/config/database");
require("./src/event/event");

//Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passport
app.use(passport.initialize());
app.use(passport.session());

//Router
app.use(router.registerRoutes);
app.use(router.loginRoutes);
app.use(router.trackingRoutes);
app.use(router.updateRoutes);
app.use(router.contentRoutes);
app.use(router.deleteUsers);
app.use(router.contactUsRoutes);
app.use(router.favContentRoutes);
app.use(router.faqRoutes);

app.listen(port, () => console.log("app running on port 4500"));
