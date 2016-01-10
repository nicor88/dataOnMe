var passport = require('passport');
var nodemailer = require('nodemailer');
var mailconfig = require('../configs/mail');
var mailUtils = require('../mail_utilities/mailFunctions');

module.exports = {
    renderHome:  function(req, res) {
        var userdata;
        if(!req.isAuthenticated()) {
            /*var userdata="logged=false;";
             res.render('index', {title: 'Home', userdata: userdata});*/
            res.render('mainViews/index',{title:'DataOnMe'});

        } else {
            var user = req.user;
            if(user.isAdmin){
                console.log('render admin page!');
                userdata="logged=true;username='"+user.username+"';";
                res.render('mainViews/admin-user', {title: 'Admin', userdata:userdata});
            }
            else{
                userdata="logged=true;username='"+user.username+"';";
                res.render('mainViews/normal-user', {title: 'Dashboard', userdata:userdata});
            }
        }
    },
    default: function(req, res){
        res.status(404);
        res.sendStatus(404);
    },
    signup: function(req, res){
        if(req.isAuthenticated())
            return res.redirect('/');
        res.render('mainViews/signup', {title: 'Sign Up'});
    },
    signupPost:function(req, res, next){
        passport.authenticate('local-signup',
            function(err, user, info){
                //console.log('Saving user error:'+err);
                if(err){
                    res.render('mainViews/signup', {title: 'signup', errorMessage: err.message});
                } else {
                    if(user){
                        if(!mailconfig.mailcheck){
                            req.logIn(user, function(err) {

                             if(err) {
                                return res.render('mainViews/signup', {title: 'signup', errorMessage: err.message});
                             } else {
                                return res.redirect('/');
                             }
                             });
                        }else {
                            console.log('Check email:' + mailconfig.mailcheck);
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
                                    console.log('Message sent: ' + info.response);
                                    res.render('mainViews/activation', {
                                        title: 'Activation Page',
                                        infomailactivation: 'Mail sent to ' + user.email + '. Activate your account checking your mail!'
                                    });
                                }
                            });
                        }
                    } else {
                        res.render('mainViews/signup', {title: 'signup', errorMessage: info.message});
                    }
                }
            })(req, res, next);
    },
    login: function(req, res){
        if (req.isAuthenticated())
            return res.redirect('/');
        res.render('mainViews/login', {title: 'Login'});
    },
    signin: function(req, res, next) {
        passport.authenticate('local-signin',
            function(err, user, info) {
                if(err) {
                    //console.log('error: '+err.message);
                    return res.render('mainViews/login', {title: 'Login', errorMessage: err.message});
                }
                if(!user) {
                    return res.render('mainViews/login', {title: 'Login', errorMessage: info.message});
                }
                if(!user.approved){
                    res.render('mainViews/activation',
                        {
                            title: 'Activation Page',
                            mailactivation:'Check your email to activate your user, or click the button to resend the email:',
                            username:user.username
                        });
                }else{
                    req.logIn(user, function(err) {
                        if(err) {
                            return res.render('mainViews/login', {title: 'Login', errorMessage: err.message});
                        } else {
                            /*if(req.query.pre){
                             return res.redirect('/' + req.query.pre);
                             }*/
                            return res.redirect('/');

                        }
                    });
                }
            })(req, res, next);
    },
    signout: function(req, res) {
        if(!req.isAuthenticated()) {
            res.redirect('/');
        } else {
            req.logout();
            res.redirect('/');
        }
    }
};