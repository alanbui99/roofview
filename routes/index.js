var express = require("express"),
    router = express.Router(),
    Users = require('../models/users'),
    Bars = require('../models/bars'),
    Blogs = require('../models/blogs'),
    passport = require("passport");

//root route
router.get("/", function(req, res){
    Bars.find({}, function(err,bars){
        if (err) {
            console.log(err);
        } else {
            Blogs.find({}, function(err, blogs) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("home", {bars: bars, blogs: blogs});        
                }
            })            
        }
    })  
});

//sign up form
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
})
//sign up logic
router.post("/register", function(req, res) {
    var newUser = new Users ({username: req.body.username});
    Users.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect("/register");
        }
        passport.authenticate('local')(req, res, function(){
            req.flash("success", "Welcome To Rooftop Fantasy, " + user.username + "!");
            res.redirect("/");    
        });
    });
});
//login form
router.get('/login', function(req, res) {
    res.render("login", {page: 'login'});
})
//login logic
router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome back!'
}),function(req, res) {  
})
//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash('success', 'You Are Logged Out!')
    res.redirect('/');
})

module.exports = router;
