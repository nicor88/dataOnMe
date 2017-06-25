var passport = require('passport');
var User = require ('../models/user');
var mailconfig = require('../configs/mail');
var mailUtils = require('../mail_utilities/mailFunctions');
var nodemailer = require('nodemailer');

module.exports = {
    isAuth:  function(req, res){
        var data;
        if (!req.isAuthenticated()){
            data={
                logged:false
            };
            return res.json(data);
        }else{
            data={
                logged:true
            };
            return res.json(data);
        }
    },
    activateUser:function(req, res){
        var activationtoken=req.params.activationtoken;
        User.findByActivationToken(activationtoken,function(err,userData){
            if(err){
                res.render('mainViews/activation',
                    {
                        title: 'Activation Page',
                        errormailactivation:'Error on activating user, contact the administrator at '+mailconfig.gmail.auth.user
                    });
            }else {
                if (userData != null) {
                    //console.log(userData.username+' '+userData.approved);
                    if (userData.approved == true) {
                        res.render('mainViews/activation',
                            {
                                title: 'Activation Page',
                                activated: userData.username + ' already approved! '
                            });
                    }else{
                        var elementsToUpdate = {approved: true};
                        User.updateUser(userData.username, elementsToUpdate, function (err) {
                            //console.log('Error: '+err);
                            if (!err) {
                                res.render('mainViews/activation',
                                    {
                                        title: 'Activation Page',
                                        activated: userData.username + ' activated! '
                                    });

                            } else {
                                console.log(err);
                                res.render('mainViews/activation',
                                    {
                                        title: 'Activation Page',
                                        errormailactivation: 'Error on activating user, contact the administrator at ' + mailconfig.gmail.auth.user
                                    });
                            }
                        });
                }

                } else {
                    res.render('mainViews/activation',
                        {
                            title: 'Activation Page',
                            errormailactivation:'Error on activating user, contact the administrator at '+mailconfig.gmail.auth.user
                        });
                }
            }
        });
    },
    resendMail:function(req, res){
        var username=req.params.username;
        User.findByUsername(username,function(err,user){
            if(err){
                res.render('mainViews/activation',
                    {
                        title: 'Activation Page',
                        errormailactivation:'Error on sending the mail, contact the administrator at '+mailconfig.gmail.auth.user
                    });
            }else {
                if (user != null) {
                    var registrationLink = mailconfig.activationLink + user.activationtoken;
                    var transporter = nodemailer.createTransport(mailconfig.gmail);
                    mailconfig.registrationMailEnglish.from = mailconfig.gmail.auth.user;
                    mailconfig.registrationMailEnglish.to = user.email;
                    mailconfig.registrationMailEnglish.text = mailUtils.generateEnglishRegistrationMail(user.username, registrationLink);
                    mailconfig.registrationMailEnglish.html = mailUtils.generateEnglishRegistrationMail(user.username, registrationLink);

                    transporter.sendMail(mailconfig.registrationMailEnglish, function (error, info) {
                        if (error) {
                            res.render('mainViews/activation',
                                {
                                    title: 'Activation Page',
                                    errormailactivation: 'Error on sending mail, contact the administrator at ' + mailconfig.gmail.auth.user
                                });
                        } else {
                            res.render('mainViews/activation', {
                                title: 'Activation Page',
                                infomailactivation: 'Mail sent to ' + user.email + '. Activate your account checking your mail!'
                            });
                        }
                    });

                } else {
                    res.render('mainViews/activation',
                        {
                            title: 'Activation Page',
                            errormailactivation:'Error on sending the mail, contact the administrator at '+mailconfig.gmail.auth.user
                        });
                }
            }
        });
    },
    //USER CRUD
    //TODO delete a specific user
    //TODO activate a user - need on administrator interface

    getUserData:function(req, res){
        var data;
        if (!req.isAuthenticated()){
            data={
                logged:false
            };
            return res.json(data);
        }else{
            var username=req.params.username;
            User.findByUsername(username,function(err,data){
                if(err){
                    res.send('error');
                }else{
                    return res.json(data);
                }
            });
        }
    },
    updateUserData: function(req, res){
        //TODO
    },
    updatePassword: function(req, res){
        //TODO
    }
};