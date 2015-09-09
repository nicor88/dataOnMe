(function(){
    var updateUserController= function($scope,$http,$window) {
        var now=new Date();
        $http.get("isAuth?date="+now.toISOString(),{cache: false})
            .success(function (data) {
                if(!data.logged) $window.location='/login';
            });
        $scope.message='Update User data';
    };
    updateUserController.$inject=['$scope','$http','$window'];
    angular.module('dataOnMe').controller('updateUserController',updateUserController);
})();