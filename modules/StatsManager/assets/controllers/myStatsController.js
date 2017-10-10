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
            initMainSummaryRadar();
            checkTableScoreProgress();
        });
    }

    function initMainSummary() {
        if ($scope.acutalSelectedGroupTest) {
            var chart = new Chart($('#main-summary-chart'), {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [$scope.userForm, 100 - $scope.userForm],
                        backgroundColor: [
                            '#ec1800',
                            '#4e4e4e'
                        ]
                    }],
                    labels: [
                        'Aktualna forma',
                        'Braki do maksimum'
                    ]
                }
            });
        }
    }

    function initMainSummaryRadar() {
        var label = [];
        var dataSe = [];
        for (var i = 0; i < $rootScope.actualStats.length; i++) {
            label.push($rootScope.actualStats[i].name);
            dataSe.push($rootScope.actualStats[i].summary);
        }
        var chart = new Chart($('#main-summary-chart-radar'), {
            type: 'radar',
            data: {
                datasets: [{
                    label: "Wyniki w poszczególnych kategoriach",
                    data: dataSe,
                    backgroundColor: 'rgba(236, 24, 0, 0.2)',
                    borderColor: '#ec1800',
                }],
                labels: label,
            },
            options: {
                legend: {
                    position: 'top',
                },
                scale: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function checkTableScoreProgress() {
        $('.statTable tbody').each(function() {
            var allTr = $(this).find('tr');
            for (var i = 0; i < allTr.length - 1; i++) {
                var actual = parseFloat($(this).find('tr').eq(i).find('td').eq(0).html());
                var before = parseFloat($(this).find('tr').eq(i + 1).find('td').eq(0).html());
                var progress = actual - before;
                if (progress == 0) continue;
                var word = progress > 0 ? "+" : "-";
                progress = Math.abs(progress);
                progress = progress.toFixed(2);
                $(this).find('tr').eq(i).find('td').eq(0).append("<span class='" + (word == '+' ? "tableProgressElementPositive" : "tableProgressElementNegative") + "'> " + word + " " + progress + "</span>");
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
            initMainSummary();
            checkTableScoreProgress();
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
                    var chart = new Chart($('#chart-percent-' + $scope.acutalSelectedGroupTest[i].id), {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: [$scope.acutalSelectedGroupTest[i].summary, 100 - $scope.acutalSelectedGroupTest[i].summary],
                                backgroundColor: [
                                    '#ec1800',
                                    '#4e4e4e'
                                ]
                            }],
                            labels: [
                                'Aktualna średnia',
                                'Braki do maksimum'
                            ]
                        }
                    });
                }
            }
    }

    $scope.initChart = function() {
        moment.locale('pl');
        if (!$scope.dataViewAsTable && $scope.acutalSelectedGroupTest) {
            for (var i = 0; i < $scope.acutalSelectedGroupTest.length; i++) {
                var data = [];
                var labels = [];
                if ($scope.acutalSelectedGroupTest[i].scores != null) {
                    for (var j = 0; j < $scope.acutalSelectedGroupTest[i].scores.length; j++) {
                        var thisDate = moment($scope.acutalSelectedGroupTest[i].scores[j].data);
                        labels.push(thisDate.format('LL'));
                        data.push({
                            t: thisDate,
                            y: $scope.acutalSelectedGroupTest[i].scores[j].wynik
                        });
                    }
                    var chart = new Chart($('#chart-' + $scope.acutalSelectedGroupTest[i].id), {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: "Wyniki testów",
                                data: data,
                                borderColor: '#ec1800'
                            }],
                            options: {
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        distribution: 'series',
                                        ticks: {
                                            source: 'labels'
                                        }
                                    }]
                                }
                            }
                        }
                    });
                }
            }
        }
    }
});
