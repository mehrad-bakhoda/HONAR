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
              res.render("becomeArtist", { user: found });
            }
          }
        });
      }
};