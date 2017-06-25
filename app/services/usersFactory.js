(function(){
    var usersFactory = function($http){
        var factory={};
        factory.getUserData = function (username){
            var callTime=new Date();
            return $http.get("userdata/"+username+"?date="+callTime.toISOString(),{cache: false});
        };
        return factory;
    };
    usersFactory.$inject=['$http'];
    angular.module('dataOnMe').factory('usersFactory',usersFactory);
})();