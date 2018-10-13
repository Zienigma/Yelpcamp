var express = require("express"),
    app = express(),
    bodyParser = require("body-parser")
    
var mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

    
app.get("/", function (req, res){
   res.render("landing"); 
});
//INDEX - Show all campgrounds
app.get("/campgrounds", function (req, res){
    //Get all cg from db
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
           res.render("index", {campgrounds: allCampgrounds});
       }
    });
});
//CREATE - Add new campgrounds to Database
app.post("/campgrounds", function(req, res){
   var name =  req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampground = {name: name, image: image, description: desc}
   //Create a new campground and save to data base
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           //redirect back to campgrounds
           res.redirect("/campgrounds");
       }
   });
});
//NEW - Show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
           console.log(err);
       } else {
        res.render("show", {campground: foundCampground});
        //redirect back to campgrounds
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has commenced!!!")
});

