var mongoose = require('mongoose');

var barSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    desc: String,
    location: String,
    lat: Number,
    lng: Number,
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
    ]
});

module.exports = mongoose.model("Bar", barSchema);