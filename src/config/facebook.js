require("dotenv").config();
const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/users')();
const bcrypt = require('bcrypt');



passport.use(new FacebookStrategy({

    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "https://sportsmanapp.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email']

},
(accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {

        User.findOne({ 'email': profile.emails[0].value }, (err, user) => {

            if (err)
                return done(err);  
            
            if (user) {
                return done(null, user);
            } else {

                let newUser = new User();

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(process.env.PASSWORD, salt)

                newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.email = profile.emails[0].value;
                newUser.gender = profile.gender;
                newUser.password = hash,
                newUser.social_media = true

                newUser.save((err) => {
                    if (err)
                        throw err;

                    return done(null, newUser);
                });
            }
        });
    })
}));



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
