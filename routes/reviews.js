const express = require("express");
const router = express.Router({mergeParams: true});

const Review = require('../models/Review');
const Rooftop = require('../models/Rooftop');

const reviewsController = require("../controllers/reviews.controller");

const {isLoggedIn, checkReviewOwnership, haveNotReviewed, validateReview} = require("../middleware/index");


// const {} = require("../middleware/index");


router.get("/", (req, res, next) => {
    res.redirect(`/rooftops/${req.params.id}#reviewsSection`)
})

//POST review
router.post("/", isLoggedIn, haveNotReviewed, validateReview('new'), reviewsController.postReview)

// PUT review
// middleware.checkBarReviewOwnership,
router.put("/:reviewId", isLoggedIn, checkReviewOwnership, validateReview('edit'), reviewsController.editReview)

//DELETE review
// middleware.checkBarReviewOwnership,
router.delete("/:reviewId", isLoggedIn, checkReviewOwnership, reviewsController.deleteReview)

// router.delete("/:commentId", middleware.checkBarReviewOwnership, function(req, res) {
//     Comments.findByIdAndRemove(req.params.commentId, function(err) {
//         if (err) {
//             console.log(err);
//             return res.redirect("back");
//         }
        
//         Bar.findByIdAndUpdate(req.params.id, {$pull: {comments: req.params.commentId}}).populate("comments").exec(function(err, foundBar) {
//             if (err) {
//                 req.flash("error", err.message);
//                 return res.redirect("back");
//             }
//             foundBar.avgRating = avgRating(foundBar.comments);
//             foundBar.save();
            
//         })
//         req.flash("success", "Review Deleted!")
//         res.redirect('/bars/'+req.params.id)
//     })
// })


// //UPDATE comments
// router.put("/:commentId", middleware.checkBarReviewOwnership, function(req, res) {
//     Comments.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, editedComment) {
//         if (err) {
//             console.log(err);
//         }
        
//         Bar.findById(req.params.id).populate("comments").exec(function(err, foundBar) {
//                     if (err) {
//                         req.flash("error", err.message);
//                         return res.redirect("back");
//                     }
//                     foundBar.avgRating = avgRating(foundBar.comments);
//                     foundBar.save();
//         })
//         res.redirect('/bars/' + req.params.id);
//     })
// })



module.exports = router;

