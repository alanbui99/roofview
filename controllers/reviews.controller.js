const reviewsService = require("../services/reviews.service");
const AppError = require("../utils/AppError");

exports.postReview = async (req, res, next) => {
  try {
    req.body.review.author = {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName
    }

    await reviewsService.createReview(req.params.id, { ...req.body.review });
    if (req.session.invalidReview) req.session.invalidReview = null
    req.flash("success", 'Your review has been posted!');
    res.redirect(`/rooftops/${req.params.id}/#reviewsSection`);
  } catch (err) {
    next(err);
  }
};

exports.editReview = async (req, res, next) => {
  try {
    await reviewsService.updateReviewById(req.params.id, req.params.reviewId, { ...req.body.review });
    req.flash("success", 'Your review has been updated!');
    res.redirect(`/rooftops/${req.params.id}/#reviewsSection`);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
    try {
        await reviewsService.deleteReviewById(req.params.id, req.params.reviewId)

        req.flash("success", 'Your review has been deleted!');
        res.redirect(`/rooftops/${req.params.id}/#reviewsSection`);
    } catch (err) {
        next(err)
    }
}



//     Bar.findById(req.params.id).populate("comments").exec(function(err, foundBar) {
//         if(err) {
//             console.log(err);
//             req.flash('error', 'Something Went Wrong!');
//             res.redirect('/bars/'+req.params.id);
//         } else {
//             Comments.create(req.body.comment, function(err, comment) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     comment.author.id = req.user.id;
//                     comment.author.username = req.user.username;
//                     comment.save();
//                     foundBar.comments.push(comment);

//                     // var sum = 0;
//                     // foundBar.comments.forEach(function(review) {
//                     //     sum += review.rating;
//                     // })
//                     // var score =  sum / foundBar.comments.length;
//                     // console.log(score);

//                     foundBar.avgRating = avgRating(foundBar.comments);
//                     foundBar.save();
//                     req.flash("success","Review Successfully Added!");
//                     res.redirect('/bars/'+req.params.id);
//                 }
//             })
//         }
//     })
