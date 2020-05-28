var express = require("express"),
    router = express.Router({mergeParams: true}),
    Comments = require('../models/comments'),
    Bars = require('../models/bars');

var middleware = require("../middleware/index");
//POST comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    Bars.findById(req.params.id).populate("comments").exec(function(err, foundBar) {
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
                    
                    // var sum = 0;
                    // foundBar.comments.forEach(function(review) {
                    //     sum += review.rating;
                    // })
                    // var score =  sum / foundBar.comments.length;
                    // console.log(score);
                    
                    foundBar.avgRating = avgRating(foundBar.comments);
                    foundBar.save();
                    req.flash("success","Review Successfully Added!");
                    res.redirect('/bars/'+req.params.id);   
                }
            })
        }
    })
})

//UPDATE comments
router.put("/:commentId", middleware.checkBarReviewOwnership, function(req, res) {
    Comments.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, editedComment) {
        if (err) {
            console.log(err);
        }
        
        Bars.findById(req.params.id).populate("comments").exec(function(err, foundBar) {
                    if (err) {
                        req.flash("error", err.message);
                        return res.redirect("back");
                    }
                    foundBar.avgRating = avgRating(foundBar.comments);
                    foundBar.save();
        })
        res.redirect('/bars/' + req.params.id);
    })
})
//DELETE comments
router.delete("/:commentId", middleware.checkBarReviewOwnership, function(req, res) {
    Comments.findByIdAndRemove(req.params.commentId, function(err) {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        
         Bars.findByIdAndUpdate(req.params.id, {$pull: {comments: req.params.commentId}}).populate("comments").exec(function(err, foundBar) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            foundBar.avgRating = avgRating(foundBar.comments);
            foundBar.save();
            
        })
        req.flash("success", "Review Deleted!")
        res.redirect('/bars/'+req.params.id)
    })
})

function avgRating (reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function(review) {
        sum += review.rating;
    })
    return sum / reviews.length;
}

module.exports = router;

