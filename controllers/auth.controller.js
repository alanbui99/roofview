const passport = require("passport");

const usersService = require("../services/users.service");

const AppError = require("../utils/AppError");

exports.getSignup = (req, res, next) => {
    res.render("signup", {
        page: "signup",
        invalidSignup: req.session.invalidSignup || null,
    });
};

exports.postSignup = async (req, res, next) => {
    try {
        const newUser = await usersService.createUser({ ...req.body });
        if (req.session.invalidSignup) req.session.invalidSignup = null;
        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash(
                "success",
                "Welcome To Roofview, " + newUser.firstName + "!"
            );
            res.redirect("/");
        });
    } catch (err) {
        if (err.message.includes("username"))
            err.message = err.message.replace(/username/g, "email");
        req.session.invalidSignup = { ...req.body, error: err.message };
        res.redirect("signup");
    }
    // const {email, username, passport}
    // const newUser = new Users({ username: req.body.username });
    // Users.register(newUser, req.body.password, function(err, user) {
    //     if (err) {
    //         req.flash('error', err.message);
    //         return res.redirect("/register");
    //     }
    //     passport.authenticate('local')(req, res, function() {
    //         req.flash("success", "Welcome To Roofview, " + user.username + "!");
    //         res.redirect("/");
    //     });
    // });
};

exports.getLogin = (req, res, next) => {
    res.render("login", { page: "login" });
};

exports.postLogin = (req, res, next) => {};
