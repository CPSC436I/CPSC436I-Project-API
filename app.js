require('dotenv').config();
var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
const session = require('express-session');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();

var favouritesRouter = require('./routes/favourites');
var videosRouter = require('./routes/videos');
var authRoutes = require('./routes/auth');
var placesRouter = require('./routes/places');

const passport = require('passport');

app.use(cookieSession({
  maxAge: 24*60*60*100,
  keys: ['secret-key'],
  resave: false,
  saveUninitialized: false,
  sameSite: false,
  secure: true,
}));

app.use(passport.initialize());
app.use(passport.session());


require('./config/passports-setup');

// Connect to mongodb
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(err => console.log(err));

// Middleware
app.use(cors({
  origin: process.env.Client_URI,
  credentials: true,
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// routes
app.use('/favourites', favouritesRouter);
app.use('/findVideos', videosRouter);
app.use('/findPlaces', placesRouter);
app.use('/auth', authRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
