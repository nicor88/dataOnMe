(function(){
    var removeCarController= function($scope,$routeParams,$http,$window) {
        var carId=$routeParams.carId;
        var now=new Date();
        $scope.showdeleteform=true;
        $scope.deleteerror=false;
        $scope.deletesuccess=false;
        $scope.formData = {};
        $scope.car={};
        $http.get("car/"+carId+"?date="+now.toISOString(),{cache: false})
            .success(function (car) {
                if(car.length==1){
                    var carToRemove=car[0];
                    $scope.car.brand=carToRemove.brand;
                    $scope.car.model=carToRemove.model;
                }
            });
        $http.get("isAuth?date="+now.toISOString(),{cache: false})
            .success(function (data) {
                if(!data.logged) $window.location='/login';
            });

        $scope.processForm = function() {
            $http({
                method  : 'POST',
                url     : 'removecar/'+carId,
                data    : $.param($scope.formData),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded','Cache-Control' : 'no-cache' }  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function(data) {
                    if (data.error) {
                        $scope.deleteerror=true;
                        $scope.deletesuccess=false;
                        if(data.message=='no-auth'){
                            $scope.error='You are not authenticated!';
                            $window.location='/login';
                        }else{
                            $scope.error=data.message;
                        }
                    } else {
                        $scope.deleteerror=false;
                        $scope.deletesuccess=true;
                        $scope.info=data.message;
                        $window.location='#/fuelconsumation/viewcars';
                    }
                })
                .error(function () {
                    $scope.deleteerror=true;
                    $scope.deletesuccess=false;
                    $scope.error='There was an error, re-try to delete!';
                });
        };

    };
    removeCarController.$inject=['$scope','$routeParams','$http','$window'];
    angular.module('dataOnMe').controller('removeCarController',removeCarController);
})();