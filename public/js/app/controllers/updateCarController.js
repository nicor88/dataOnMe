(function(){
    var updateCarController= function($scope,$routeParams,$http,$window,authFactory) {
        authFactory.isAuth()
            .success(function(data){
                if(!data.logged) $window.location='/login';
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });

        var carId=$routeParams.carId;
        var now=new Date();
        $scope.updateerror=false;
        $scope.updatesuccess=false;
        $scope.formData = {};
        $http.get("car/"+carId+"?date="+now.toISOString(),{cache: false})
            .success(function (car) {
                if(car.length==1){
                    var carToUpdate=car[0];
                    $scope.formData.fuel=carToUpdate.fuel;
                    $scope.formData.year=carToUpdate.year;
                    $scope.formData.description=carToUpdate.description;
                }
            });

        $scope.processForm = function() {
            $http({
                method  : 'POST',
                url     : 'updatecar/'+carId,
                data    : $.param($scope.formData),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function(data) {
                    console.log(data);
                    if (data.error) {
                        $scope.updateerror=true;
                        $scope.updatesuccess=false;
                        if(data.message=='no-auth'){
                            $scope.error='You are not authenticated!';
                            $window.location='/login';
                        }else{
                            $scope.error=data.message;
                        }
                    } else {
                        $scope.updateerror=false;
                        $scope.updatesuccess=true;
                        $scope.info = data.message;
                    }
                })
                .error(function () {
                    $scope.updateerror=true;
                    $scope.updatesuccess=false;
                    $scope.error='There was an error, re-try to update!';
                });
        };
    };
    updateCarController.$inject=['$scope','$routeParams','$http','$window','authFactory'];
    angular.module('dataOnMe').controller('updateCarController',updateCarController);
})();