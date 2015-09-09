var Car = require ('./models/car');
var Refuelling = require('./models/refuelling');

var carsAPI=require('./routes/cars');
var refuellingsAPI = require('./routes/refuellings');

module.exports = function(app, passport){
    app.get('/', function(req, res) {
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
    });
    app.get('/login', function(req, res) {
        if (req.isAuthenticated())
            return res.redirect('/');
        res.render('mainViews/login', {title: 'Login'});
    });

    app.get('/signup', function(req, res) {
     if(req.isAuthenticated())
        return res.redirect('/');
     res.render('mainViews/signup', {title: 'Sign Up'});
     });

    app.get('/signout', function(req, res) {
        if(!req.isAuthenticated()) {
            res.redirect('/');
        } else {
            req.logout();
            res.redirect('/');
        }
    });

    app.post('/signup', function(req, res, next){
        passport.authenticate('local-signup',
            function(err, user, info){
                if(err){
                    res.render('signup', {title: 'signup', errorMessage: err.message});
                } else {
                    if(user){
                        req.logIn(user, function(err) {
                            if(err) {
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
    });

    app.post('/signin', function(req, res, next) {
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
    });

    app.post('/insertCar', function (req,res){
        var data;
        if(!req.isAuthenticated()){
            data={
                error:true,
                success:false,
                message:'no-auth'
            };
            return res.json(data);
        }
        else{
            var user = req.user;
            var NewCar = new Car();
            NewCar.name=req.body.name;
            Car.findByCarNameAndUserId(user._id, NewCar.name,function(err,result) {
                if(err) {
                    data={
                        error:true,
                        success:false,
                        message:'There was an error during insert!'
                    };
                    return res.json(data);
                }
                if (result.length != 0) {
                    data={
                        error:true,
                        success:false,
                        message:'Please change the car name!You have another device car with  the name: '+NewCar.name
                    };
                    return res.json(data);
                } else {
                    NewCar.userId=user._id;
                    NewCar.brand=req.body.brand;
                    NewCar.model=req.body.model;
                    NewCar.fuel=req.body.fuel;
                    NewCar.creationDate=new Date();
                    NewCar.year=req.body.year;
                    NewCar.description=req.body.description;
                    NewCar.save(function(err,result){
                        if(err){
                            console.log(err);
                            data={
                                error:true,
                                success:false,
                                message:'There was an error during insert!'
                            };
                            return res.json(data);
                        }
                        if(result){
                            data={
                                error:false,
                                success:true,
                                message:'Insert correct!'
                            };
                            return res.json(data);
                        }
                    });
                }
            });
        }
    });
    app.post('/updatecar/:carId', function (req,res){
        var data;
        if(!req.isAuthenticated()){
            data={
                error:true,
                success:false,
                message:'no-auth'
            };
            return res.json(data);
        }
        else{
            var carId=req.params.carId;
            var elementsToUpdate={
                fuel:req.body.fuel,
                year:req.body.year,
                description:req.body.description
            };
            Car.updateCar(carId,elementsToUpdate,function(err) {
                if(!err){
                    data={
                        error:false,
                        success:true,
                        message:'Data updated!'
                    };
                    return res.json(data);
                }else{
                    data={
                        error:true,
                        success:false,
                        message:'There was an error during update!'
                    };
                    return res.json(data);
                }
            });
        }
    });

    app.post('/removecar/:carId', function (req,res){
        var data;
        if(!req.isAuthenticated()){
            data={
                error:true,
                success:false,
                message:'no-auth'
            };
            return res.json(data);
        }
        else{
            var carId=req.params.carId;
            Car.findById(carId,function(err,car){
                if(err) {
                    data={
                        error:true,
                        success:false,
                        message:'Error during deleting!'
                    };
                    return res.json(data);
                }
                var carToRemove=car[0];
                if(carToRemove.name==req.body.name){
                    var toRemove= new Car(carToRemove);
                    toRemove.remove(function(err) {
                        if(err){
                            console.log(err);
                            data={
                                error:true,
                                success:false,
                                message:'Error during deleting!'
                            };
                            return res.json(data);

                        }else{
                            data={
                                error:false,
                                success:true,
                                message:toRemove.name +' deleted!'
                            };
                            return res.json(data);
                        }
                    });
                }else{
                    var data={
                        error:true,
                        success:false,
                        message:'Car name '+req.body.name+' is wrong! Re-try with another name!'
                    };
                    return res.json(data);
                }
            });
        }
    });

    app.post('/insertrefuelling', function (req,res){
        var data;
        if(!req.isAuthenticated()){
            data={
                error:true,
                success:false,
                message:'no-auth'
            };
            return res.json(data);
        }
        else{
            var NewRefuelling = new Refuelling();
            NewRefuelling.carId=req.body.carId;
            NewRefuelling.amount=parseFloat(req.body.amount);
            NewRefuelling.paymentType=req.body.paymentType;
            NewRefuelling.fuelprice=parseFloat(req.body.fuelprice);
            NewRefuelling.fuelType=req.body.fueltype;
            NewRefuelling.date=req.body.date;
            NewRefuelling.kms=0;
            NewRefuelling.liters=req.body.liters;
            NewRefuelling.consumation=0;
            NewRefuelling.brand=req.body.brand;
            NewRefuelling.city=req.body.city;
            NewRefuelling.address=req.body.address;
            NewRefuelling.lastUpdate=req.body.date;
            NewRefuelling.save(function(err,result){
                if(err){
                    data={
                        error:true,
                        success:false,
                        message:err
                    };
                    return res.json(data);
                }
                if(result){
                    data={
                        error:false,
                        success:true,
                        message:'Insert correct!'
                    };
                    return res.json(data);
                }
            });
        }
    });

    app.post('/updaterefuelling/:refuellingId', function (req,res){
        var data;
        if(!req.isAuthenticated()){
            data={
                error:true,
                success:false,
                message:'no-auth'
            };
            return res.json(data);
        }
        else {
            var refuellingId=req.params.refuellingId;
            var elementsToUpdate={
                amount:req.body.amount,
                kms:req.body.kms,
                liters:req.body.liters,
                consumation:req.body.consumation,
                lastUpdate:req.body.lastUpdate
            };
            Refuelling.updateRefuelling(refuellingId,elementsToUpdate,function(err) {
                if(err){
                    data={
                        error:true,
                        success:false,
                        message:err
                    };
                    return res.json(data);
                }else{
                    data={
                        error:false,
                        success:true,
                        message:'Refuelling updated!'
                    };
                    return res.json(data);
                }
            });
        }

    });

    //REST services
    app.get('/isAuth', function(req, res) {
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
    });

    app.get('/cars', function(req, res) {
        var data;
        if (!req.isAuthenticated()){
            data={
                logged:false
            };
            return res.json(data);
        }else{
            var user=req.user;
            Car.findByUserId(user._id,function(err,cars){
                if(!err){
                    return res.json(cars);
                }else{
                    return res.send('error');
                }
            });
        }
    });

    app.get('/car/:carId', function(req, res) {
        if (!req.isAuthenticated()){
            var data={
                logged:false
            };
            return res.json(data);
        }else{
            var carId=req.params.carId;
            Car.findById(carId,function(err,car){
                if(!err){
                    return res.json(car);
                }else{
                    return 'error';
                }
            });
        }
    });

    app.get('/lastrefuelling/:carId',refuellingsAPI.getLastRefuelling);
    app.get('/lastrefuellings/:carId',refuellingsAPI.getLastRefuellings);

    app.get('/refuellings/:carId', refuellingsAPI.getRefuellingsByCarId);
    app.get('/refuellings/years/:carId', refuellingsAPI.getYears);
    app.get('/refuellings/monthData/:carId/:monthYear', refuellingsAPI.getMonthData);
    app.get('/refuellings/statistics/:carId/:year', refuellingsAPI.getMonthsStatistics);


    app.use(function(req, res) {
        res.status(404);
        res.sendStatus(404);
    });
};