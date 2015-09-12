var xlsx = require('node-xlsx');
var mongoose = require('mongoose');
var db = require('./configs/db');
var User = require('./models/user');
var Car = require('./models/car');
var Refuelling = require('./models/refuelling');

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
admin.email='admin@email.com';
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
user.save(function (err, userInsered) {
    if (err) {
        console.log(err);
    } else {
        console.log('user insered -->' + userInsered);
        var demoCar= new Car();
        demoCar.userId=userInsered._id;
        demoCar.name='EE111EE';
        demoCar.brand='Toyota';
        demoCar.model='Yaris';
        demoCar.fuel ='Benzin';
        demoCar.year ='2000';
        demoCar.creationDate = new Date();
        demoCar.description='Demo car!';
        demoCar.save(function (err, carInsered) {
            if (err) {
                console.log(err);
            }else{
                console.log('car insered: '+carInsered);
                var sheets = xlsx.parse('./utilities/data/consumo_auto.xlsx'); // parses a file
                var sheet=sheets[0];
                var records=sheet.data;
                var carId=carInsered._id;
                var fuelType=carInsered.fuel;
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
            }
        });
    }
});

function ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569)*86400*1000));
}
//MongoDB scripts
//db.users.remove({username:'admin'})