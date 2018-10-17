var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req, res){
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
           res.redirect("/campgrounds");
       }
   });
});

//NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
                   res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//UPDATE ROUTE
router.put("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    //find and update campgrounds
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//DELETE[DESTROY] ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;