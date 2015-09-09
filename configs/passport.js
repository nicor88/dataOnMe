var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var moment = require('moment');
var User = require('../models/user');
var jwtTokenSecret = 'dataonme';

module.exports = function(app, passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        User.findByUsername(username, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signin', new LocalStrategy(function(username, password, done) {
        User.findOne({username: username}, function(err, user){
            if(err){
                return done(err);
            }
            if(!user) {
                //return done(null, false, {message: 'No user with this username'});
                return done(null, false, {message: 'Invalid password or user!'});
            } else {
                user.comparePassword(password, function(err, isMatch){
					if(err){
						return done(null, false, {message: 'error'});
					}
					if(!isMatch){
						//return done(null, false, {message: 'Invalid password for user '+username});
                        return done(null, false, {message: 'Invalid password or user!'});
					}
					return done(null, user);
				});
            }
        });
    }));

    passport.use('local-signup', new LocalStrategy({usernameField: 'username',passReqToCallback: true},function(req,username, password, done) {
        var newUser = new User();
        newUser.username = username;
        //TODO check the password security
        if(password!=req.body.password2){
            //console.log('typed password are differents');
            return done(null, false, {message: 'The typed passwords are differents!'});
        }
        newUser.password = password;
        newUser.email = req.body.email;
        newUser.isAdmin=false;
        newUser.role='user';
        newUser.registrationDate=new Date();
        newUser.approved=false;

        // save the user
        newUser.save(function(err) {
            if (err){
                return done(err);
            }
            return done(null, newUser, {message: 'User registered'});
        });
    }));

    passport.use('token-signin', new LocalStrategy(function(username, password, done) {
        User.findOne({username: username}, function(err, user){
            if(err){
                return done(err);
            }

            if(!user) {
                return done(null, false, {message: 'Invalid username or password'});
            } else {
                user.comparePassword(password, function(err, isMatch){
                    if(err){
                        return done(null, false, {message: 'error'});
                    }
                    if(!isMatch){
                        return done(null, false, {message: 'Invalid username or password'});
                    }

                    var expires = moment().add('days', 7).valueOf();
                    var token = jwt.encode({
                        iss: user._id,
                        exp: expires
                    }, jwtTokenSecret);

                    var response = {
                        token : token,
                        expires: expires,
						user: user
                    };

                    return done(null, user, response);
                });
            }
        });
    }));
};