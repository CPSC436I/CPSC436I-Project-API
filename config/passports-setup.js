
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require('passport');
const { google } = require("googleapis");
// module.exports = function (passport) {
  
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  
  passport.deserializeUser((id, cb) => {
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
                  console.log('already have this user');
                  done(null, currentUser);
              } else {
                  // create a new user
                  new User({
                      username: profile.displayName,
                      googleId: profile.id
                  }).save().then((newUser) => {
                      console.log('new user created: ' + newUser);
                      done(null, newUser);
                  });
              }
          })
      })
  )
  
  // passport.use(
  //     new FacebookStrategy({
  //         clientID: process.env.Facebook_clientID,
  //         clientSecret: process.env.Facebook_clientSecret,
  //         callbackURL: '/auth/facebook/redirect'
  //     }, (accessToken, refreshToken, profile, cb) => {
  //       User.findOrCreate({ facebookId: profile.id }, function (err, user) {
  //         return done(err, user);
  //       });
  //     })
  // );
  

// };



