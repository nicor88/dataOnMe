var Refuelling = require('./../models/refuelling');
var mongoose = require('mongoose');
var db = require('./../configs/db');

mongoose.connect(db.url, function(err) {
    if(err) {
        console.log('MongoDB connection error: ', err);
    } else {
        console.log('conntected to '+db.url+'....');
    }
});


var carId='5561ff3791f2a0bf04445e94';
var date='2015-05-15'
Refuelling.getByDate(carId,date,function(err,data){
    if(err){
        console.log(error);
    }else{
        console.log(data[0]);
        var element=data[0];
        console.log(element._id);
        var elementToUpdate={
            lastUpdate:element.lastUpdate,
            city:'Iglesias',
            address:element.address,
            brand:element.brand,
            consumation:element.consumation,
            liters:element.liters,
            kms:element.kms,
            fuelType:element.fuelType,
            fuelprice:element.fuelprice,
            amount:element.amount,
            date:new Date(element.date),
            carId: element.carId
        };
        console.log(elementToUpdate);
        Refuelling.updateRefuelling(element._id,elementToUpdate,function(err) {
            if(err){
                console.log(err);
            }else{
                console.log(data);
            }
        });
    }
});

