(function(){
    var insertRefuellingController= function($scope,$routeParams,$http,$q,$window,authFactory) {
        authFactory.isAuth()
            .success(function(data){
                if(!data.logged) $window.location='/login';
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });

        var carId=$routeParams.carId;
        var now=new Date();
        $scope.inserterror=false;
        $scope.insertsuccess=false;
        $scope.onlyUpdate=false;
        $scope.formData = {};
        $scope.updateData = {};
        var initInsertRefuelling=function(){
            $scope.paymentsType=['Cash','Bancomat','Credit Card'];
            $scope.formData.paymentType='Cash';
            $http.get("car/"+carId+"?date="+now.toISOString(),{cache: false})
                .success(function (car) {
                    if(car.length==1){
                        car=car[0];
                        $scope.formData.fueltype=car.fuel;
                    }
                });
        };
        initInsertRefuelling();

        $http.get("lastrefuelling/"+carId+"?date="+now.toISOString(),{cache: false})
            .success(function (refuelling) {
                if(refuelling.length===0){
                    $scope.firstInsert=true;
                    $scope.showUpdateAndInsert=false;
                }else{
                    $scope.firstInsert=false;
                    $scope.showUpdateAndInsert=true;
                    $scope.updateData=refuelling[0];
                    $scope.updateData.liters=$scope.updateData.amount / $scope.updateData.fuelprice;
                }
            });
        $scope.insertForm = function() {
            $scope.formData.carId=carId;
            $scope.formData.date=new Date();

            $http({
                method  : 'POST',
                url     : 'insertrefuelling',
                data    : $.param($scope.formData),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded','Cache-Control' : 'no-cache' }  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function(data) {
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
                        $scope.info=data.message;
                        //Switch on update form only
                        $http.get("lastrefuelling/"+carId,{cache: false})
                            .success(function (refuelling) {
                                if(refuelling.length===0){
                                    $scope.firstInsert=true;
                                    $scope.showUpdateAndInsert=false;
                                }else{
                                    $scope.firstInsert=false;
                                    $scope.showUpdateAndInsert=true;
                                    $scope.formData = {};
                                    initInsertRefuelling();
                                    $scope.updateData=refuelling[0];
                                    $scope.updateData.liters=$scope.updateData.amount / $scope.updateData.fuelprice;
                                }
                            });
                    }
                })
                .error(function () {
                    $scope.inserterror=true;
                    $scope.insertsuccess=false;
                    $scope.error='There was an error, re-try to insert!';
                });
        };
        $scope.updateAndInsertForm = function() {
            $scope.formData.carId=carId;
            $scope.formData.date=new Date();
            $scope.formData.liters=$scope.formData.amount / $scope.formData.fuelprice;
            $scope.updateData.liters=$scope.updateData.amount / $scope.updateData.fuelprice;
            $scope.updateData.consumation=$scope.updateData.kms/$scope.updateData.liters;
            $scope.updateData.lastUpdate=new Date();
            var postData=$http({method  : 'POST',url:'updaterefuelling/'+$scope.updateData._id,data:$.param($scope.updateData),headers : { 'Content-Type': 'application/x-www-form-urlencoded','Cache-Control' : 'no-cache' }});
            var insertData=$http({method  : 'POST',url:'insertrefuelling',data:$.param($scope.formData),headers : { 'Content-Type': 'application/x-www-form-urlencoded','Cache-Control' : 'no-cache' }});

            $q.all([postData,insertData]).then(function(result) {
                var updateResponse=result[0].data;
                var insertResponse=result[1].data;
                if(updateResponse.success && insertResponse.success){
                    $scope.firstInsert=false;
                    $scope.showUpdateAndInsert=false;
                    $scope.insertsuccess=true;
                    $scope.info='Update and new insert correct!';

                }else if(updateResponse.success){
                    $scope.firstInsert=false;
                    $scope.showUpdateAndInsert=false;
                    $scope.insertsuccess=true;
                    $scope.info='Update correct!';
                    $scope.inserterror=true;
                    $scope.error='Error trying to insert new Refuelling!';
                }else if(insertResponse.success){
                    $scope.firstInsert=false;
                    $scope.showUpdateAndInsert=false;
                    $scope.inserterror=true;
                    $scope.error='Error trying to update Refuelling';
                    $scope.onlyUpdate=true;
                    $http.get("lastrefuellings/"+carId)
                        .success(function (refuellings) {
                            $scope.updateData=refuellings[1];
                            $scope.updateData.liters=$scope.updateData.amount / $scope.updateData.fuelprice;
                        });
                }
            });
        };
        $scope.updateForm = function() {
            $scope.updateData.liters=$scope.updateData.amount / $scope.updateData.fuelprice;
            $scope.updateData.consumation=$scope.updateData.kms/$scope.updateData.liters;
            $scope.updateData.lastUpdate=new Date();
            $http({method  : 'POST',url:'updaterefuelling/'+$scope.updateData._id,data:$.param($scope.updateData),headers : { 'Content-Type': 'application/x-www-form-urlencoded','Cache-Control' : 'no-cache'}})
                .success(function(data){
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
                        $scope.info=data.message;
                    }
                });
        };

    };
    insertRefuellingController.$inject=['$scope','$routeParams','$http','$q','$window','authFactory'];
    angular.module('dataOnMe').controller('insertRefuellingController',insertRefuellingController);
})();