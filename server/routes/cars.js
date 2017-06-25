var Car = require ('../models/car');

module.exports = {
    getCars: function(req, res){
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
    },
    getCar: function(req, res){
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
    },
    insertCar: function (req,res){
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
    },
    updateCar:function (req,res){
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
    },
    removeCar: function (req,res){
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
    }
}