require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");

// we just want to initialize it without making a variable since we won't use it
// its simply to initialize auth.js
require("./auth");

// middleware function to detect if the user is logged in
function isLoggedIn(req, res, next) {
  // 401 is unauthorized
  // we want the user to become apart of the request so we need a session management, express-session
  req.user ? next() : res.sendStatus(401);
}

const app = express();

// middleware using session management
app.use(
  session({
    secret: process.env.SECRET,
    // don't resave if nothing has changed
    resave: false,
    // don't create a session if something isn't stored
    saveUninitialized: false,
    // you can add a store to store into MongoDB database
    // reference to https://www.youtube.com/watch?v=SBvmnHTQIPY&ab_channel=TraversyMedia at 1:08:39
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google </a>');
});

// to define what happens when the user hits the endpoint of '/auth/google'
app.get(
  "/auth/google",
  // this is for authenticating for that specific provider based on their selection
  // scope is what information do we want to retrieve from the user profile
  // it is using our 'google' passport strategy to pass in details at auth.js
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  // make sure the user is authentic when accessing this route
  // authenticates using 'google' strategy
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send('<div><p>Something Went Wrong... </p><a href="/">Login</a></div>');
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(
    `<div><p>Hello ${req.user.displayName}! This is a protected route.</p><a href="/logout">Logout</a></div>`
  );
});

app.get("/logout", (req, res) => {
  req.logout();
  // destroys our current session aka remove cookie session
  req.session.destroy();
  res.send(
    '<div><p>Goodbye! Logged Out Successfully</p><a href="/">Login</a></div>'
  );
});

app.listen(8000, () => console.log("Listening on PORT: 8000"));
