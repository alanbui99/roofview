var express = require("express"),
    router = express.Router({mergeParams: true}),
    Comments = require('../models/comments'),
    Bars = require('../models/bars');

var middleware = require("../middleware/index");
//POST comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    Bars.findById(req.params.id, function(err, foundBar) {
        if(err) {
            console.log(err);
            req.flash('error', 'Something Went Wrong!');
            res.redirect('/bars/'+req.params.id);            
        } else {
            Comments.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundBar.comments.push(comment);
                    foundBar.save();
                    req.flash("success","Review Successfully Added!");
                    res.redirect('/bars/'+req.params.id);   
                }
            })
        }
    })
})

//UPDATE comments
router.put("/:commentId", middleware.checkCommentOwnership, function(req, res) {
    Comments.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, editedComment) {
        if (err) {
            console.log(err);
        } 
        res.redirect('/bars/' + req.params.id);
    })
})
//DELETE comments
router.delete("/:commentId", middleware.checkCommentOwnership, function(req, res) {
    Comments.findByIdAndRemove(req.params.commentId, function(err) {
        if (err) {
            console.log(err);
        }
        req.flash("success", "Review Deleted!")
        res.redirect('/bars/'+req.params.id)
    })
})

module.exports = router;

