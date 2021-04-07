const session = require("express-session");

const sessionConfig = session({
  secret: "willBeABetterSecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //cookie expires after 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

module.exports = sessionConfig;