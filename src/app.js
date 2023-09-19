/* eslint-disable no-undef */
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const path = require("path");
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
require("./config/googleStrategy")
const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// const indexPath = path.join(__dirname, 'views', 'index.html');
// app.use(express.static('views'));
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());
const indexPath = path.join(__dirname, 'views', 'index.html');

function isLoggedIn (req, res, next) {
  req.user ? next () : res.sendStatus (401);
}

app.get ('/', (req, res) => {
  res.sendFile(indexPath);
});

app.use(session({
  secret: config.google.sessionSecret,
  resave : false ,
  saveUninitialized: true,
  cookie : {secure: false , maxAge: 1000 * 60 * 60}
}))

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use('jwt', jwtStrategy);

app.get('/favicon.ico', (req, res) => res.status(204));

app.get (
  '/auth/google',
  passport.authenticate ('google', {
    scope: ['email', 'profile'],
  })
);

app.get (
  '/auth/google/callback',
  passport.authenticate ('google', {
    successRedirect: '/auth/protected',
    failureRedirect: '/auth/google/failure',
  })
);

app.get ('/auth/google/failure', (req, res) => {
  res.send ('Something went wrong!');
});

app.get ('/auth/protected', isLoggedIn, (req, res) => {
  let name = req.user.displayName;
  res.send (`Hello ${name}`);
});

app.use ('/auth/logout', (req, res) => {
  req.session.destroy ();
  res.send ('See you again!');
});
// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
