(function(){
    var updateUserController= function($scope,$http,$window,authFactory) {
        authFactory.isAuth()
            .success(function(data){
                if(!data.logged) $window.location='/login';
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });
        $scope.messageUserData='messageUserData';
        $scope.messagePass='messagePass';
    };
    updateUserController.$inject=['$scope','$http','$window','authFactory'];
    angular.module('dataOnMe').controller('updateUserController',updateUserController);
})();