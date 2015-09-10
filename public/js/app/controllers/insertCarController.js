(function(){
    var insertCarController= function($scope,$http,$window,authFactory) {
        authFactory.isAuth()
            .success(function(data){
                if(!data.logged) $window.location='/login';
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });
        var now=new Date();
        $scope.inserterror=false;
        $scope.insertsuccess=false;
        $scope.formData = {};
        $scope.fuelTypes=['Benzin','Diesel','Gas','Methan'];
        $scope.formData.fuel='Benzin';
        $http.get("isAuth?date="+now.toISOString())
            .success(function (data) {
                if(!data.logged) $window.location='/login';
            });

        $scope.processForm = function() {
            $http({
                method  : 'POST',
                url     : 'insertcar',
                data    : $.param($scope.formData),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded','Cache-Control' : 'no-cache'  }  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function(data) {
                    //console.log(data);
                    if (data.error) {
                        $scope.inserterror=true;
                        $scope.insertsuccess=false;
                        if(data.message=='no-auth'){
                            $scope.error='You are not authenticated!';
                            $window.location='/login';
                        }else{
                            $scope.error=data.message;
                        }
                    } else {
                        $scope.inserterror=false;
                        $scope.insertsuccess=true;
                        //$scope.info = data.message;
                        $scope.info = $scope.formData.name + ' inserted!';
                        $scope.formData = {};
                        $window.location='#/fuelconsumation/viewcars';
                    }
                })
                .error(function () {
                    $scope.inserterror=true;
                    $scope.insertsuccess=false;
                    $scope.error='There was an error, re-try to insert!';
                });
        };

    };
    insertCarController.$inject=['$scope','$http','$window','authFactory'];
    angular.module('dataOnMe').controller('insertCarController',insertCarController);
})();