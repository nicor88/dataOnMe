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