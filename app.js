require('dotenv').config();

var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Bars = require('./models/bars'),
    seedDB = require('./seeds'),
    Comments = require('./models/comments'),
    session = require("express-session"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require('express-sanitizer');


var Users = require("./models/users");

//requiring routes
var indexRoutes = require("./routes/index"),
    barRoutes = require("./routes/bar"),
    commentRoutes = require("./routes/comment"),
    blogRoutes = require("./routes/blog"),
    blogCommentRoutes = require("./routes/blog-comment");
    

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine",'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
app.use(expressSanitizer());

// seedDB();
app.use(session({
    secret: "cdtb",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://tbui:disboyfc@cluster0-eehg8.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("connect to DB!");
}).catch(err =>{
    console.log("ERROR", err.message);
});
// mongoose.connect("mongodb://localhost:27017/RooftopFantasy", {useNewUrlParser: true});

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.successFlash = req.flash('success');
    res.locals.errorFlash = req.flash('error');    
    next();
})
app.use('/bars', barRoutes);
app.use('/', indexRoutes);
app.use('/bars/:id/comments', commentRoutes);
app.use('/blogs', blogRoutes);
app.use('/blogs/:id/comments', blogCommentRoutes);

app.listen(process.env.PORT || 5000, function(){
     console.log("RooftopReview running");
})

// app.listen(3000, function() {
//     console.log("RooftopReview running");
// })
