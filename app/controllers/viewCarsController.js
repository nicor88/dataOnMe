(function(){
    var viewCarsController= function($scope,$http,$window,authFactory,carsFactory) {
        $scope.alerts = [];
        authFactory.isAuth()
            .success(function(data){
                if(!data.logged) $window.location='/login';
            })
            .error(function(data,status,heders,config){
                $scope.alerts.push({ type: 'danger', msg: 'There was an error getting data!' });
            });
        carsFactory.getCars()
            .success(function(data){
                $scope.cars=data;

            })
            .error(function(data,status,heders,config){
                $scope.alerts.push({ type: 'danger', msg: 'There was an error getting data!' });
            });

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        var hideAlerts=setInterval(function() {
            $scope.alerts=[];
            $scope.$apply();
        }, 5000);

    };
    viewCarsController.$inject=['$scope','$http','$window','authFactory','carsFactory'];
    angular.module('dataOnMe').controller('viewCarsController',viewCarsController);
})();