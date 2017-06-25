(function(){
    var carsFactory = function($http){
        var factory={};
        //get all cars for session user
        factory.getCars = function (){
            var callTime=new Date();
            return $http.get("cars?date="+callTime.toISOString(),{cache: false});
        };
        //get a specific car by Id
        factory.getCar = function(carId){
            var callTime=new Date();
            return $http.get("car/"+carId+"?date="+callTime.toISOString(),{cache: false});
        };

        return factory;
    };
    carsFactory.$inject=['$http'];
    angular.module('dataOnMe').factory('carsFactory',carsFactory);
})();