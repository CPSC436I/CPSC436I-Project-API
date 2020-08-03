
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require('passport');

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((id, cb) => {
  console.log('deserializing user');
  User.findOne({ _id: id }, (err, user) => {
    cb(err, user);
  });
});

passport.use(
  new localStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  })
);

passport.use(
  new GoogleStrategy({
    // options for google strategy
    callbackURL: '/auth/google/redirect',
    clientID: process.env.Google_clientID,
    clientSecret: process.env.Google_clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    // check if user already exists in our db
    User.findOne({ googleId: profile.id }).then((currentUser) => {
      if (currentUser) {
        // already have the user registered 
        done(null, currentUser);
      } else {
        // create a new user
        new User({
          username: profile.displayName,
          googleId: profile.id
        }).save().then((newUser) => {
          done(null, newUser);
        });
      }
    })
  })
)
