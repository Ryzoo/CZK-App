app.controller('teamStatisticController', function($scope, auth, $rootScope, notify, statistic, request) {
    $rootScope.showContent = false;
    $rootScope.actualStats = [];
    $rootScope.teamCategorySummary = [];
    $rootScope.teamMatchCategorySummary = [];
    var fullTeamScore = 0;
    var matchTeamScore = 0;
    var mainChartToCheck = null;
    var colorIndex = 0;

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

            statistic.getTeamStats(matchPersonsId, function() {
                $rootScope.teamMatchCategorySummary = [];
                if ($rootScope.actualStats) {
                    for (var j = 0; j < $rootScope.actualStats[0].data.potential.length; j++) {
                        var testLabel = $rootScope.actualStats[0].data.potential[j].name;
                        var score = 0;
                        for (var i = 0; i < $rootScope.actualStats.length; i++) {
                            score += $rootScope.actualStats[i].data.potential[j].summary;
                        }
                        score /= $rootScope.actualStats.length;
                        score = Math.round(score);
                        $rootScope.teamMatchCategorySummary.push({
                            name: testLabel,
                            summary: score
                        });
                    }
                }
                statistic.getTeamStats(fullPersonId, function() {
                    $rootScope.$apply(function() {
                        $rootScope.showContent = true;
                        $rootScope.teamCategorySummary = [];
                        if ($rootScope.actualStats) {
                            for (var j = 0; j < $rootScope.actualStats[0].data.potential.length; j++) {
                                var testLabel = $rootScope.actualStats[0].data.potential[j].name;
                                var score = 0;
                                for (var i = 0; i < $rootScope.actualStats.length; i++) {
                                    score += $rootScope.actualStats[i].data.potential[j].summary;
                                }
                                score /= $rootScope.actualStats.length;
                                score = Math.round(score);
                                $rootScope.teamCategorySummary.push({
                                    name: testLabel,
                                    summary: score
                                });
                            }
                        }
                    });
                    initChartMin();
                    $scope.initChart();
                });
            });


        });
    }

    function getRandomColor() {
        var list = [
            '#ff6384',
            '#36a2eb',
            '#00a588',
            "#EF5350",
            "#BA68C8"
        ];
        colorIndex++;
        if (colorIndex > list.length) colorIndex = 0;
        return list[colorIndex];
    }

    function initChartMin() {
        var chart = new Chart($('#fullTeamForm'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [fullTeamScore, 100 - fullTeamScore],
                    backgroundColor: [
                        '#ff6384',
                        '#36a2eb'
                    ]
                }],
                labels: [
                    'Poziom całej drużyny',
                    'Braki do maksimum'
                ]
            }
        });

        var chart = new Chart($('#actualTeamForm'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [matchTeamScore, 100 - matchTeamScore],
                    backgroundColor: [
                        '#ff6384',
                        '#36a2eb'
                    ]
                }],
                labels: [
                    'Poziom składu meczowego',
                    'Braki do maksimum'
                ]
            }
        });

        if ($rootScope.teamCategorySummary.length > 0) {
            var label = [];
            var dataSe = [];
            for (var i = 0; i < $rootScope.teamCategorySummary.length; i++) {
                label.push($rootScope.teamCategorySummary[i].name);
                dataSe.push($rootScope.teamCategorySummary[i].summary);
            }
            var chart = new Chart($('#teamChartRadar'), {
                type: 'radar',
                data: {
                    datasets: [{
                        label: "Predyspozycje drużyny",
                        data: dataSe,
                        backgroundColor: 'rgba(255, 99, 132,0.2)',
                        borderColor: '#ff6384',
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

        if ($rootScope.teamMatchCategorySummary.length > 0) {
            var label = [];
            var dataSe = [];
            for (var i = 0; i < $rootScope.teamMatchCategorySummary.length; i++) {
                label.push($rootScope.teamMatchCategorySummary[i].name);
                dataSe.push($rootScope.teamMatchCategorySummary[i].summary);
            }
            var chart = new Chart($('#teamMatchChartRadar'), {
                type: 'radar',
                data: {
                    datasets: [{
                        label: "Predyspozycje składu meczowego",
                        data: dataSe,
                        backgroundColor: 'rgba(255, 99, 132,0.2)',
                        borderColor: '#ff6384',
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
    }

    $scope.initChart = function() {
        var data = [];
        var label = [];
        if ($rootScope.actualStats) {
            for (var j = 0; j < $rootScope.actualStats.length; j++) {
                label.push($rootScope.actualStats[j].userName);
            }

            for (var j = 0; j < $rootScope.actualStats[0].data.potential.length; j++) {
                var testLabel = $rootScope.actualStats[0].data.potential[j].name;
                var allScore = [];
                for (var i = 0; i < $rootScope.actualStats.length; i++) {
                    allScore.push($rootScope.actualStats[i].data.potential[j].summary);
                }
                data.push({
                    label: testLabel,
                    data: allScore,
                    backgroundColor: getRandomColor()
                });
            }

            if (!mainChartToCheck || mainChartToCheck == null) {
                mainChartToCheck = new Chart($('#chart-main'), {
                    type: 'horizontalBar',
                    data: {
                        datasets: data,
                        labels: label
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    }
                });
            } else {
                mainChartToCheck.data.labels = label;
                mainChartToCheck.data.datasets = data;
                mainChartToCheck.update();
            }

        }
    }

});
