app.controller('teammateCompareController', function($scope, auth, $rootScope, notify, statistic, request) {
    $scope.showContent = false;
    $scope.selected1 = false;
    $scope.selected2 = false;
    $scope.selected3 = false;
    $scope.loadStat = true;
    $rootScope.actualStats = [];
    $scope.dataViewAsTable = true;
    $scope.acutalSelectedGroup = 0;
    $scope.notSelectedPerson = true;
    $scope.actualStatGroup = null;
    $scope.actualPotentialGroup = null;

    var allUsers = [];
    var firstUsid = 0;
    var secondUsid = 0;
    var thirdUsid = 0;
    var usidList = [];


    $scope.initTeammate = function() {
        request.backend('getUserFromTeam', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.showContent = true;
            allUsers = data;
            $('#firstUserSelect').html('');
            $('#firstUserSelect').append("<option value='' disabled selected>Zawodnik 1</option>");

            for (var i = 0; i < allUsers.length; i++) {
                var userName = allUsers[i].firstname + ' ' + allUsers[i].lastname;
                $('#firstUserSelect').append("<option value='" + allUsers[i].usid + "'>" + userName + "</option>");
            }

            Materialize.updateTextFields();
            $('select').material_select();
            $('ul.tabs').tabs();
        });
    }

    $scope.showStat = function() {
        $scope.notSelectedPerson = false;
        $("#mainChartContainer").html('');
        usidList = [
            firstUsid, secondUsid
        ];
        if ($scope.selected3) usidList.push(thirdUsid);

        request.backend('getStats', { usid: usidList, tmid: $rootScope.user.tmid, prc:"none" }, function(data) {
            $rootScope.actualStats = data;
            console.log(data);
            addMainChartToPage();
            initMainSummary();
            initMainSummaryRadar();


            $scope.$apply(function() {
                $scope.loadStat = false;
                $('#selectPotential').html('');
                $('#selectPotential').append("<option value='' disabled selected>Kategoria</option>");


                for (let i = 0; i < $rootScope.actualStats.users[0].data.potential.length; i++) {
                    const element = $rootScope.actualStats.users[0].data.potential[i].name;
                    $('#selectPotential').append("<option value='" + i + "'>" + element + "</option>");
                }

                $scope.actualPotentialGroup = [];
                for (let i = 0; i < $rootScope.actualStats.users[0].data.potential.length; i++) {
                    const elName = $rootScope.actualStats.users[0].data.potential[i].name;
                    $scope.actualPotentialGroup.push({
                        name: elName,
                        users: []
                    });
                    for (let x = 0; x < $rootScope.actualStats.users.length; x++) {
                        $scope.actualPotentialGroup[i].users.push($rootScope.actualStats.users[x].data.potential[i].summary);
                    }
                }
            });

            checkStatBest();
            Materialize.updateTextFields();
            $('select').material_select();
            $('ul.tabs').tabs();
        });
    }

    function checkStatBest() {
        $('table tbody tr').each(function() {
            var scoreInElements = $(this).find('.scoreIn');
            if (scoreInElements.legend <= 0) return;
            var maxScore = getMaxScore(scoreInElements);
            scoreInElements.each(function() {
                if (parseFloat($(this).text()) < maxScore) {
                    $(this).find('span').first().remove();
                    $(this).append("<span style='color: red;font-size: 10px;font-weight:600'>" + "-" + (maxScore - parseFloat($(this).text())).toFixed(2) + "</span>");
                } else if (parseFloat($(this).text()) == maxScore) {
                    $(this).css("color", "rgb(22, 193, 22)");
                    $(this).css("font-weight", "600");
                }
            });
        });
    }

    function getMaxScore(elements) {
        var max = 0;
        elements.each(function() {
            if (parseFloat($(this).text()) > max) {
                max = parseFloat($(this).text());
            }
        });
        return max;
    }

    $scope.hideStat = function() {
        $scope.notSelectedPerson = true;
        $scope.loadStat = true;
        $scope.actualStatGroup = [];
        $scope.actualPotentialGroup = [];
    }

    $(document).off('change', '#selectPotential');
    $(document).on('change', '#selectPotential', function() {
        changePotential();
        checkStatBest();
    });

    function changePotential() {
        $scope.showPreLoad = false;
        $scope.$apply(function() {
            $scope.acutalSelectedGroup = $("#selectPotential").val();
            $scope.actualStatGroup = [];
            if($rootScope.actualStats.users[0].data.potential[$scope.acutalSelectedGroup].tests)
            for (let i = 0; i < $rootScope.actualStats.users[0].data.potential[$scope.acutalSelectedGroup].tests.length; i++) {
                const elName = $rootScope.actualStats.users[0].data.potential[$scope.acutalSelectedGroup].tests[i].name;
                $scope.actualStatGroup.push({
                    name: elName,
                    users: []
                });
                for (let x = 0; x < $rootScope.actualStats.users.length; x++) {
                    $scope.actualStatGroup[i].users.push($rootScope.actualStats.users[x].data.potential[$scope.acutalSelectedGroup].tests[i].noPrc + "" + ($rootScope.actualStats.users[x].data.potential[$scope.acutalSelectedGroup].tests[i].unit).substring(0,1)+".");
                }
            }
        });
    }

    $(document).off('change', '#selectDataType');
    $(document).on('change', '#selectDataType', function() {
        $scope.dataViewAsTable = ($('#selectDataType').val() == 'tabele');
    });

    function addMainChartToPage() {
        var elementClass = "col s12 m6";
        if ($scope.selected3) elementClass = "col s12 m4";
        $("#mainChartContainer").html('');
        $("#mainChartContainer").css('max-width', "600px");
        if ($scope.selected3) $("#mainChartContainer").css('max-width', "1000px");
        for (let i = 0; i < ($scope.selected3 ? 3 : 2); i++) {
            var element = '<div class="' + elementClass + '">';
            element += '<canvas class="col s12" id="main-summary-chart-' + i + '"></canvas>';
            element += '<canvas class="col s12" id="main-summary-chart-radar-' + i + '"></canvas>';
            element += '</div>';
            $("#mainChartContainer").append(element);
        }
    }

    function initMainSummary() {
        for (let i = 0; i < ($scope.selected3 ? 3 : 2); i++) {
            var userForm = $rootScope.actualStats.users[i].data.form;
            $('#main-summary-chart-' + i).parent().prepend("<h5>" + $rootScope.actualStats.users[i].userName + "</h5>");
            var chart = new Chart($('#main-summary-chart-' + i), {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [userForm, 100 - userForm],
                        backgroundColor: [
                            '#ec1800',
                            '#4e4e4e'
                        ]
                    }],
                    labels: [
                        'Forma',
                        'Braki'
                    ]
                },
                options:{
                    tooltips: {
                        callbacks: {
                            afterLabel: (item)=>{ return `%`},
                        }
                    },
                }
            });
        }
    }

    function initMainSummaryRadar() {
        for (let i = 0; i < ($scope.selected3 ? 3 : 2); i++) {
            var label = [];
            var dataSe = [];
            for (var j = 0; j < $rootScope.actualStats.users[i].data.potential.length; j++) {
                label.push($rootScope.actualStats.users[i].data.potential[j].name);
                dataSe.push($rootScope.actualStats.users[i].data.potential[j].summary);
            }
            var chart = new Chart($('#main-summary-chart-radar-' + i), {
                type: 'radar',
                data: {
                    datasets: [{
                        label: "Kierunek rozwoju",
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

    $(document).off("change", "#firstUserSelect");
    $(document).on("change", "#firstUserSelect", function() {
        firstUsid = $(this).val();
        $('#secondUserSelect').html('');
        $('#secondUserSelect').append("<option value='' disabled selected>Zawodnik 2</option>");

        for (var i = 0; i < allUsers.length; i++) {
            if (allUsers[i].usid == firstUsid) continue;
            var userName = allUsers[i].firstname + ' ' + allUsers[i].lastname;
            $('#secondUserSelect').append("<option value='" + allUsers[i].usid + "'>" + userName + "</option>");
        }

        Materialize.updateTextFields();
        $('select').material_select();
        $('ul.tabs').tabs();
        $scope.$apply(function() {
            $scope.selected1 = true;
            $scope.selected2 = false;
            $scope.selected3 = false;
        });
    });

    $(document).off("change", "#secondUserSelect");
    $(document).on("change", "#secondUserSelect", function() {
        secondUsid = $(this).val();
        $('#thirdUserSelect').html('');
        $('#thirdUserSelect').append("<option value='' disabled selected>Zawodnik 3</option>");

        for (var i = 0; i < allUsers.length; i++) {
            if (allUsers[i].usid == firstUsid || allUsers[i].usid == secondUsid) continue;
            var userName = allUsers[i].firstname + ' ' + allUsers[i].lastname;
            $('#thirdUserSelect').append("<option value='" + allUsers[i].usid + "'>" + userName + "</option>");
        }

        Materialize.updateTextFields();
        $('select').material_select();
        $('ul.tabs').tabs();
        $scope.$apply(function() {
            $scope.selected2 = true;
            $scope.selected3 = false;
        });
    });

    $(document).off("change", "#thirdUserSelect");
    $(document).on("change", "#thirdUserSelect", function() {
        $scope.$apply(function() {
            $scope.selected3 = true;
        });
        thirdUsid = $(this).val();
    });


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


});