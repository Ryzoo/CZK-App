app.controller('teamStatisticController', function($scope, auth, $rootScope, notify, statistic, request) {
    $rootScope.showContent = false;
    $rootScope.actualStats = [];
    $scope.acutalSelectedGroup = 0;
    $scope.acutalSelectedGroupTest = []
    var fullTeamScore = 0;
    var matchTeamScore = 0;

    $scope.initTeamStats = function() {
        request.backend('getUserFromTeam', { tmid: $rootScope.user.tmid }, function(data) {
            var allPersonsId = [];
            var matchPersonsId = [];
            var fullPersonId = [];
            for (var i = 0; i < data.length; i++) {
                allPersonsId.push({ usid: data[i].usid, userName: data[i].firstname + ' ' + data[i].lastname });
                fullPersonId.push(data[i].usid);
                if (data[i].pos_x >= 0 && data[i].pos_y >= 0) {
                    matchPersonsId.push(data[i].usid);
                }
            }
            fullTeamScore = statistic.getTeamForm(fullPersonId);
            matchTeamScore = statistic.getTeamForm(matchPersonsId, true);
            statistic.getTeamStats(allPersonsId, function() {
                $rootScope.$apply(function() {
                    $rootScope.showContent = true;
                });
                $('#selectPotential').html('');
                $('#selectPotential').append("<option value='' disabled selected>Grupy testowe</option>");
                for (var i = 0; i < $rootScope.actualStats.length; i++) {
                    $('#selectPotential').append("<option value='" + i + "'>" + $rootScope.actualStats[i].name + "</option>");
                }
                $('select').material_select();

                initChartMin();
            });
        });
    }

    $(document).off('change', '#selectPotential');
    $(document).on('change', '#selectPotential', function() {
        $scope.$apply(function() {
            $scope.acutalSelectedGroup = $("#selectPotential").val();
            console.log($rootScope.actualStats);
            $scope.acutalSelectedGroupTest = $rootScope.actualStats[$scope.acutalSelectedGroup];
        });
        $('.collapsible').collapsible();
        $scope.initChart();
    });

    function initChartMin() {
        setTimeout(function() {
            data = [];
            data.push('wynik');
            data.push(fullTeamScore);
            var chart = c3.generate({
                bindto: "#fullTeamForm",
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
                    height: 90
                }
            });
            data = [];
            data.push('wynik');
            data.push(matchTeamScore);
            var chart1 = c3.generate({
                bindto: "#actualTeamForm",
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
                    height: 90
                }
            });
        }, 50);
    }

    $scope.initChart = function() {
        setTimeout(function() {
            if ($scope.acutalSelectedGroupTest) {
                var data = [];
                var label = [];
                data.push('Procentowe wyniki');
                if ($scope.acutalSelectedGroupTest.users != null) {
                    for (var j = 0; j < $scope.acutalSelectedGroupTest.users.length; j++) {
                        data.push($scope.acutalSelectedGroupTest.users[j].score);
                        label.push($scope.acutalSelectedGroupTest.users[j].name);
                    }
                    var chart = c3.generate({
                        bindto: '#chart-main',
                        data: {
                            columns: [
                                data
                            ],
                            type: 'bar'
                        },
                        axis: {
                            x: {
                                type: 'category',
                                categories: label,
                                tick: {
                                    rotate: 90,
                                    multiline: false
                                }
                            },
                            y: {
                                max: 90,
                                min: 10,
                            }
                        }
                    });

                }
            }
        }, 50);
    }

});