(function(){
    var updateUserController= function($scope,$http,$window,$routeParams,authFactory) {
        authFactory.isAuth()
            .success(function(data){
                if(!data.logged) $window.location='/login';
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });
        var username=$routeParams.username;
        $scope.messageUserData='messageUserData '+username;
        $scope.messagePass='messagePass '+username;
    };
    updateUserController.$inject=['$scope','$http','$window','$routeParams','authFactory'];
    angular.module('dataOnMe').controller('updateUserController',updateUserController);
})();