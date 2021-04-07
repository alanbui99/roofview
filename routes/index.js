var express = require("express"),
    router = express.Router(),
    User = require('../models/User'),
    Place = require('../models/Rooftop'),
    Blogs = require('../models/Blog'),
    passport = require("passport");

const indexController = require('../controllers/index.controller')

//root route
router.get("/", indexController.getHome)


// //sign up form
// router.get("/register", function(req, res) {
//     res.render("register", {page: 'register'});
// })

// //sign up logic
// router.post("/register", function(req, res) {
//     var newUser = new Users ({username: req.body.username});
//     Users.register(newUser, req.body.password, function(err, user) {
//         if (err) {
//             req.flash('error', err.message);
//             return res.redirect("/register");
//         }
//         passport.authenticate('local')(req, res, function(){
//             req.flash("success", "Welcome To Rooftop Fantasy, " + user.username + "!");
//             res.redirect("/");    
//         });
//     });
// });
// //login form
// router.get('/login', function(req, res) {
//     res.render("login", {page: 'login'});
// })
// //login logic
// router.post("/login", passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true,
//     successFlash: 'Welcome back!'
// }),function(req, res) {  
// })
// //logout route
// router.get("/logout", function(req, res) {
//     req.logout();
//     req.flash('success', 'You Are Logged Out!')
//     res.redirect('/');
// })

module.exports = router;
