app.controller('myStatsController', function($scope, auth, $rootScope, notify, statistic, request) {
    $rootScope.showContent = false;
    $scope.showPreLoad = true;
    $rootScope.actualStats = [];
    $scope.acutalSelectedGroup = 0;
    $scope.acutalSelectedGroupTest = []
    $scope.dataViewAsTable = true;

    $scope.initMyStats = function() {
        request.backend('getStats', { usid: $rootScope.user.id, tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.showContent = true;
                $rootScope.actualStats = data.potential;
                $scope.userForm = data.form
            });
            $('#selectPotential').html('');
            $('#selectPotential').append("<option value='' disabled selected>Grupy testowe</option>");
            if ($rootScope.actualStats) {
                for (var i = 0; i < $rootScope.actualStats.length; i++) {
                    $('#selectPotential').append("<option value='" + i + "'>" + $rootScope.actualStats[i].name + "</option>");
                }
            }
            $('select').material_select();
            $scope.showTestAndType = true;
            $rootScope.showContent = true;
            initMainSummary();

        });
    }

    function initMainSummary() {
        var data = [];
        data.push('wynik');
        data.push($scope.userForm);
        var chart = c3.generate({
            bindto: "#main-summary-chart",
            data: {
                columns: [
                    data
                ],
                type: 'gauge',
            },
            gauge: {},
            color: {
                pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
                threshold: {
                    values: [30, 60, 90, 100]
                }
            },
            size: {
                width: 200,
                height: 100,
            }
        });
    }

    $(document).off('click', '.optionsToShow');
    $(document).on('click', '.optionsToShow', function() {
        $scope.initChart();
    });

    $(document).off('change', '#selectPotential');
    $(document).on('change', '#selectPotential', function() {
        $scope.showPreLoad = false;
        $scope.$apply(function() {
            $scope.acutalSelectedGroup = $("#selectPotential").val();
            $scope.acutalSelectedGroupTest = $rootScope.actualStats[$scope.acutalSelectedGroup].tests;
        })
        $('.collapsible').collapsible();
        $scope.initChart();
        setTimeout(function() {
            initPercentChart();
            initSummaryChart();
        }, 50);

    });

    $(document).off('change', '#selectDataType');
    $(document).on('change', "#selectDataType", function() {
        $scope.dataViewAsTable = ($('#selectDataType').val() == 'tabele');
        $scope.initChart();
    });

    function initPercentChart() {
        if ($scope.acutalSelectedGroupTest)
            for (var i = 0; i < $scope.acutalSelectedGroupTest.length; i++) {
                if ($scope.acutalSelectedGroupTest[i].id != undefined) {
                    var data = [];
                    data.push('wynik');
                    data.push($scope.acutalSelectedGroupTest[i].summary);
                    var chart = c3.generate({
                        bindto: '#chart-percent-' + $scope.acutalSelectedGroupTest[i].id,
                        data: {
                            columns: [
                                data
                            ],
                            type: 'gauge',
                        },
                        gauge: {},
                        color: {
                            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
                            threshold: {
                                values: [30, 60, 90, 100]
                            }
                        },
                        size: {
                            height: 40
                        }
                    });
                }
            }
    }

    function initSummaryChart() {
        if ($scope.acutalSelectedGroupTest) {
            var data = [];
            data.push('wynik');
            var testsCount = $scope.acutalSelectedGroupTest.length - 1;
            var percentSummary = 0;
            if ($scope.acutalSelectedGroupTest[testsCount].actual != 0)
                var percentSummary = $scope.acutalSelectedGroupTest[testsCount].actual / $scope.acutalSelectedGroupTest[testsCount].max;
            percentSummary = parseFloat(percentSummary) * 100;
            data.push(percentSummary);
            var chart = c3.generate({
                bindto: "#summary-chart-",
                data: {
                    columns: [
                        data
                    ],
                    type: 'gauge',
                },
                gauge: {},
                color: {
                    pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
                    threshold: {
                        values: [30, 60, 90, 100]
                    }
                },
                size: {
                    height: 180
                }
            });
        }
    }

    $scope.initChart = function() {
        if (!$scope.dataViewAsTable && $scope.acutalSelectedGroupTest) {
            setTimeout(function() {
                for (var i = 0; i < $scope.acutalSelectedGroupTest.length; i++) {
                    var data = [];
                    var date = [];
                    date.push('x');
                    data.push('Wyniki');
                    if ($scope.acutalSelectedGroupTest[i].scores != null) {
                        for (var j = 0; j < $scope.acutalSelectedGroupTest[i].scores.length; j++) {
                            data.push($scope.acutalSelectedGroupTest[i].scores[j].wynik);
                            date.push(new Date($scope.acutalSelectedGroupTest[i].scores[j].data));
                        }
                        var chart = c3.generate({
                            bindto: '#chart-' + $scope.acutalSelectedGroupTest[i].id,
                            data: {
                                x: 'x',
                                columns: [
                                    date,
                                    data
                                ],
                                type: 'spline'
                            },
                            axis: {
                                x: {
                                    type: 'timeseries',
                                    localtime: false,
                                    tick: {
                                        format: '%Y/%m/%d'
                                    }
                                }
                            },
                            width: 50,
                            zoom: {
                                enabled: true
                            }
                        });

                    }
                }
            }, 50);
        }
    }
});