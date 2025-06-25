const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

function initPassport() {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Try to find user by Google providerId
      let user = await User.findOne({ provider: 'google', providerId: profile.id });
      if (!user) {
        // If not found, try to find by email (could be a local account)
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          // Link Google account to existing user
          user.provider = 'google';
          user.providerId = profile.id;
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            email: profile.emails[0].value,
            provider: 'google',
            providerId: profile.id,
          });
        }
      }
      return done(null, user);
    } catch (err) {
      console.error('Google OAuth error:', err);
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = initPassport;
