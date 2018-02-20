app.controller('teamStatisticController', function($scope, auth, $rootScope, notify, statistic, request) {
    $rootScope.showContent = false;
    $rootScope.actualStats = [];
    $rootScope.teamCategorySummary = [];
    $rootScope.teamMatchCategorySummary = [];
    $scope.showTestSelect = false;
    var fullTeamScore = 0;
    var matchTeamScore = 0;
    var mainChartToCheck = null;
    var colorIndex = 0;
    var selectedTestCategory = -1;
    dataToChartTestInCategory = [];
    var testChart = null;
    $(document).ready(function() {
        var wSize = $(window).width();
        if (wSize <= 768) {
            $(".adw").each(function() {
                $(this).removeClass("adwWith");
                $(this).addClass("adwWithout");
            });
        } else {
            $(".adw").each(function() {
                $(this).removeClass("adwWithout");
                $(this).addClass("adwWith");
            });
        }
    });
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
                            $('#categoryTestSelect').html('');
                            $('#categoryTestSelect').append("<option value='' disabled selected>Wybierz kategorię testów</option>");
                            for (var j = 0; j < $rootScope.actualStats[0].data.potential.length; j++) {
                                var testLabel = $rootScope.actualStats[0].data.potential[j].name;
                                var score = 0;
                                if ($rootScope.actualStats[0].data.potential[j].tests && $rootScope.actualStats[0].data.potential[j].tests.length > 0)
                                    $('#categoryTestSelect').append("<option value='" + j + "'>" + testLabel + "</option>");
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


    $(document).off("change", "#categoryTestSelect");
    $(document).on("change", "#categoryTestSelect", function() {
        const categoryId = $(this).val();
        selectedTestCategory = categoryId;
        $scope.showTestSelect = true;
        $('#testSelect').html('');
        $('#testSelect').append("<option value='' disabled selected>Wybierz test</option>");

        for (var j = 0; j < $rootScope.actualStats[0].data.potential[categoryId].tests.length; j++) {
            var testLabel = $rootScope.actualStats[0].data.potential[categoryId].tests[j].name;
            $('#testSelect').append("<option value='" + j + "'>" + testLabel + "</option>");
        }

        setTimeout(function() {
            M.updateTextFields();
            $('select').formSelect();
        }, 500);
    });

    $(document).off("change", "#testSelect");
    $(document).on("change", "#testSelect", function() {
        const testId = $(this).val();
        var data = [{
            label: $rootScope.actualStats[0].data.potential[selectedTestCategory].tests[testId].name,
            backgroundColor: getRandomColor(),
            data: []
        }];
        var label = [];

        for (var j = 0; j < $rootScope.actualStats.length; j++) {
            label.push($rootScope.actualStats[j].userName);
            var score = $rootScope.actualStats[j].data.potential[selectedTestCategory].tests[testId].summary;
            data[0].data.push(score);
        }

        if (!testChart || testChart == null) {
            testChart = new Chart($('#testChart'), {
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
            testChart.data.labels = label;
            testChart.data.datasets = data;
            testChart.update();
        }

    });

    function getRandomColor() {
        var list = [
            '#DAF7A6',
            '#FFC300',
            '#FF5733',
            "#C70039",
            "#581845"
        ];
        colorIndex++;
        if (colorIndex >= list.length) colorIndex = 0;
        return list[colorIndex];
    }

    function initChartMin() {
        var chart = new Chart($('#fullTeamForm'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [fullTeamScore, 100 - fullTeamScore],
                    backgroundColor: [
                        '#ec1800',
                        '#4e4e4e'
                    ]
                }],
                labels: [
                    'Poziom całej drużyny',
                    'Braki do maksimum'
                ]
            },
            options: {
                tooltips: {
                    callbacks: {
                        afterLabel: (item)=>{ return `%`},
                    }
                },
            }
        });

        var chart = new Chart($('#actualTeamForm'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [matchTeamScore, 100 - matchTeamScore],
                    backgroundColor: [
                        '#ec1800',
                        '#4e4e4e'
                    ]
                }],
                labels: [
                    'Poziom składu meczowego',
                    'Braki do maksimum'
                ]
            },
            options: {
                tooltips: {
                    callbacks: {
                        afterLabel: (item)=>{ return `%`},
                    }
                },
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
                    },
                    tooltips: {
                        callbacks: {
                            afterLabel: (item)=>{ return `%`},
                        }
                    },
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
                    },
                    tooltips: {
                        callbacks: {
                            afterLabel: (item)=>{ return `%`},
                        }
                    },
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
                        tooltips: {
                            callbacks: {
                                afterLabel: (item)=>{ return `%`},
                            }
                        },
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