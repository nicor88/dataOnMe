var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RefuellingSchema = mongoose.Schema({
    carId:{ type: Schema.Types.ObjectId, ref: 'cars', required: true},
    amount:{type:Number,required: true},
    paymentType:{type:String},
    fuelprice:{type:Number,required: true},
    fuelType:{type:String,required: true},
    date:{type:Date, required: true},
    kms:{type:Number},
    liters:{type:Number},
    consumation:{type:Number},
    brand:{type:String},
    city:{type:String},
    address:{type:String},
    lastUpdate:{type:Date}
});

RefuellingSchema.statics.findByCarId=function(carId,callback){
    this
        .find({carId:carId})
        .sort({date: 1 })
        .exec(function(err, result) {
            if (!err) {
                callback(false,result);
            } else {
                callback(err,false);
            };
        });
}
RefuellingSchema.statics.getYears=function(carId,callback){
    this
        .aggregate(
        [
            {$match:{
                carId:mongoose.Types.ObjectId(carId)
            }},
            {$project :
            {   year:
            {
                $year: "$date"
            }

            }},
            {$group:
            {
                _id : "$year" ,
                totalRefuellings: { $sum:1}
            }
            },
            { $sort: {_id:-1} }
        ])
        .exec(function(err,result){
            if(!err){
                callback(false,result);
            }
            else{
                callback(err,false);
            }
        });
}

RefuellingSchema.statics.getMonthsStatistics=function(carId,year,callback){
    var nextYear=parseInt(year)+1;
    var startDateFilter=new Date(year+'-01-01');
    var endDateFilter=new Date(nextYear+'-01-01');
    /*console.log('Filter from '+startDateFilter+' to '+endDateFilter);
    console.log(carId);*/
    this
        .aggregate(
        [
            {$match:{
                carId:mongoose.Types.ObjectId(carId),
                date: {$gte: startDateFilter, $lt: endDateFilter},
                kms :{$gt:0}
            }},
            {$project :{
                id:
                {"$concat": [
                    { "$substr": [ { "$year": "$date" }, 0, 4 ] },
                    { "$substr": [ { "$month": "$date" }, 0, 2 ] }
                ]},
                carId:"$carId",
                month:{
                    $month: "$date"
                },
                year:{
                    $year: "$date"
                },
                amount:"$amount",
                kms:"$kms",
                consumation:"$consumation"
            }},
            {$group:{
                _id :  "$id",
                month   : { $max:"$month"},
                year    : { $max:"$year"},
                amountTotal: { $sum:"$amount"},
                kmsTotal:{$sum:"$kms"},
                avgConsumation: {$avg: "$consumation"}
            }
            },
            { $sort: {month:1} }
        ])
        .exec(function(err,result){

            if(!err){
                callback(false,result);
            }
            else{
                callback(err,false);
            }
        });
}

RefuellingSchema.statics.lastRefuelling=function(carId,limit,callback){
    this
        .find({carId:carId})
        .sort({date: -1 })
        .limit(limit)
        .exec(function(err, result) {
            if (!err) {
                callback(false,result);
            } else {
                callback(err,false);
            };
        });
}
RefuellingSchema.statics.getByDate=function(carId,date,callback){
    this
        .find({
            carId:carId,
            date: {$gte: date, $lte: date},
        })
        .exec(function(err, result) {
            if (!err) {
                callback(false,result);
            } else {
                callback(err,false);
            };
        });
}
RefuellingSchema.statics.getByMonth=function(carId,monthYear,callback){
    var startDate= new Date('01-'+monthYear);
    var endDate=new Date('01-'+monthYear);
    endDate.setMonth(endDate.getMonth()+1);
    //console.log(startDate+' '+endDate);
    this
        .find({
            carId:carId
            /*,date:{$gte:startDate}*/
            ,date: {$gte: startDate, $lt: endDate}
        })
        .exec(function(err, result) {
            if (!err) {
                callback(false,result);
            } else {
                callback(err,false);
            };
        });
}

RefuellingSchema.statics.updateRefuelling = function (refuellingId,elementsToUpdate,callback) {
    var conditions = { _id: refuellingId };
    var options = { multi: false };
    this.update(conditions, elementsToUpdate, options, function (err, numAffected){
        if(err) callback(err,false);
        callback(false,numAffected);
    });
}

var Refuelling = mongoose.model('Refuelling', RefuellingSchema);
module.exports = Refuelling;
