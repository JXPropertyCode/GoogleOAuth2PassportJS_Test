const passport = require("passport");
// can add database like Mongoosefor the database implementation
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // this is for a database of users, but for this tutorial, we would not add a database
      // you can verify that the user is in your database and if they are not, you can create it for them
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return done(err, user);
      //   });

      console.log("profile:", profile);

      // so for now we would just return done() for simplicity
      // done() is a callback
      return done(null, profile);
    }
  )
);

// serialize and deserialize does not contain credentials but rather unique cookie that identifies the session
// to support login sessions, Passport will serialize and deserialize user instances to and from the sessions
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
