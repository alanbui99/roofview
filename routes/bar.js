var express = require("express"),
    router = express.Router(),
    Bars = require('../models/bars');

var middleware = require("../middleware/index");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: "AIzaSyDMtddoK7HQv34YmC87q0YdbFuNli9eNnM",
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


//INDEX - show all bars
router.get("/", function(req, res){
    if (req.query.search){
        req.query.search = req.query.search.toLowerCase();
        if (req.query.search === 'usa' || req.query.search === 'america' || req.query.search === 'us'){
            req.query.search = 'United States';
        }
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Bars.find({$or: [{'name': regex}, {'city': regex}, {'country': regex}]}, function(err, bars) {
            if (err) {
                console.log(err);
            } else {
        
                var numResults = bars.length;
                console.log(numResults);
                res.render("./bars/index", {bars: bars, page: 'bars', numResults: numResults})
            }
            
        });
    } else if (req.query.sort) {
        var criteria = [
        {type: 'rateAvg', property: 'avgRating', order: -1},
        {type: 'rateCount', property: 'ratingCount', order: -1},
        {type: 'priceLow', property: 'price', order: 1},
        {type: 'priceHigh', property: 'price', order: -1}
        ];
        
        criteria.forEach(function(crit){
            if (req.query.sort === crit.type) {
                Bars.find({}).sort([[crit.property, crit.order]]).exec(function(err, sortedBars) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("./bars/index", {bars: sortedBars, page: 'bars'});
                    }
                })
            }
        })
    }
    
    else {
        // eval(require('locus'));
        Bars.find({}, function(err,bars){
            if (err) {
                console.log(err)
            }
            else {
                res.render("./bars/index", {bars: bars, page: 'bars'});
            }
        })
    }
});

//NEW - show form to create new bar
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("./bars/new");
})


//CREATE - add new bar to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to bars array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.desc;
  var price = req.body.price;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
        console.log(err);
        console.log(data.length);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newBar = {name: name, image: image, desc: desc, price: price, author:author, location: location, lat: lat, lng: lng};
      // var newBar = {name: req.body.name, image: req.body.image, desc: req.body.desc, price: req.body.price, author:author};
    // Create a new bar and save to DB
    Bars.create(newBar, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/bars");
        }
    });
  });
});


//SHOW - show more info about one campground
router.get("/:id", function(req,res) {
    Bars.findById(req.params.id).populate('comments').exec(function(err, foundBar){
        if(err || !foundBar) {
            req.flash('error', 'Rooftop Bar Not Found');
            res.redirect('back');
        }
        else {
            res.render("./bars/show", {bar:foundBar});
        }
    });
})
//EDIT - show form to edit bar info
router.get("/:id/edit", middleware.checkBarOwnership, function(req, res) {
    console.log('here');
    Bars.findById(req.params.id, function(err, foundBar) {
        res.render("./bars/edit", {bar: foundBar});
    });
});
//UPDATE - update bar info
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkBarOwnership, function(req, res){
    geocoder.geocode(req.body.bar.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.bar.lat = data[0].latitude;
    req.body.bar.lng = data[0].longitude;
    req.body.bar.location = data[0].formattedAddress;
    Bars.findByIdAndUpdate(req.params.id, req.body.bar, function(err, editedBar){
        if(err){
            req.flash("error", err.message);
            res.redirect("/bars/" + req.params.id + "edit");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/bars/" +req.params.id);
        }
    });
  });
});

//DELETE - delete bar
router.delete("/:id", middleware.checkBarOwnership, function(req, res) {
    Bars.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        }
        res.redirect("/bars/");
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function sortBy(criterion) {
    var bars = [];
    var criteria = [
        {type: 'rateAvg', property: 'avgRating', order: -1},
        {type: 'rateCount', property: 'ratingCount', order: -1},
        {type: 'priceLow', property: 'price', order: 1},
        {type: 'priceHigh', property: 'price', order: -1}
    ]
    criteria.forEach(function(crit){
        if (criterion === crit.type) {
            Bars.find({}).sort([[crit.property, crit.order]]).exec(function(err, sortedBars) {
                sortedBars.forEach(function(bar){
                    bars.push(bar);
                    
                })
                console.log(bars);
                                   
                // eval(require('locus'));
                // return bars;
            });
        }

    })
    // console.log(bars);

} 

module.exports = router;
