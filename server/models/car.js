var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = mongoose.Schema({
    userId:{ type: Schema.Types.ObjectId, ref: 'users', required: true},
    brand:{type: String},
    model:{type: String},
    name:{type: String,required:true},
    fuel:{type:String, required:true},
    year:{type: Number},
    creationDate:{type: Date},
    description:{type: String}
});

CarSchema.statics.findById = function (carId,callback) {
    this.find({_id:carId})
        .exec(function(err,result) {
            if (!err) {
                callback(false,result);
            } else {
                callback(err,false);
            }
        });
};

CarSchema.statics.findByUserId = function (userId,callback) {
    this.find({userId:userId})
        .exec(function(err, result) {
            if (!err) {
                callback(false,result);
            } else {
                callback(err,false);
            }
        });
};

CarSchema.statics.findByCarNameAndUserId = function (userId,carName,callback) {
    this.find({userId:userId,name:carName})
        .exec(function(err,result) {
            if (!err) {
                callback(false,result);
            } else {
                callback(err,false);
            }
        });
};

CarSchema.statics.updateCar = function (carId,elementsToUpdate,callback) {
    var conditions = { _id: carId };
    var options = { multi: false };
    this.update(conditions, elementsToUpdate, options, function (err, numAffected){
        if(err) callback(err,false);
        callback(false,numAffected);
    });
};

var Car = mongoose.model('Car', CarSchema);
module.exports = Car;