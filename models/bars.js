var mongoose = require('mongoose');

var barSchema = new mongoose.Schema({
    name: String,
    avgRating: Number,
    price: String,
    image: String,
    desc: String,
    location: String,
    lat: Number,
    lng: Number,
    city: String,
    country: String,
    author: {
        id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    ratingCount: Number
});

module.exports = mongoose.model("Bar", barSchema);