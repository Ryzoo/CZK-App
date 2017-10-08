app.controller('usersStatisticController', function($scope, auth, $rootScope, notify, statistic, request) {
    $rootScope.showContent = false;
    $scope.showPreLoad = true;
    $rootScope.actualStats = [];
    $scope.acutalSelectedGroup = 0;
    $scope.acutalSelectedGroupTest = []
    $scope.dataViewAsTable = true;
    $scope.acutalSelectedUserId = '';
    $scope.showTestAndType = false;
    $scope.userForm = 0;

    $scope.initUsersStats = function() {
        getAllPlayers();
    }

    $(document).off('change', '#selectUserToStat');
    $(document).on('change', '#selectUserToStat', function() {
        $scope.showTestAndType = false;
        $scope.acutalSelectedUserId = $(this).val();

        request.backend('getStats', { usid: $scope.acutalSelectedUserId, tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.showContent = true;
                $rootScope.actualStats = data.potential;
                $scope.userForm = data.form
            });
            $('#selectPotential').html('');
            $('#selectPotential').append("<option value='' disabled>Grupy testowe</option>");
            if ($rootScope.actualStats) {
                for (var i = 0; i < $rootScope.actualStats.length; i++) {
                    if (i == 0) {
                        $('#selectPotential').append("<option value='" + i + "'selected>" + $rootScope.actualStats[i].name + "</option>");
                    } else {
                        $('#selectPotential').append("<option value='" + i + "'>" + $rootScope.actualStats[i].name + "</option>");
                    }
                }
            }
            $('select').material_select();
            $scope.showTestAndType = true;
            setTimeout(changePotential, 100);
        });

    });

    $(document).off('change', '#selectPotential');
    $(document).on('change', '#selectPotential', function() {
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
        initMainSummary();
    }

    $(document).off('change', '#selectDataType');
    $(document).on('change', '#selectDataType', function() {
        $scope.dataViewAsTable = ($('#selectDataType').val() == 'tabele');
        $scope.initChart();
    });

    $(document).off('click', '.optionsToShow');
    $(document).on('click', '.optionsToShow', function() {
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

    function initMainSummary() {
        if ($scope.acutalSelectedGroupTest) {
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
                            date.push(new Date($scope.acutalSelectedGroupTest[i].scores[j].data.replace(/-/g, '/')));
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
                                        format: '%Y / %m / %d',
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
        request.backend('getAllPlayers', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.users = data;
            for (key in data) {
                if (data[key].roleName == 'ZAWODNIK') {
                    $('#selectUserToStat').append('<option value="' + data[key].usid + '">' + data[key].firstname + ' ' + data[key].lastname + '</option>');
                }
            }
            $rootScope.showContent = true;
            Materialize.updateTextFields();
            $('select').material_select();
        });
    }
});