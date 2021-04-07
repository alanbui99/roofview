var express = require("express"),
    router = express.Router({mergeParams: true}),
    BlogComments = require('../models/blog-comments'),
    Blogs = require('../models/Blog');

var middleware = require("../middleware/index");
//POST comment
router.post('/', middleware.isLoggedIn, function(req, res) {
    Blogs.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log(err);
            req.flash('error', 'Something Went Wrong!');
            res.redirect('/blogs/'+req.params.id);            
        } else {
            BlogComments.create(req.body.comment, function(err, blogcomment) {
                if (err) {
                    console.log(err);
                } else {
                    blogcomment.author.id = req.user.id;
                    blogcomment.author.username = req.user.username;
                    blogcomment.save();
                    foundBlog.comments.push(blogcomment);
                    foundBlog.save();
                    req.flash("success","Comment Successfully Added!");
                    res.redirect('/blogs/'+req.params.id);   
                }
            })
        }
    })
})

//UPDATE comments
router.put("/:commentId", middleware.checkBlogCommentOwnership, function(req, res) {
    BlogComments.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, editedComment) {
        if (err) {
            console.log(err);
        } 
        res.redirect('/blogs/' + req.params.id);
    })
})
//DELETE comments
router.delete("/:commentId", middleware.checkBlogCommentOwnership, function(req, res) {
    BlogComments.findByIdAndRemove(req.params.commentId, function(err) {
        if (err) {
            console.log(err);
        }
        req.flash("success", "Comment Deleted!")
        res.redirect('/blogs/'+req.params.id)
    })
})

module.exports = router;

