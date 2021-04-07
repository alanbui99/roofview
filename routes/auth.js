const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User");

const authController = require("../controllers/auth.controller");

//sign up form
router.get("/signup", authController.getSignup);

//sign up logic
router.post("/register", authController.postSignup);

//login form
router.get("/login", authController.getLogin);
//login logic
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: 'Invalid email or password',
    }),
    (req, res, next) => {
        req.flash('success', `Welcome back to Roofview, ${req.user.firstName}!`);
        res.redirect(req.session.returnTo || '/')
    }
);
//logout route
router.get("/logout", function (req, res) {
    const byeTo = req.user.firstName
    req.logout();
    req.flash("success", `Good bye, ${byeTo}!`);
    res.redirect("/");
});

module.exports = router;
