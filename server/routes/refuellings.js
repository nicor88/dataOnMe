var Refuelling = require('../models/refuelling');
module.exports = {
    getYears:function(req,res,next){
        var data;
        if (!req.isAuthenticated()){
            data={
                logged:false
            };
            return res.json(data);
        }else{
            var carId=req.params.carId;
            Refuelling.getYears(carId,function(err,years){
                if(err){
                    res.send('error');
                }else{
                    return res.json(years);
                }
            });
        }
    },
    getRefuellingsByCarId:function(req,res, next){
        var data;
        if (!req.isAuthenticated()){
            data={
                logged:false
            };
            return res.json(data);
        }else{
            var carId=req.params.carId;
            Refuelling.findByCarId(carId,function(err,refuellings){
                if(err){
                    res.send('error');
                }else{
                    return res.json(refuellings);
                }
            });
        }
    },
    getMonthData:function(req,res, next){
        var data;
        var carId=req.params.carId;
        var monthYear=req.params.monthYear;
        Refuelling.getByMonth(carId,monthYear,function(err,refuellings){
            if(err){
                res.send('error');
            }else{
                return res.json(refuellings);
            }
        });

    },
    getMonthsStatistics:function(req,res, next){
        var data;
        if (!req.isAuthenticated()){
            data={
                logged:false
            };
            return res.json(data);
        }else{
            var carId=req.params.carId;
            var year=req.params.year;
            Refuelling.getMonthsStatistics(carId,year,function(err,refuellings){
                if(err){
                    res.send(err);
                }else{
                    return res.json(refuellings);
                }
            });
        }
    },
    getLastRefuelling:function(req,res,next){
        var data;
        if (!req.isAuthenticated()){
            data={
                logged:false
            };
            return res.json(data);
        }else{
            var carId=req.params.carId;
            Refuelling.lastRefuelling(carId,1,function(err,refuelling){
                if(err){
                    return res.send('error');
                }else{
                    return res.json(refuelling);
                }
            });
        }
    },
    getLastRefuellings:function(req,res, next){
        var data;
        if (!req.isAuthenticated()){
            data={
                logged:false
            };
            return res.json(data);
        }else{
            var carId=req.params.carId;
            Refuelling.lastRefuelling(carId,2,function(err,refuelling){
                if(err){
                    return res.send('error');
                }else{
                    return res.json(refuelling);
                }
            });
        }
    },
    insertRefuelling: function (req,res){
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
    },
    updateRefuelling:function (req,res){
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
    }
};