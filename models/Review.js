var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    text: String,
    rating: {
        type: Number,
        max: 5
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        firstName: String,
        lastName: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);