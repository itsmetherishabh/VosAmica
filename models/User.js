const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
  email:String,
  password:String,
  emailToken:String,
  name:String,
  phone:String,
  photo:String,
  time:String
});

const User=new mongoose.model("User",userSchema);

module.exports = User;
