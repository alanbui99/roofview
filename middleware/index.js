var Comments = require('../models/comments'),
    Bars = require('../models/bars');

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
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash('error', 'Please Log In To Do That!');
        res.redirect("/login");
    }    
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
     if (req.isAuthenticated()) {
        Comments.findById(req.params.commentId, function(err, foundComment) {
            if (err) {
                console.log(err);
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

module.exports = middlewareObj;