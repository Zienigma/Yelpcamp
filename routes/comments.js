var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong"); 
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

//COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            req.flash("error", "Something went wrong"); 
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){               
                    req.flash("error", "Something went wrong"); 
                    console.log(err);
                } else {
                    //add username & id to comment
                    comment.author.id = req.user._id;
                    comment.author.username= req.user.username;
                    //Save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success", "Your thoughts have been recorded, thank you!"); 
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//EDITING ROUTE
router.get("/:comments_id/edit", middleware.checkCommentsOwnership, function(req, res){
    Comment.findById(req.params.comments_id, function(err, foundComment){
        if(err){               
            req.flash("error", "Something went wrong"); 
            res.redirect("back");
        } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
          }
        });
    });

//UPDATE ROUTE
router.put("/:comments_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComments){
        if(err){
            req.flash("error", "Something went wrong"); 
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    
});

//DELETE[DESTROY] ROUTE
router.delete("/:comments_id", middleware.checkCommentsOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comments_id, function(err){
        if(err){               
            req.flash("error", "Something went wrong"); 
            res.redirect("back");
        } else {               
            req.flash("success", "You've deleted your thoughts from this space, but you can create more anywhere."); 
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;