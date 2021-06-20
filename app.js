const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
const { matchedData, sanitizeBody } = require('express-validator');
const request = require("request");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const dateFormat = require("dateformat");
const mongoose = require('mongoose');
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const { ensureAuthenticated } = require('./config/auth');
var multer = require('multer');
var path = require('path');


const app = express();

require('./config/passport')(passport);


app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


//Express Session
app.use(session({
    secret: 'itsmetherishabh',
    resave: true,
    saveUninitialized: true
}));


//Passport
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

const db = require('./config/keys').MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

mongoose.set("useCreateIndex", true);

const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Booking = require('./models/booking');

var Storage = multer.diskStorage({
    destination: "./public/profilePic",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

var profilePic = multer({
    storage: Storage
}).single('file');

var city="Delhi";
var details;
var dateList = [];
//-------------------------get requests-------------------------

app.get("/", function(req, res) {
    res.render("index", {
        title: "Hotel Master",
        user: req.user
    });
});

app.get("/rooms", function(req, res) {
    Hotel.find({locations:city}, function(err,hotels){
        if(err)
        {
            res.redirect("/");
        }
        else
        {
            res.render("rooms", {
                title: "Look for Rooms",
                user: req.user,
                hotel:hotels,
                city:city
            });;
        }
    });
});

app.get("/about-us", function(req, res) {
    res.render("aboutus", {
        title: "About Us",
        user: req.user
    });
});

app.get("/hotel_details", function(req, res) {
    res.render("hotel_details", {
        title: "Hotel Room Details",
        user: req.user,
        details:details[0]
    });

});

app.get("/blogs", function(req, res) {
    res.render("blogs", {
        title: "Photo Gallery",
        user: req.user
    });
});

app.get("/dashboard", ensureAuthenticated, function(req, res) {
    res.render("dashboard", {
        title: req.user.name,
        user: req.user
    });
});

app.get("/login", function(req, res) {
    if (!req.user)
        res.render("login", {
            title: "Login",
            user: req.user
        });
    else
        res.redirect("/dashboard");
});

app.get("/register", function(req, res) {
    res.render("register", {
        title: "Register Yourself",
        user: req.user
    });
});

app.get("/logout", function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect("/login");
});

app.get("/hotel", function(req, res) {
    res.render("hotel",{
        title:"Register your Hotel",
        user: req.user
    });
});

app.get("/book_now", ensureAuthenticated, function(req, res) {
    res.render("book_now",{
        title:"Book this Room",
        user: req.user,
        details:details[0]
    });
});




//-------------------------post requests-------------------------

app.post("/register", [
    check('email', "Invalid email").trim().isEmail(),
    check('email').custom((value, { req }) => {
        return User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                return Promise.reject('This E-mail already in use!');
            }
        });
    }),
    check('name', "Invalid Name").trim().isString(),
    check('phone', "Invalid contact number").trim().isLength({ min: 10 }),
    check('phone', "Invalid contact number").trim().isLength({ max: 10 }),
    check('password', "Password must be of at least 8 characters ").trim().isLength({ min: 8 }),
    check('cpassword').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error("Confirm password does not match");
        }
        return true;
    })
], async function(req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    //user exists
                    console.log({ msg: "User with this email already exists!" });
                    res.render("signup", {
                        error: errors,
                        user: user
                    });
                } else {
                    var today = new Date();
                    var day = dateFormat(today, "dddd, mmmm dS, yyyy, h:MM:ss TT");
                    const user1 = new User({
                        name: req.body.name,
                        email: req.body.email,
                        //   emailToken: crypto.randomBytes(64).toString('hex'),
                        password: req.body.password,
                        phone: req.body.phone,
                        time: day
                    });
                    //hashing the password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(user1.password, salt, (err, hash) => {
                            if (err) throw err;
                            //set password to hash
                            user1.password = hash;
                            //save farmer
                            user1.save()
                                .then(userl => {
                                    req.flash('success_msg', 'You are now registered, you can log in from here.');
                                    res.redirect("/login");
                                })
                                .catch(err => console.log(err));
                        }));
                }
            });
    } else {
        const user = matchedData(req);
        res.render("register", {
            error: errors.mapped(),
            title: "Register Yourself",
            user: user
        });
    }
});

app.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

app.post('/hotel', function(req, res) {
    const hotel = new Hotel({
        description: req.body.description,
        name: req.body.name,
        locations: req.body.locations,
        sdeluxe: req.body.sdeluxe,
        deluxe: req.body.deluxe,
        executive: req.body.executive
    });
    hotel.save();
    const booking = new Booking({
        roomId: hotel._id,
        checkIn: "",
        checkOut: "",
        roomtype: ""
    });
    booking.save();
    res.redirect("/rooms");
});

app.post("/searchHotels", function(req, res){
    city=req.body.city;
    const checkIn=req.body.checkIn;
    const checkOut=req.body.checkOut;
    var dates=function(s,e){
        for(var a=[],d=new Date(s);d<=e;d.setDate(d.getDate()+1))
        {
            a.push(new Date(d));
        }
        return a;
    };
    dateList=dates(new Date(checkIn),new Date(checkOut));
    res.redirect("/rooms");
});

app.post("/hotel_details",function(req, res){
    const hotelId=req.body.hotelId;
    Hotel.find({_id:hotelId}, function(err,detail){
        if(err)
        {
            res.redirect("/");
        }
        else
        {
            details=detail;
            res.redirect("/hotel_details")
        }
    });
});

app.post("/checkAvailability", ensureAuthenticated, function(req, res) {
    const roomtype=req.body.roomtype;
    const hotelId=req.body.hotelId;
    Booking.find({_id:hotelId},function(err,doc){
        if(err)
        {
            console.log(err);
        }
        else
        {
            // console.log(doc);
            console.log(req.user.name," is trying to book a ",roomtype," room for dates :",dateList);
            res.redirect("/book_now");
        }
    });
});

app.post("/book", function(req, res) {
    const roomId=req.body.roomId;
    var today = new Date();
    Booking.findOne({_id:roomId},function(err, room){
        if(err)
        {
            console.log(err);
        }
        console.log(today);
        if(room.checkOut!=null && (room.checkOut.getDate()<=today.getDate())&&(room.checkOut.getMonth()==today.getMonth()))
        {
            room.checkIn="";
            room.checkOut="";
        }
        var l=dateList.length;
        function avail(day,mon)
        {
            var stat=false;
            for(var i=0;i<l-1;i++)
            {
                if(dateList[i].getDate()==day&&dateList[i].getMonth()==mon)
                    stat=true;
            }
            return stat;
        }
        if((room.checkIn==null) || !avail(room.checkIn.getDate(),room.checkIn.getMonth()))
        {
            Booking.updateOne({_id:roomId},{ $set: { checkIn: dateList[0] ,checkOut: dateList[l-1]}},  function(err,doc){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("Room Booked",doc);
                    res.redirect("/dashboard");
                }
            });
        }
        else
        {
            console.log("Room Already Booked for this date!");
            res.redirect("/");
        }
    });
});


//-------------------------listen at port 3000-------------------------
app.listen(3000, function() {
    console.log("Server started on port 3000");
});