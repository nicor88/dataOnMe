var passport = require('passport');
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
    login: function(req, res){
        if (req.isAuthenticated())
            return res.redirect('/');
        res.render('mainViews/login', {title: 'Login'});
    },
    signup: function(req, res){
        if(req.isAuthenticated())
            return res.redirect('/');
        res.render('mainViews/signup', {title: 'Sign Up'});
    },
    signupPost:function(req, res, next){
        passport.authenticate('local-signup',
            function(err, user, info){
                if(err){
                    res.render('mainViews/signup', {title: 'signup', errorMessage: err.message});
                } else {
                    if(user){
                        req.logIn(user, function(err) {
                            if(err) {
                                console.log(err);
                                return res.render('mainViews/signup', {title: 'signup', errorMessage: err.message});
                            } else {
                                return res.redirect('/');
                            }
                        });
                    } else {
                        res.render('mainViews/signup', {title: 'signup', errorMessage: info.message});
                    }
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
    },
    signin: function(req, res, next) {
        passport.authenticate('local-signin',
            function(err, user, info) {
                if(err) {
                    console.log('error: '+err.message);
                    return res.render('mainViews/login', {title: 'Login', errorMessage: err.message});
                }
                if(!user) {
                    return res.render('mainViews/login', {title: 'Login', errorMessage: info.message});
                }

                req.logIn(user, function(err) {
                    if(err) {
                        return res.render('mainViews/login', {title: 'Login', errorMessage: err.message});
                    } else {
                        if(req.query.pre){
                            return res.redirect('/' + req.query.pre);
                        }
                        return res.redirect('/');
                    }
                });
            })(req, res, next);
    }
};