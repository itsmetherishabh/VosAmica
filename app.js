const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
const { matchedData, sanitizeBody } = require('express-validator');
const request = require("request");
const flash=require("connect-flash");
const session = require("express-session");
const passport=require("passport");
const dateFormat = require("dateformat");
const mongoose = require('mongoose');
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const {ensureAuthenticated}=require('./config/auth');
var multer=require('multer');
var path=require('path');


const app = express();

require('./config/passport')(passport);


app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


//Express Session
app.use(session({
    secret : 'itsmetherishabh',
    resave : true,
    saveUninitialized : true
  }));


//Passport
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

const db=require('./config/keys').MongoURI;

mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true})
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

mongoose.set("useCreateIndex",true);

const User=require('./models/User');

var Storage=multer.diskStorage({
    destination:"./public/profilePic",
    filename:function(req,file,cb){
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});

var profilePic=multer({
    storage:Storage
}).single('file');

//-------------------------get requests-------------------------

app.get("/", function(req, res) {
    res.render("index", {
        title:"Hotel Master",
        user:req.user
    });
});

app.get("/rooms", function(req, res) {
    res.render("rooms", {
        title:"Look for Rooms",
        user:req.user
    });
});

app.get("/hotel_details", function(req, res) {
    res.render("hotel_details", {
        title:"Hotel Room Details",
        user:req.user
    });
});

app.get("/blogs", function(req, res) {
    res.render("blogs", {
        title:"Photo Gallery",
        user:req.user
    });
});

app.get("/login", function(req, res) {
    res.render("login", {
        title:"Login",
        user:req.user
    });
});

app.get("/register", function(req, res) {
    res.render("register", {
        title:"Register Yourself",
        user:req.user
    });
});


//-------------------------listen at port 3000-------------------------
app.listen(3000, function() {
    console.log("Server started on port 3000");
});