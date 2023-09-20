const passport = require('passport');
const config = require('./config');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const { User } = require('../models');
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.secret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({ email: profile.email });
        if (user) {
          user.googleId = profile.id;
          user.profilePicture = profile.photos[0].value;
          user.isEmailVerified = profile.email_verified;
          await user.save();
          return done(null, user);
        } else {
          const user = new User({
            name: profile.displayName,
            email: profile.email,
            googleId: profile.id,
            profilePicture: profile.photos[0].value,
            isEmailVerified: true,
          });
          await user.save();
          request.session.userId = user._id;
          request.session.isAuthenticated = true;
          return done(null, user);
        }
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
