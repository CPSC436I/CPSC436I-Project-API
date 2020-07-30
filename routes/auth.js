const router = require('express').Router();
const passport = require('passport');
const bcrypt = require("bcryptjs");
const User = require('../models/User');

// get current auth user
router.get('/user', (req, res) => {
    console.log(req.user);
    res.send(req.user);
});

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}, (req, res) => {
    console.log("made it here");
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect(`${process.env.Client_URI}`)
});

router.get("/logout", (req, res, next) => {
    req.logOut();
    res.send("Logout successful");
});

// router.post("/login", (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//         if (err) throw err;
//         if (!user) res.send("No User Exists");
//         else {
//             req.logIn(user, (err) => {
//                 if (err) throw err;
//                 res.send("Successfully Authenticated");
//             });
//         }
//     })(req, res, next);
// });


// router.post('/register', (req, res) => {
//     User.findOne({ username: req.body.username }, async (err, doc) => {
//         if (err) throw err;
//         if (doc) res.send("User already exists");
//         if (!doc) {
//             const hashedPassword = await bcrypt.hash(req.body.password, 10);
//             const newUser = new User({
//                 username: req.body.username,
//                 password: hashedPassword
//             });
//             await newUser.save();
//             res.send('User created');
//         }
//     })
// });

module.exports = router;