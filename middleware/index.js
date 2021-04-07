const UrlPattern = require("url-pattern");

const { getRooftopById } = require("../services/rooftops.service");
const { getReviewById, getReviewByUserId } = require("../services/reviews.service");

const schemas = require("../utils/schemas");

exports.validateRooftop = (purpose) => {
    return (req, res, next) => {
        const { error } = schemas.rooftopPOST.validate(req.body);

        if (error) {
            const { details } = error;
            const message = details.map((d) => d.message).join(",");

            res.status(422).render("./rooftops/form", {
                purpose,
                prevInput: { ...req.body, ...req.params },
                errMsg: message,
            });
            // throw new AppError(message, 400);
        } else {
            next();
        }
    };
};

exports.validateReview = (purpose) => {
    return async (req, res, next) => {
        const { error } = schemas.reviewPOST.validate(req.body.review);
        if (error) {
            const { details } = error;
            const message = details.map((d) => d.message).join(",");
            const rooftop = await getRooftopById(req.params.id);

            req.flash("error", message);

            req.session.invalidReview = {
                ...req.body.review,
                error: message,
            };

            res.redirect(`/rooftops/${req.params.id}/#reviewsSection`);
        } else {
            next();
        }
    };
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    req.session.returnTo = req.originalUrl;

    const urlPatterns = [
        {
            pattern: new UrlPattern("/rooftops(/:id)/reviews"),
            sessionProp: "invalidReview",
            bodyProp: "review",
        },
    ];

    for (const urlPattern of urlPatterns) {
        if (urlPattern.pattern.match(req.originalUrl)) {
            req.session[urlPattern.sessionProp] = {
                ...req.body[urlPattern.bodyProp],
            };
            break;
        }
    }

    req.flash("error", "Please log in to do that.");
    res.redirect("/login");
};

exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    } else {
        req.flash("error", "Sorry, you are not granted access.")
        return res.status(403).redirect('back')
    }
}

exports.haveNotReviewed = async (req, res, next) => {
    try {
        const review = await getReviewByUserId(req.user._id, req.params.id);
        if (!review) {
            return next()
        }
        req.flash("error", "You have already reviewed this rooftop.")
        return res.status(403).redirect('back')

    } catch(err) {
        console.log(err)
        req.flash("error", "Something went wrong while processing your request")
        return res.status(403).redirect('back')
    }


}

exports.checkReviewOwnership = async (req, res, next) => {
    try {
        if (req.user.isAdmin) return next()

        const review = await getReviewById(req.params.reviewId)
        if (review.author.id.equals(req.user.id)){
            return next()
        }
        req.flash("error", "Sorry, you are not granted access.")
        return res.status(403).redirect('back')

    } catch (err) {
        console.log(err)
        req.flash("error", "Something went wrong while processing your request")
        return res.status(500).redirect('back')
    }
        // Bar.findById(req.params.id, function(err, foundBar) {
        //     if (err || !foundBar) {
        //         console.log(err);
        //         req.flash('error', 'Rooftop Bar Not Found');
        //         res.redirect("back");
        //     } else {
        //         if (foundBar.author.id.equals(req.user.id)){
        //             next();
        //         } else {
        //             req.flash('error', 'Permission Denied!');
        //             res.redirect("/bars/" + req.params.id);
        //         }
        //     }
        // });
}

// exports.checkBarReviewOwnership = function(req, res, next) {
//      if (req.isAuthenticated()) {
//         Comments.findById(req.params.commentId, function(err, foundComment) {
//             if (err) {
//                 console.log(err);
//                 req.flash('error', 'Sorry. Something went wrong.');
//                 res.redirect("back");
//             } else {
//                 if (foundComment.author.id.equals(req.user.id)){
//                     next();
//                 } else {
//                     res.redirect("back");
//                     req.flash('error', 'Permission Denied!');
//                 }
//             }
//         });
//     } else {
//         req.flash('error', 'Please Log In To Do That!');
//         res.redirect("/login");
//     }
// }

// exports.checkBlogOwnership = function(req, res, next) {
//     if (req.isAuthenticated()) {
//         Blogs.findById(req.params.id, function(err, foundBlog) {
//             if (err || !foundBlog) {
//                 console.log(err);
//                 req.flash('error', 'Blog Not Found');
//                 res.redirect("back");
//             } else {
//                 if (foundBlog.author.id.equals(req.user.id)){
//                     next();
//                 } else {
//                     req.flash('error', 'Permission Denied!');
//                     res.redirect("/blogs/" + req.params.id);
//                 }
//             }
//         });
//     } else {
//         req.flash('error', 'Please Log In To Do That!');
//         res.redirect("/login");
//     }
// }

// exports.checkBlogCommentOwnership = function(req, res, next) {
//      if (req.isAuthenticated()) {
//         BlogComments.findById(req.params.commentId, function(err, foundComment) {
//             if (err) {
//                 console.log(err);
//                 req.flash('error', 'Sorry. Something went wrong.');
//                 res.redirect("back");
//             } else {
//                 if (foundComment.author.id.equals(req.user.id)){
//                     next();
//                 } else {
//                     res.redirect("back");
//                     req.flash('error', 'Permission Denied!');
//                     console.log(req.user.id);
//                     console.log(foundComment.author.id);
//                 }
//             }
//         });
//     } else {
//         req.flash('error', 'Please Log In To Do That!');
//         res.redirect("/login");
//     }
// }
