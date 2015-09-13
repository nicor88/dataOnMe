var mongoose = require('mongoose');
var db = require('../configs/db');
var User = require('../models/user');

mongoose.connect(db.url, function(err) {
    if(err) {
        console.log('MongoDB connection error: ', err);
    } else {
        console.log('conntected to '+db.url+'....');
    }
});

var username='nicor';
var elementsToUpdate={ approved:true};
User.updateUser(username,elementsToUpdate,function(err) {
    if(!err){
        console.log(username+' activated');

    }else{
        console.log(err);
    }
});