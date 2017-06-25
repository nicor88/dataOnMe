(function(){
    var authFactory = function($http){
        var factory={};
        factory.isAuth = function (){
            var callTime=new Date();
            return $http.get("isAuth?date="+callTime.toISOString(),{cache: false});
        };
        return factory;
    };
    authFactory.$inject=['$http'];
    angular.module('dataOnMe').factory('authFactory',authFactory);
})();