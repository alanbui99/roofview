var Comments = require('../models/comments'),
    Bars = require('../models/bars'),
    Blogs = require('../models/blogs'),
    BlogComments = require('../models/blog-comments');

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please Log In To Do That!');
    res.redirect('/login');
}

middlewareObj.checkBarOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Bars.findById(req.params.id, function(err, foundBar) {
            if (err || !foundBar) {
                console.log(err);
                req.flash('error', 'Rooftop Bar Not Found');
                res.redirect("back");
            } else {
                if (foundBar.author.id.equals(req.user.id)){
                    next();
                } else {
                    req.flash('error', 'Permission Denied!');
                    res.redirect("/bars/" + req.params.id);
                }
            }
        });
    } else {
        req.flash('error', 'Please Log In To Do That!');
        res.redirect("/login");
    }    
}

middlewareObj.checkBarReviewOwnership = function(req, res, next) {
     if (req.isAuthenticated()) {
        Comments.findById(req.params.commentId, function(err, foundComment) {
            if (err) {
                console.log(err);
                req.flash('error', 'Sorry. Something went wrong.');
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user.id)){
                    next();
                } else {
                    res.redirect("back");
                    req.flash('error', 'Permission Denied!');
                }
            }
        });
    } else {
        req.flash('error', 'Please Log In To Do That!');
        res.redirect("/login");
    }
}

middlewareObj.checkBlogOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Blogs.findById(req.params.id, function(err, foundBlog) {
            if (err || !foundBlog) {
                console.log(err);
                req.flash('error', 'Blog Not Found');
                res.redirect("back");
            } else {
                if (foundBlog.author.id.equals(req.user.id)){
                    next();
                } else {
                    req.flash('error', 'Permission Denied!');
                    res.redirect("/blogs/" + req.params.id);
                }
            }
        });
    } else {
        req.flash('error', 'Please Log In To Do That!');
        res.redirect("/login");
    }    
}

middlewareObj.checkBlogCommentOwnership = function(req, res, next) {
     if (req.isAuthenticated()) {
        BlogComments.findById(req.params.commentId, function(err, foundComment) {
            if (err) {
                console.log(err);
                req.flash('error', 'Sorry. Something went wrong.');
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user.id)){
                    next();
                } else {
                    res.redirect("back");
                    req.flash('error', 'Permission Denied!');
                    console.log(req.user.id);
                    console.log(foundComment.author.id);
                }
            }
        });
    } else {
        req.flash('error', 'Please Log In To Do That!');
        res.redirect("/login");
    }
}


module.exports = middlewareObj;