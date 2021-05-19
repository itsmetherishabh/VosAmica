const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
const { matchedData, sanitizeBody } = require('express-validator');
const request = require("request");
const mongoose = require('mongoose');
const ejs = require("ejs");


const app = express();


app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/dummy", function(req, res) {
    res.render("dummy");
})

app.get("/footer", function(req, res) {
    res.render("footer");
});
app.get("/header", function(req, res) {
    res.render("header");
});

app.get("/login", function(req, res) {
    res.render("login");
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});