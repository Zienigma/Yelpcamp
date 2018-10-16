var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

//INDEX - Show all campgrounds
router.get("/", function (req, res){
    //Get all cg from db
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
           res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
       }
    });
});
//CREATE - Add new campgrounds to Database
router.post("/", isLoggedIn, function(req, res){
   var name =  req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCampground = {name: name, image: image, description: desc, author: author}
   //Create a new campground and save to data base
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           //redirect back to campgrounds
           res.redirect("/");
       }
   });
});

//NEW - Show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground w/ provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
           console.log(err);
       } else {
           console.log(foundCampground)
        res.render("campgrounds/show", {campground: foundCampground});
        //redirect back to campgrounds
       }
    });
});

//MIDDLE WARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;