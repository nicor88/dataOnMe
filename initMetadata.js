var mongoose = require('mongoose');
var db = require('./configs/db');
var User = require('./models/user');
mongoose.connect(db.url, function(err) {
    if(err) {
        console.log('Error connecting with Mongo: ', err+"\n");
    } else {
        console.log('Mongo is connected!\n');
    }
});

//insert admin user
var admin= new User();
admin.username='admin';
admin.password='password';
admin.email='admin@insidedata.io';
admin.isAdmin=true;
admin.role='admin';
admin.registrationDate= new Date();
admin.approved=true;

admin.save(function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log('insered---->' + result);
    }
});

//Insert simple user with simple data
var user= new User();
user.username='user';
user.password='password';
user.email='user@email.com';
user.isAdmin=false;
user.role='user';
user.registrationDate= new Date();
user.approved=true;
user.save(function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log('user insered -->' + result);
    }
    //TODO create a car and link basic data
});

//MongoDB scripts
//db.users.remove({username:'admin'})