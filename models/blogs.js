var mongoose = require('mongoose');
var BlogComments = require("./blog-comments");

// var blogCommentSchema = new mongoose.Schema({
//     text: String,
//     author: {
//         id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//         },
//         username: String
//     }
// });

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now},
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
            ref: "BlogComment"
        }
    ]
});

module.exports = mongoose.model("Blog", blogSchema);