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
                    }
                    ,labels: {
                        rotation: -90,
                        style: {
                            fontSize: '10px',
                            fontFamily: 'Arial'
                        }
                    },categories: xCategories
                },
                tooltip: {
                    pointFormat: '{point.y:.2f} Km/l'
                },
                yAxis: { title: { text: yAxisLabel } },
                series: chart_series,
                options: {
                    exporting: {
                        enabled: false
                    } ,
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
                    }
                    /*,exporting: {
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
                            ,back: {
                             text: 'Back',
                             _titleKey: "back",
                             onclick: function() {
                                console.log('clicked back');
                                }
                             }
                             /!*,refresh: {
                                text: 'Refresh',
                                _titleKey: "refresh",
                                onclick: function() {
                                    console.log('clicked refresh');
                                }
                             }*!/
                        }
                    }*/
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
                    text: subtitle
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
