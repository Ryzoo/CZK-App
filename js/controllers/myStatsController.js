app.controller('myStatsController', function($scope, auth, $rootScope, notify, statistic) {
    $rootScope.showContent = false;
    $scope.showPreLoad = true;
    $rootScope.actualStats = [];
    $scope.acutalSelectedGroup = 0;
    $scope.acutalSelectedGroupTest = []
    $scope.dataViewAsTable = true;

    $scope.initMyStats = function() {
        statistic.getStats($rootScope.user.id, function() {
            $('#selectPotential').html('');
            $('#selectPotential').append("<option value='' disabled selected>Grupy testowe</option>");
            for (var i = 0; i < $rootScope.actualStats.length; i++) {
                $('#selectPotential').append("<option value='" + i + "'>" + $rootScope.actualStats[i].name + "</option>");
            }
            $('select').material_select();
            $rootScope.showContent = true;
        });
    }

    $('#selectPotential').on('change', function() {
        $scope.showPreLoad = false;
        $scope.acutalSelectedGroup = $("#selectPotential").val();
        $scope.acutalSelectedGroupTest = $rootScope.actualStats[$scope.acutalSelectedGroup].tests;
        $('.collapsible').collapsible();
        $scope.initChart();
    });

    $('#selectDataType').on('change', function() {
        $scope.dataViewAsTable = ($('#selectDataType').val() == 'tabele');
        $scope.initChart();
    });

    $scope.initChart = function() {
        if (!$scope.dataViewAsTable) {
            setTimeout(function() {
                for (var i = 0; i < $scope.acutalSelectedGroupTest.length; i++) {
                    var data = [];
                    var date = [];
                    date.push('x');
                    data.push('Wyniki');
                    if ($scope.acutalSelectedGroupTest[i].scores != null) {
                        for (var j = 0; j < $scope.acutalSelectedGroupTest[i].scores.length; j++) {
                            data.push($scope.acutalSelectedGroupTest[i].scores[j].wynik);
                            date.push($scope.acutalSelectedGroupTest[i].scores[j].data.split(" ")[0]);
                        }
                        var chart = c3.generate({
                            bindto: '#chart-' + $scope.acutalSelectedGroupTest[i].id,
                            data: {
                                x: 'x',
                                columns: [
                                    date,
                                    data
                                ],
                                type: 'bar'
                            },
                            axis: {
                                x: {
                                    type: 'timeseries',
                                    tick: {
                                        format: '%Y-%m-%d'
                                    }
                                }
                            },
                            width: 50
                        });
                    }
                }
            }, 500);
        }
    }
});