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
        $scope.inserterror=false;
        $scope.insertsuccess=false;
        $scope.userdata = {};
        $scope.messageUserData='messageUserData '+username;
        $scope.messagePass='messagePass '+username;

        usersFactory.getUserData(username)
            .success(function(data){
                if(data.logged === "undefined"){
                    if(data.logged) $window.location='/login';
                }else{
                    $scope.userdata=data;
                }
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });

    };
    updateUserController.$inject=['$scope','$http','$window','$routeParams','authFactory','usersFactory'];
    angular.module('dataOnMe').controller('updateUserController',updateUserController);
})();