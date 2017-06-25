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