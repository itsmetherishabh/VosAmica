const express=require("express");
const bodyParser=require("body-parser");
const {check, validationResult } = require('express-validator');
const {matchedData, sanitizeBody} = require('express-validator');
const request=require("request");
const mongoose = require('mongoose');
const ejs = require("ejs");


const app=express();


app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.render("index");
  });

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });