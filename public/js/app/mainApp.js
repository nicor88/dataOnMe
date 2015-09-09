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