var express = require("express"),
    router = express.Router(),
    Blogs = require('../models/Blog');

var middleware = require("../middleware/index");


// Blogs.create({
//     title: "Just for Test",
//     image: "https://www.usnews.com/dims4/USNEWS/1286c3b/2147483647/resize/1200x%3E/quality/85/?url=https%3A%2F%2Fmedia.beam.usnews.com%2F5f%2F32%2Fb2acbafa487ba8293ea445b487c7%2F30-baba-best-sri-pawna-phuket.jpg",
//     body: "Phuket"
// })

//INDEX - show all blogs
router.get('/', function(req, res){
    Blogs.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } 
        else {
            res.render("./blogs/index", {blogs: blogs});
        }
    })
})

//NEW - show form to create new blog
router.get('/new', function(req, res) {
    res.render("./blogs/new");
})

//CREATE - add new blog to DB
router.post("/", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    req.body.blog.author = {
    id: req.user._id,
    username: req.user.username
  }
    Blogs.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("./blogs/new");
        } else {
            res.redirect("/blogs");
        }
    })
})

//SHOW - show more info about one blog
router.get('/:id', function(req, res) {
    Blogs.findById(req.params.id).populate('comments').exec(function(err, foundBlog) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("./blogs/show", {blog: foundBlog});
        }
    })
})

router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res) {
    Blogs.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs/" + req.param.id);
        } else {
            res.render("./blogs/edit", {blog: foundBlog});
        }
    })
})

router.put("/:id", middleware.checkBlogOwnership, function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blogs.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})


router.delete("/:id", middleware.checkBlogOwnership, function(req, res) {
    Blogs.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
        }
        res.redirect("/blogs");
    })
})


module.exports = router;
