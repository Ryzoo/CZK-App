app.controller('usersStatisticController', function($scope, auth, $rootScope, notify, statistic) {
    $rootScope.showContent = false;
    $scope.showPreLoad = true;
    $rootScope.actualStats = [];
    $scope.acutalSelectedGroup = 0;
    $scope.acutalSelectedGroupTest = []
    $scope.dataViewAsTable = true;
    $scope.acutalSelectedUserId = '';
    $scope.showTestAndType = false;

    $scope.initUsersStats = function() {
        getAllPlayers();
    }

    $('#selectUserToStat').on('change', function() {
        $scope.showTestAndType = false;
        $scope.acutalSelectedUserId = $(this).val();

        statistic.getStats($scope.acutalSelectedUserId, function() {
            $rootScope.showContent = true;
            $('#selectPotential').html('');
            $('#selectPotential').append("<option value='' disabled>Grupy testowe</option>");
            for (var i = 0; i < $rootScope.actualStats.length; i++) {

                if ($rootScope.actualStats.length - 1 == i) {
                    $('#selectPotential').append("<option value='" + i + "'selected>" + $rootScope.actualStats[i].name + "</option>");
                } else {
                    $('#selectPotential').append("<option value='" + i + "'>" + $rootScope.actualStats[i].name + "</option>");
                }

            }
            $('select').material_select();
            $scope.showTestAndType = true;
            setTimeout(changePotential, 100);
        });


    });

    $('#selectPotential').on('change', function() {
        changePotential();
    });

    function changePotential() {
        $scope.showPreLoad = false;
        $scope.$apply(function() {
            $scope.acutalSelectedGroup = $("#selectPotential").val();
            $scope.acutalSelectedGroupTest = $rootScope.actualStats[$scope.acutalSelectedGroup].tests;
        });
        $('.collapsible').collapsible();
        $scope.initChart();
        initPercentChart();
        initSummaryChart();
        if ($rootScope.actualStats[$scope.acutalSelectedGroup].tests && $rootScope.actualStats[$scope.acutalSelectedGroup].tests[0].name === 'Zestawienie')
            initMainSummary();
    }


    $('#selectDataType').on('change', function() {
        $scope.dataViewAsTable = ($('#selectDataType').val() == 'tabele');
        $scope.initChart();
    });

    $(document).on('click', '.optionsToShow', function() {
        $scope.initChart();
    });

    function initPercentChart() {
        if ($scope.acutalSelectedGroupTest)
            for (var i = 0; i < $scope.acutalSelectedGroupTest.length; i++) {
                if ($scope.acutalSelectedGroupTest[i].id != undefined) {
                    var data = [];
                    data.push('wynik');
                    data.push($scope.acutalSelectedGroupTest[i].percentLastScore);
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

    function initMainSummary() {
        if ($scope.acutalSelectedGroupTest) {
            var data = [];
            data.push('wynik');
            data.push(($rootScope.actualStats[$scope.acutalSelectedGroup].summaryScore / $rootScope.actualStats[$scope.acutalSelectedGroup].maxSummaryScore) * 100);
            var chart = c3.generate({
                bindto: "#main-summary-chart-",
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

            var data = [];
            data.push('procentowy_wynik');
            for (var i = 0; i < $rootScope.actualStats[$scope.acutalSelectedGroup].testScore.length; i++) {
                data.push(($rootScope.actualStats[$scope.acutalSelectedGroup].testScore[i].score / $rootScope.actualStats[$scope.acutalSelectedGroup].testScore[i].maxScore) * 100);
            }
            var xAxis = [];
            for (var i = 0; i < $rootScope.actualStats[$scope.acutalSelectedGroup].testScore.length; i++) {
                xAxis.push($rootScope.actualStats[$scope.acutalSelectedGroup].testScore[i].name);
            }

            var chart = c3.generate({
                bindto: "#main-summary-chart-all-",
                data: {
                    columns: [
                        data
                    ],
                    types: {
                        procentowy_wynik: 'bar',
                    }
                },
                axis: {
                    rotated: true,
                    x: {
                        type: 'category',
                        categories: xAxis
                    },
                    y: {
                        max: 90,
                        min: 10,
                    }
                }
            });
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
                                        format: '%Y/%m/%d %H:%M:%S',
                                        rotate: 90,
                                        multiline: false
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

    function getAllPlayers() {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getAllPlayers';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.users = msg.data;
                    for (key in msg.data) {
                        if (msg.data[key].roleName == 'ZAWODNIK') {
                            $('#selectUserToStat').append('<option value="' + msg.data[key].usid + '">' + msg.data[key].firstname + ' ' + msg.data[key].lastname + '</option>');
                        }
                    }
                    $rootScope.showContent = true;
                    Materialize.updateTextFields();
                    $('select').material_select();
                } else {
                    if (msg.error)
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                }
            },
            error: function(jqXHR, textStatus) {
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }
});