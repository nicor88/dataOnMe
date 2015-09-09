var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } ,unique: true},
    password: { type: String, required: true },
    email:{ type: String, required: true, unique: true},
    isAdmin:{type:Boolean},
    role: {type:String},
    registrationDate:{type:Date},
    approved:{type:Boolean}
});

UserSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    var password = user.password;
    var hash = bcrypt.hashSync(password);
    user.password=hash;
    next();
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    var password = this.password;
    if(!bcrypt.compareSync(candidatePassword, password)) {
        return callback(null,false);
    } else {
        return callback(null,true);;
    }
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.statics.findByUsername = function (username, callback) {
    this.findOne({ username: username }, callback);
};

module.exports = mongoose.model('User', UserSchema);