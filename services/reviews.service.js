const Review = require("../models/Review");
const Rooftop = require("../models/Rooftop");

const rooftopsService = require("../services/rooftops.service");

exports.getReviewById = async id => {
    try {
        const review = await Review.findById(id);
        return review
    } catch (err) {
        throw(err)
    }
}

exports.getReviewByUserId = async (userId, rooftopId) => {
    try {
        let usersReview;
        const rooftop = await rooftopsService.getRooftopById(rooftopId);

        for await (const review of rooftop.reviews) {
            if (review.author.id && review.author.id.toString() === userId.toString()) {
                usersReview = review;
                break;
            }
        }
        return usersReview;
        
    } catch (err) {
        throw(err)
    }
    
}

exports.createReview = async (rooftopId, payload) => {
    try {
        const review = await Review.create({ ...payload });

        // associate review with rooftop
        const rooftop = await rooftopsService.getRooftopById(rooftopId);
        rooftop.reviews.push(review);

        //update rooftop average rating
        rooftop.avgRating = updateAvgRating(rooftop.reviews);
        await rooftop.save();
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.updateReviewById = async (rooftopId, reviewId, payload) => {
    try {
        await Review.findByIdAndUpdate(reviewId, { ...payload });

        //update rooftop average rating
        const rooftop = await rooftopsService.getRooftopById(rooftopId);
        rooftop.avgRating = updateAvgRating(rooftop.reviews);
        await rooftop.save();
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.deleteReviewById = async (rooftopId, reviewId) => {
    try {
        await Review.findByIdAndDelete(reviewId);
        const rooftop = await Rooftop.findByIdAndUpdate(
            rooftopId,
            { $pull: { reviews: reviewId } },
            { new: true }
        ).populate("reviews");
        rooftop.avgRating = updateAvgRating(rooftop.reviews);
        await rooftop.save();
    } catch (err) {
        throw new Error(err.message);
    }
};

const updateAvgRating = (reviews) => {
    if (reviews.length === 0) {
        return 0;
    }

    let sum = 0;
    reviews.forEach((review) => {
        sum += review.rating;
    });
    return sum / reviews.length;
};
