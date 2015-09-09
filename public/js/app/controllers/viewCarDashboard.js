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