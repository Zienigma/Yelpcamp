var Campground = require("./models/campgrounds"),
    bodyParser = require("body-parser"),
    express    = require("express"),
    Comment    = require("./models/comment"),
    app        = express(),
    seedDB     = require("./seeds")
    

//seedDB();
    
    
    
var mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



    
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
           res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
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

//=====================================================================
//COMMENTS ROUTES
//=====================================================================

app.get("/campgrounds/:id/comments/new", function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has commenced!!!")
});

