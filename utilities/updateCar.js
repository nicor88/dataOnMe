var mongoose = require('mongoose');
var db = require('../configs/db');
var Car = require('../models/car');

mongoose.connect(db.url, function(err) {
    if(err) {
        console.log('MongoDB connection error: ', err);
    } else {
        console.log('conntected to '+db.url+'....');
    }
});

var carId='5561ff3791f2a0bf04445e94';
var elementsToUpdate={ name:'EM903TT'};
Car.updateCar(carId,elementsToUpdate,function(err) {
    if(!err){
        console.log('Car updated!');

    }else{
        console.log(err);
    }
});