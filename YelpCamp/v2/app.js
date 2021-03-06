const express = require("express"),
     app = express(),
     bodyParser = require("body-parser"),
     mongoose = require("mongoose");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

// SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

let Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Salmon Creek", 
//         image: "https://acadiamagic.com/280x187/md-campground.jpg",
//         description: "This is a creek filled with salmon. A lot of dirty water."
//     },
//     function(err, campground) {
//         if(err) {
//             console.log(err);
//         }
//         else {
//             console.log(campground);
//         }
//     }
// );

app.get('/', function(req,res) {
    res.render("landing");
});

// INDEX - show all campgrounds
app.get('/campgrounds', function(req,res) {
    // Get all campgrounds
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", {campgrounds});
        }
    })
});

// NEW - show form to create new campground
app.get('/campgrounds/new', function(req,res) {
    res.render("new");
});

// CREATE - add new campground to DB
app.post('/campgrounds', function(req,res) {
    // get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {name, image, description};
    Campground.create(newCampground, function(err, newCampground) {
        if (err) {
            console.log(err);
        }
        else {
            // redirect to back to campgrounds page
            //render show template with info about campground
            res.redirect("campgrounds");
        }
    });
});

// SHOW - shows more info about one campground
app.get('/campgrounds/:id', function(req,res) {
    // find the campground with provided ID
    // render show template with that campground
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(3000, function() {
	console.log("YelpCamp server is running on port 3000");
});