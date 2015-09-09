var app = angular.module('dataOnMe', ['ngRoute','highcharts-ng','ui.bootstrap']);
(function() {
    var routing = function ($routeProvider) {
        $routeProvider
            //MAIN PAGE
            .when('/', {
                templateUrl: '../fuelConsumationViews/viewCars.html',
                controller: 'viewCarsController'
            })
            //USER update
            .when('/updateuserdata', {
                templateUrl: '../dataOnMeViews/updateUserData.html',
                controller: 'updateUserController'
            })
            //Car CRUD
            .when('/fuelconsumation/viewcars', {
                templateUrl: '../fuelConsumationViews/viewCars.html',
                controller: 'viewCarsController'
            })
            .when('/fuelconsumation/insertcar', {
                templateUrl: '../fuelConsumationViews/insertCar.html',
                controller: 'insertCarController'
            })
            .when('/fuelconsumation/updatecar/:carId', {
                templateUrl: '../fuelConsumationViews/updateCar.html',
                controller: 'updateCarController'
            })
            .when('/fuelconsumation/removecar/:carId', {
                templateUrl: '../fuelConsumationViews/removeCar.html',
                controller: 'removeCarController'
            })
            //Refuelling CRUD
            .when('/fuelconsumation/insertrefuelling/:carId',{
                templateUrl : '../fuelConsumationViews/insertRefuelling.html',
                controller  : 'insertRefuellingController'
            })
            //Data Visualization
            .when('/fuelconsumation/viewcardata/:carId',{
                templateUrl : '../fuelConsumationViews/viewCarData.html',
                controller  : 'viewCarDataController'
            })
            .when('/fuelconsumation/viewcarcharts/:carId',{
                templateUrl : '../fuelConsumationViews/viewCarCharts.html',
                controller  : 'viewCarDataController'
            })
            .when('/fuelconsumation/viewcarmonthlydata/:carId/:monthYear',{
                templateUrl : '../fuelConsumationViews/viewCarMonthlyData.html',
                controller  : 'viewCarMonthlyData'
            })
            .when('/fuelconsumation/viewcardashboard/:carId',{
                templateUrl : '../fuelConsumationViews/viewCarDashboard.html',
                controller  : 'viewCarDashboard'
            });

    };
    routing.$inject=['$routeProvider'];
    app.config(routing);

})();
(function(){
    var insertCarController= function($scope,$http,$window) {
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
    insertCarController.$inject=['$scope','$http','$window'];
    angular.module('dataOnMe').controller('insertCarController',insertCarController);
})();
(function(){
    var insertRefuellingController= function($scope,$routeParams,$http,$q,$window) {
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
        $http.get("isAuth?date="+now.toISOString(),{cache: false})
            .success(function (data) {
                if(!data.logged) $window.location='/login';
            });

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
    insertRefuellingController.$inject=['$scope','$routeParams','$http','$q','$window'];
    angular.module('dataOnMe').controller('insertRefuellingController',insertRefuellingController);
})();
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
(function(){
    var updateCarController= function($scope,$routeParams,$http,$window) {
        var carId=$routeParams.carId;
        var now=new Date();
        $scope.updateerror=false;
        $scope.updatesuccess=false;
        $scope.formData = {};

        $http.get("isAuth?date="+now.toISOString(),{cache: false})
            .success(function (data) {
                if(!data.logged) $window.location='/login';
            });

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
    updateCarController.$inject=['$scope','$routeParams','$http','$window'];
    angular.module('dataOnMe').controller('updateCarController',updateCarController);
})();
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
(function(){
    var viewCarDashboard= function($scope,$routeParams,$window,authFactory,carsFactory,refuellingFactory,chartsFactory) {
        var carId=$routeParams.carId;
        var monthsName=chartsFactory.getMonthsByName();
        $scope.showSpinner=true;
        //Redirect user to login page if he's not logged
        authFactory.isAuth()
            .success(function(data){
                if(!data.logged) $window.location='/login';
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });
        //Get car information
        carsFactory.getCar(carId)
            .success(function(data){
                $scope.dashboard_output = 'Dashboard of ';
                $scope.dashboard_output += data[0].model + ' ';
                $scope.dashboard_output += data[0].name + ' ';

            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });
        $scope.onClickBar=function(category) {
            console.log('redirect to: #/fuelconsumation/viewcarmonthlydata/'+carId+'/'+category);
            $window.location='#/fuelconsumation/viewcarmonthlydata/'+carId+'/'+category;
        };
        $scope.createCharts = function(year) {
            refuellingFactory.getMonthlyStatistics(carId, year)
                .success(function (data) {
                    //console.log(year);
                    var months=[];
                    $scope.kms_data = [];
                    $scope.amount_data = [];
                    var consumation_data = [];
                    data.forEach(function (item) {
                        //console.log(item);
                        months.push(monthsName[item.month - 1]+'-'+year);
                        var kms_element = {
                            name: monthsName[item.month - 1]+'-'+year,
                            y: item.kmsTotal
                        };
                        $scope.kms_data.push(kms_element);
                        var amount_element = {
                            name: monthsName[item.month - 1]+'-'+year,
                            y: item.amountTotal
                        };
                        $scope.amount_data.push(amount_element);
                        consumation_data.push(item.avgConsumation);
                    });
                    var totalKmsSerie = [
                        {
                            name: 'Kms: ' ,
                            colorByPoint: true,
                            type: 'pie',
                            data: $scope.kms_data
                        }
                    ];
                    var totalAmountSerie = [
                        {
                            name: 'Total Amount of €',
                            colorByPoint: true,
                            type: 'pie',
                            data: $scope.amount_data
                        }
                    ];

                    var consumationSerie=[{
                        name:'Consumption (Km/l)',
                        color:'#DC143C',
                        data: consumation_data
                    }];

                    $scope.chartConfig1 = chartsFactory.configurePieChart('Kms for each month of ' + year, '','kms',totalKmsSerie,$scope.onClickBar);
                    $scope.chartConfig2 = chartsFactory.configurePieChart('Total Amount of € for each month of ' + year,'', '€', totalAmountSerie,$scope.onClickBar);
                    $scope.chartBarConfig = chartsFactory.configureColumnChart('Average consumption for '+year,'','Months','Km/l','Km/l',months,consumationSerie,$scope.onClickBar);
                    $scope.showSpinner=false;

                })
                .error(function (data, status, heders, config) {
                    //TODO handle error
                });
        };

        refuellingFactory.getYears(carId)
            .success(function(data){
                $scope.years=[];
                data.forEach(function (item) {
                    $scope.years.push(item._id);
                });
                $scope.selectedYear=$scope.years[0];
                $scope.createCharts($scope.selectedYear);
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });

        $scope.updateChart = function () {
            $scope.createCharts($scope.selectedYear);
        };

    };

    viewCarDashboard.$inject=['$scope','$routeParams','$window','authFactory','carsFactory','refuellingFactory','chartsFactory'];
    angular.module('dataOnMe').controller('viewCarDashboard',viewCarDashboard);
})();
(function(){
    var viewCarDataController= function($scope,$rootScope,$routeParams,$http,$window,authFactory,carsFactory,refuellingFactory,chartsFactory) {
        var carId=$routeParams.carId;
        $scope.showSpinner=true;

        authFactory.isAuth()
            .success(function(data){
                if(!data.logged) $window.location='/login';
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });

        //Filters setting
        //TODO init in a specific function
        $scope.reverse=true;
        $scope.sortBy='date';
        $scope.showChart=false;
        $scope.refuellingFilter={
            date:'',
            brand:'',
            city:''
        };
        $scope.sortByField=function(fieldToSort){
            $scope.sortBy=fieldToSort;
            $scope.reverse=!$scope.reverse;
        };

        //Calendar settings
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };


        carsFactory.getCar(carId)
            .success(function(data){
                $scope.chartTitle='Consumation of ' +data[0].model + ' '+ data[0].brand;
            })
            .error(function(data,status,heders,config){
                //TODO handle error
                 });



        $scope.onChangeDate= function(){
            if ($scope.refuellingFilter.date !== undefined){
                $scope.refuellingFilter.date=chartsFactory.formatDate($scope.refuellingFilter.date);
            }
        };

        $scope.filterByDay=function(category) {
            //console.log(category);
            $scope.refuellingFilter.date=chartsFactory.formatDate(category);
            $scope.$apply();
        };

        refuellingFactory.getAllRefuelling(carId)
            .success(function(data){
                $scope.refuellings=[];
                $scope.consumation=[];
                $scope.date=[];
                data.forEach(function(item) {
                    //console.log(item.date +' '+item.consumation+ ' '+item.amount+' '+item.fuelprice+' '+item.liters +' '+item.kms+ ' '+item.brand+' '+item.city+' '+item.address);
                    if(item.consumation !== null && parseFloat(item.consumation)!==0){
                        var city=item.city;
                        if (item.city === undefined) city='';
                        var address= item.address;
                        if (item.address === undefined) address='';
                        var brand=item.brand;
                        if (item.brand === undefined) brand='';
                        var fuelprice=item.fuelprice;
                        if(item.fuelprice === undefined ) fuelprice='';

                        var itemToShow={
                            date: item.date,
                            amount: item.amount,
                            fuelprice:fuelprice,
                            liters: item.liters,
                            kms: item.kms,
                            consumation: item.consumation,
                            brand: brand,
                            city: city,
                            address: address
                        }
                        //$scope.refuellings.push(item);
                        $scope.refuellings.push(itemToShow);
                        //Charts data
                        var date=new Date(item.date);
                        $scope.date.push(date.toDateString());
                        $scope.consumation.push(item.consumation);
                    }
                });
                var chart_series =
                    [{
                        name:'Consumation (Km/l)',
                        type:'area',
                        color:'#DC143C',
                        data: $scope.consumation
                    }];
                $scope.chartConfig = chartsFactory.configureAreaChart($scope.chartTitle,'Days',$scope.date,'Km/l',chart_series,$scope.filterByDay);
                $scope.showSpinner=false;
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });

        /*
         //test auto-update chart
         var updateChart = function() {
         //$scope.chartConfig.series[0].name=' changed at '+ new Date();
         $scope.chartConfig.xAxis.categories.push(new Date());
         $scope.chartConfig.series[0].data.push(Math.random()*10);

         };
         setInterval(function() {
         $scope.$apply(updateChart);
         }, 10000);*/
    };
    viewCarDataController.$inject=[
        '$scope',
        '$rootScope',
        '$routeParams',
        '$http',
        '$window',
        'authFactory',
        'carsFactory',
        'refuellingFactory',
        'chartsFactory'
    ];
    angular.module('dataOnMe').controller('viewCarDataController',viewCarDataController);
})();
(function(){
    var viewCarMonthlyData= function($scope,$routeParams,$window,authFactory,carsFactory,refuellingFactory,chartsFactory) {
        var carId=$routeParams.carId;
        var monthYear=$routeParams.monthYear;
        $scope.carId=carId;
        $scope.monthYear=monthYear;

        $scope.showSpinner=true;

        //Filters setting
        //TODO init in a specific function
        $scope.reverse=true;
        $scope.sortBy='date';
        $scope.showChart=false;
        $scope.refuellingFilter={
            date:'',
            brand:'',
            city:''
        };
        $scope.sortByField=function(fieldToSort){
            $scope.sortBy=fieldToSort;
            $scope.reverse=!$scope.reverse;
        };


        //Redirect user to login page if he's not logged
        authFactory.isAuth()
            .success(function(data){
                if(!data.logged) $window.location='/login';
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });
        //Get car information
        carsFactory.getCar(carId)
            .success(function(data){
                $scope.dashboard_title = 'Dashboard of ';
                $scope.dashboard_title += data[0].model + ' ';
                $scope.dashboard_title += data[0].name + ' ';
                $scope.dashboard_title += monthYear;
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });
        refuellingFactory.getMonthRefuellings(carId,monthYear)
            .success(function(data){
                $scope.refuellings=[];
                $scope.date=[];
                $scope.consumption=[];
                data.forEach(function(item) {
                    //console.log(item.date +' '+item.consumation+ ' '+item.amount+' '+item.fuelprice+' '+item.liters +' '+item.kms+ ' '+item.brand+' '+item.city+' '+item.address);
                    if(item.consumation !== null && parseFloat(item.consumation)!==0){
                        var city=item.city;
                        if (item.city === undefined) city='';
                        var address= item.address;
                        if (item.address === undefined) address='';
                        var brand=item.brand;
                        if (item.brand === undefined) brand='';
                        var fuelprice=item.fuelprice;
                        if(item.fuelprice === undefined ) fuelprice='';

                        var itemToShow={
                            date: item.date,
                            amount: item.amount,
                            fuelprice:fuelprice,
                            liters: item.liters,
                            kms: item.kms,
                            consumation: item.consumation,
                            brand: brand,
                            city: city,
                            address: address
                        }
                        $scope.refuellings.push(itemToShow);

                        //Chart Data
                        var date=new Date(item.date);
                        $scope.date.push(date.toDateString());
                        $scope.consumption.push(item.consumation);
                    }
                    var consumationSerie=[{
                        name:'Consumption (Km/l)',
                        data: $scope.consumption
                    }];
                    $scope.chartLineConfig = chartsFactory.configureLineChart('Consumption for '+monthYear,'','Date','Km/l','Km/l',$scope.date,consumationSerie);
                    $scope.showSpinner=false;
                });
            })
            .error(function(data,status,heders,config){
                //TODO handle error
            });
    };

    viewCarMonthlyData.$inject=['$scope','$routeParams','$window','authFactory','carsFactory','refuellingFactory','chartsFactory'];
    angular.module('dataOnMe').controller('viewCarMonthlyData',viewCarMonthlyData);
})();
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
(function(){
    var chartDirective = function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div></div>',
            scope: {
                config: '='
            },
            link: function (scope, element) {
                var chart;
                var process = function () {
                    var defaultOptions = {
                        chart: { renderTo: element[0] }
                    };
                    var config = angular.extend(defaultOptions, scope.config);
                    chart = new Highcharts.Chart(config);
                };
                process();
                scope.$watch("config.series", function () {
                    process();
                });
                scope.$watch("config.loading", function (loading) {
                    if (!chart) {
                        return;
                    }
                    if (loading) {
                        chart.showLoading();
                    } else {
                        chart.hideLoading();
                    }
                });
            }
        };
    };
    angular.module('dataOnMe').directive('chart',chartDirective);
})();
(function(){
    var authFactory = function($http){
        var factory={};
        factory.isAuth = function (){
            var callTime=new Date();
            return $http.get("isAuth?date="+callTime.toISOString(),{cache: false});
        };
        return factory;
    };
    authFactory.$inject=['$http'];
    angular.module('dataOnMe').factory('authFactory',authFactory);
})();
(function(){
    var carsFactory = function($http){
        var factory={};
        //get all cars for session user
        factory.getCars = function (){
            var callTime=new Date();
            return $http.get("cars?date="+callTime.toISOString(),{cache: false});
        };
        //get a specific car by Id
        factory.getCar = function(carId){
            var callTime=new Date();
            return $http.get("car/"+carId+"?date="+callTime.toISOString(),{cache: false});
        };

        return factory;
    };
    carsFactory.$inject=['$http'];
    angular.module('dataOnMe').factory('carsFactory',carsFactory);
})();
(function(){
    var chartsFactory = function(){
        var factory={};
        factory.isAuth = function (){
            var callTime=new Date();
            return $http.get("isAuth?date="+callTime.toISOString(),{cache: false});
        };

        factory.configureAreaChart = function(title,xAxisLabel,xCategories,yAxisLabel,chart_series,handlePointClick){
            var config = {
                title: {
                    text:  title
                },
                subtitle: {
                    text: 'Last Update: '+ new Date()
                },
                xAxis: {
                    title: {
                        text: xAxisLabel
                    },

                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Arial'
                        }
                    },
                    categories: xCategories
                },
                tooltip: {
                    pointFormat: '{point.y:.2f} Km/l'
                },
                yAxis: { title: { text: yAxisLabel } },
                series: chart_series,
                options: {
                    chart: {
                        zoomType: 'xy'
                        /*,events: {
                         load: function() {
                         setInterval(function() {
                         //console.log('updating something');
                         //var seriesArray = $scope.chartConfig.series[0];
                         //console.log(seriesArray.data);
                         }, 30000);
                         }
                         }*/
                    },
                    plotOptions:{
                        series:{
                            marker:{enabled:true},
                            point: {
                                events: {
                                    click: function () {
                                        handlePointClick(this.category);
                                    }
                                }
                            }
                        }
                    },
                    lang: {
                        back: "Go Back to Previous Chart",
                        refresh: "Refresh Chart"
                    },
                    exporting: {
                        buttons: {
                            contextButton: {
                                enabled: true
                            },
                            exportButton: {
                                enabled:false
                            },
                            printButton: {
                                enabled:false
                            }
                            /*,back: {
                             text: 'Back',
                             _titleKey: "back",
                             onclick: function() {
                             console.log('clicked back');
                             }
                             },
                             refresh: {
                             text: 'Refresh',
                             _titleKey: "refresh",
                             onclick: function() {
                             console.log('clicked refresh');
                             }
                             }*/
                        }
                    }
                },
                credits: {
                    enabled:false
                },
                loading: false
            };
            return config;
        };
        factory.configureColumnChart=function(title,subtitle,xAxisLabel,yAxisLabel,dataUnit,categories_data,data_series,handleClick){
            var config={
                title: {
                    text:  title
                },
                subtitle: {
                    text: 'Last Update: '+ new Date()
                },
                xAxis: {
                    title: {
                        text: xAxisLabel
                    },

                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Arial'
                        }
                    },
                    categories: categories_data
                },
                yAxis: { title: { text: yAxisLabel } },
                series: data_series,
                options: {
                    chart: {
                        zoomType: 'xy',
                        type: 'column'
                    },
                    tooltip: {
                        pointFormat: '{point.y:.2f}'+dataUnit
                    },
                    legend: {
                        enabled: false,
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 100,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: '#FFFFFF',
                        shadow: true
                    },
                    plotOptions:{
                        series:{
                            marker:{enabled:true},
                            point: {
                                events: {
                                    click: function () {
                                        handleClick(this.category);
                                    }
                                }
                            }
                        }
                    },
                    exporting: {
                        buttons: {
                            contextButton: {
                                enabled: true
                            },
                            exportButton: {
                                enabled:false
                            },
                            printButton: {
                                enabled:false
                            }
                        }
                    }
                },
                credits: {
                    enabled:false
                },
                loading: false
            };
            return config;
        };
        factory.configureLineChart=function(title,subtitle,xAxisLabel,yAxisLabel,dataUnit,categories_data,data_series){
            var config={
                title: {
                    text:  title
                },
                subtitle: {
                    text: 'Last Update: '+ new Date()
                },
                xAxis: {
                    title: {
                        text: xAxisLabel
                    },

                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Arial'
                        }
                    },
                    categories: categories_data
                },
                yAxis: { title: { text: yAxisLabel } },
                series: data_series,
                options: {
                    chart: {
                        zoomType: 'xy',
                        type: 'line'
                    },
                    tooltip: {
                        pointFormat: '{point.y:.2f}'+dataUnit
                    },
                    legend: {
                        enabled: false,
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 100,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: '#FFFFFF',
                        shadow: true
                    },
                    plotOptions:{
                        series:{
                            marker:{enabled:true},
                            point: {
                                events: {
                                    click: function () {
                                        console.log(this.category);
                                    }
                                }
                            }
                        }
                    },
                    exporting: {
                        buttons: {
                            contextButton: {
                                enabled: true
                            },
                            exportButton: {
                                enabled:false
                            },
                            printButton: {
                                enabled:false
                            }
                        }
                    }
                },
                credits: {
                    enabled:false
                },
                loading: false
            };
            return config;
        };
        factory.configurePieChart=function(title,subtitle,dataUnit,series_chart,handleClick){
            var config={
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: title
                },
                subtitle: {
                    text: 'Last Update: '+ new Date()
                },
                series: series_chart,
                options: {
                    chart: {
                        zoomType: 'xy'
                    },
                    tooltip: {
                        enabled: true,
                        pointFormat: '<b>{point.y:.1f}</b> '+dataUnit
                    },
                    plotOptions:{
                        series:{
                            marker:{enabled:true},
                            point: {
                                events: {
                                    click: function () {
                                        handleClick(this.name);
                                        console.log(this);
                                    }
                                }
                            }
                        },
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    exporting: {
                        buttons: {
                            contextButton: {
                                enabled: true
                            },
                            exportButton: {
                                enabled:false
                            },
                            printButton: {
                                enabled:false
                            }
                        }
                    }
                },
                credits: {
                    enabled:false
                },
                loading: false
            };
            return config;
        };
        factory.getMonthsByName=function(){
            var monthsName=[
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ];
            return monthsName;
        };

        factory.formatDate=function(date){
            //return date in format yyyy-mm-dd
            //TODO implement a function to handle different format of date
            date = new Date(date);
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            if(month<10) month='0'+month;
            var day=date.getDate();
            if(day<10) day='0'+day;
            return year+'-'+month+'-'+day;
        };

        return factory;
    };

    angular.module('dataOnMe').factory('chartsFactory',chartsFactory);
})();

(function(){
    var refuellingFactory = function($http){
        var factory={};
        factory.getYears = function (carId){
            var callTime=new Date();
            return $http.get('refuellings/years/'+carId+'?date='+callTime.toISOString(),{cache: false});
        };
        factory.getAllRefuelling = function(carId){
            var callTime=new Date();
            return $http.get('refuellings/'+carId+'?date='+callTime.toISOString(),{cache: false});
        };
        factory.getMonthRefuellings = function (carId,monthYear){
            var callTime=new Date();
            return $http.get('refuellings/monthData/'+carId+'/'+monthYear+'?date='+callTime.toISOString(),{cache: false});
        };
        factory.getMonthlyStatistics = function (carId,year){
            var callTime=new Date();
            return $http.get('refuellings/statistics/'+carId+'/'+year+'?date='+callTime.toISOString(),{cache: false});
        };

        return factory;
    };
    refuellingFactory.$inject=['$http'];
    angular.module('dataOnMe').factory('refuellingFactory',refuellingFactory);
})();