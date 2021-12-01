//Modules

//Local modules
import express from 'express';

//Database models
var User = require("../../../models/user");

//Code

export default (req,res)=>{
    if (req.session.userId) {
        User.findOne({ unique_id: req.session.userId }, function (err, found) {
          if (!err) {
            if (found) {
              if(found.type=="Downloader"){
                res.render("becomeArtist", { user: found });
              }
              if(found.type=="Uploader"){
                res.redirect("/dashboard");
              }
              
            }
          }
          if(err){console.log(err);res.redirect('/dashboard');}
          if(!found){res.redirect('/dashboard');}
        });
      }else{
        res.redirect("/login");
      }
};