var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    Campground              = require("./models/campgrounds"),
    Comment                 = require("./models/comment"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    methodOverride          = require("method-override"),
    seedDB                  = require("./seeds")

//REQUIRING ROUTES
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")
    
mongoose.set("useNewUrlParser", true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//SEED DATABASE COMMENTED OUT
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Never say anything",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
    
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has commenced!!!")
});

