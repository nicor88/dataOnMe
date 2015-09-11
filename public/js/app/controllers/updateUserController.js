(function(){
    var updateUserController= function($scope,$http,$window,$routeParams,authFactory,usersFactory) {
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

        usersFactory.getUserData(username)
            .success(function(data){
                if(data.logged === "undefined"){
                    if(data.logged) $window.location='/login';
                }else{
                    $scope.user=data.registrationDate;
                }
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });

    };
    updateUserController.$inject=['$scope','$http','$window','$routeParams','authFactory','usersFactory'];
    angular.module('dataOnMe').controller('updateUserController',updateUserController);
})();