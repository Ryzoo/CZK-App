app.controller('teamStatisticController', function($scope, auth, $rootScope, notify, statistic) {
    $rootScope.showContent = false;
    $rootScope.actualStats = [];
    $scope.acutalSelectedGroup = 0;
    $scope.acutalSelectedGroupTest = []
    var fullTeamScore = 0;
    var matchTeamScore = 0;

    $scope.initTeamStats = function() {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getUserFromTeam';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success && msg.data) {
                    var allPersonsId = [];
                    var matchPersonsId = [];
                    var fullPersonId = [];
                    for (var i = 0; i < msg.data.length; i++) {
                        allPersonsId.push({ usid: msg.data[i].usid, userName: msg.data[i].firstname + ' ' + msg.data[i].lastname });
                        fullPersonId.push(msg.data[i].usid);
                        if (msg.data[i].posname != 'Lawka') {
                            matchPersonsId.push(msg.data[i].usid);
                        }
                    }
                    fullTeamScore = statistic.getTeamForm(fullPersonId);
                    matchTeamScore = statistic.getTeamForm(matchPersonsId);

                    initChartMin();

                    statistic.getTeamStats(allPersonsId, function() {
                        $rootScope.showContent = true;
                        $('#selectPotential').html('');
                        $('#selectPotential').append("<option value='' disabled selected>Grupy testowe</option>");
                        for (var i = 0; i < $rootScope.actualStats.length - 1; i++) {
                            $('#selectPotential').append("<option value='" + i + "'>" + $rootScope.actualStats[i].name + "</option>");
                        }
                        $('select').material_select();
                    });
                } else {
                    console.log(msg.error);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety coś poszło źle lub brak wyników',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety coś poszło źle',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });

    }

    $('#selectPotential').on('change', function() {
        $scope.$apply(function() {
            $scope.acutalSelectedGroup = $("#selectPotential").val();
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
            var chart = c3.generate({
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
        }, 300);
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
        }, 300);
    }

});