const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const User=require('../models/User');

module.exports=function(passport){
  passport.use(
    new LocalStrategy({usernameField:'email'},(email,password,done) => {
      //looking for the user/User
      User.findOne({email:email})
      .then(User => {
        if(!User){
          return done(null, false, {message: 'Entered email is not registered!'});
        }
        //Match password separately
        bcrypt.compare(password,User.password,(err,isMatch) => {
          if(err) throw err;

          if(isMatch){
            return done(null,User);
          }
          else{
            return done(null,false,{message: "Entered password does not match!"});
          }
        });
      })
      .catch(err => console.log(err));
    })
  );

  passport.serializeUser((user,done) => {
    done(null,user.id);
  });

  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err,user);
    });
  });
}
