(function(){
    var refuellingFactory = function($http){
        var factory={};
        factory.getYears = function (carId){
            var callTime=new Date();
            return $http.get('refuellings/years/'+carId+'?date='+callTime.toISOString(),{cache: false});
        };
        factory.getAllRefuelling = function(carId){
            var callTime=new Date();
            return $http.get('refuellings/'+carId+'?date='+callTime.toISOString(),{cache: false});
        };
        factory.getMonthRefuellings = function (carId,monthYear){
            var callTime=new Date();
            return $http.get('refuellings/monthData/'+carId+'/'+monthYear+'?date='+callTime.toISOString(),{cache: false});
        };
        factory.getMonthlyStatistics = function (carId,year){
            var callTime=new Date();
            return $http.get('refuellings/statistics/'+carId+'/'+year+'?date='+callTime.toISOString(),{cache: false});
        };

        return factory;
    };
    refuellingFactory.$inject=['$http'];
    angular.module('dataOnMe').factory('refuellingFactory',refuellingFactory);
})();