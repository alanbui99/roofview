require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const morgan = require("morgan")

// configs
const sessionConfig = require("./configs/session.config")

// utils
const handleError = require('./utils/error');
const AppError = require('./utils/AppError')

// models
const User = require("./models/User");

// routes
const indexRoutes = require("./routes/index");
const rooftopRoutes = require("./routes/rooftops");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");
// const blogRoutes = require("./routes/blog");
// const blogCommentRoutes = require("./routes/blog-comment");

const {getMissingInfo} = require('./utils/seed')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());

//morgan logger
app.use(morgan('tiny'));

//session
app.use(sessionConfig);

// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.set("useUnifiedTopology", true);
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("connected to DB!");
    })
    .catch((err) => {
        console.log("ERROR", err.message);
    });

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.successFlash = req.flash("success");
    res.locals.errorFlash = req.flash("error");
    next();
});

app.use("/rooftops", rooftopRoutes);
app.use("/rooftops/:id/reviews", reviewRoutes);
app.use("/", authRoutes)
app.use("/", indexRoutes);

// app.use("/blogs", blogRoutes);
// app.use("/blogs/:id/comments", blogCommentRoutes);

// app.all((req, res, next) => {
//   next(new AppError('Page Not Found', 404));
// });

app.use((req, res, next) => {
    next(new AppError('Page Not Found', 404));
})
app.use((err, req, res, next) => {
    handleError(err, res)
})

app.listen(process.env.PORT || 5000, () => {
    console.log("Roofview running");
});