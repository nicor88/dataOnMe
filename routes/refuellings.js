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
    }
}