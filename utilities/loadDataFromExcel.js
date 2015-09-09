var xlsx = require('node-xlsx');
var Refuelling = require('../models/refuelling');
var mongoose = require('mongoose');
var db = require('../configs/db');

mongoose.connect(db.url, function(err) {
    if(err) {
        console.log('MongoDB connection error: ', err);
    } else {
        console.log('conntected to '+db.url+'....');
    }
});

//local
var carId='554fa5ac622a069b4f1b4913';
var fuelType='Benzin';
var sheets = xlsx.parse('./data/consumo_auto.xlsx'); // parses a file
var sheet=sheets[0];
var records=sheet.data;
records.splice(0, 1);
records.forEach(function(element){
    var amount = element[0];
    var fuelprice = element[1];
    var date = ExcelDateToJSDate(element[2]);
    var kms = element[3];
    if (kms == null || kms == "" || kms== undefined) kms = 0;
    var brand = element[5];
    var city = element[6];
    var address = element[7];
    if (address == "") address = null;
    var consumation;
    if (kms == null || kms == "" || kms== undefined ) {
        consumation = 0;
    } else {
        consumation = kms / (amount / fuelprice);
    }
    var NewRefuelling = new Refuelling();
    NewRefuelling.carId = carId;
    NewRefuelling.date = date;
    NewRefuelling.amount = amount;
    NewRefuelling.fuelprice = fuelprice;
    NewRefuelling.fuelType = fuelType;
    NewRefuelling.kms = kms;
    NewRefuelling.liters = amount / fuelprice;
    NewRefuelling.consumation = consumation;
    NewRefuelling.brand = brand;
    NewRefuelling.city = city;
    NewRefuelling.address = address;
    NewRefuelling.lastUpdate = new Date();
    NewRefuelling.save(function (err, result) {
        if (err) console.log(err);
        if (result) console.log(result);
    });
});

function ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569)*86400*1000));
}