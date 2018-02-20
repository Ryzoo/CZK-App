app.controller('teamsMenagerController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.teams = [];
    $scope.teamMasters = [];
    $scope.masters = [];

    $scope.showPlayerNow = false;
    $scope.showPreLoad = false;
    $scope.personShow = false;

    $scope.actualSelectedTeamId = -1;

    $scope.openCard = function(name) {
        $('#' + name).toggle('blind', null, 'fast');
        $scope.personShow = !$scope.personShow;
    }

    $scope.initTeams = function() {
        getAllTeams();
        getAllMaster();
    }

    function getAllMaster() {
        request.backend('getAllMaster', {}, function(data) {
            $scope.$apply(function() {
                $scope.showContent = true;
                $scope.masters = data;
                for (var i = 0; i < data.length; i++) {
                    $('#mastersSelect').append("<option value='" + data[i].usid + "'>" + data[i].firstname + " " + data[i].lastname + "</option>");
                }
                $('select').formSelect();

            });
        });
    }

    function getAllTeams() {
        request.backend('getAllTeams', {}, function(data) {
            $scope.$apply(function() {
                $scope.teams = data;
            });
        });
    }

    function getAllMastersFromTeam(id, functionSuccess) {
        $scope.actualSelectedTeamId = id;
        request.backend('getAllMastersFromTeam', { tmid: id }, function(data) {
            $scope.teamMasters = [];
            $scope.$apply(function() {
                $scope.teamMasters = data;
            });
            functionSuccess();
        });
    }

    $scope.showThisTeam = function(id) {
        $scope.showPreLoad = true;
        $scope.showPlayerNow = false;
        getAllMastersFromTeam(id, function() {
            $scope.$apply(function() {
                $scope.showPreLoad = false;
                $scope.showPlayerNow = true;
            });
        });
    }

    $scope.deleteTeam = function(id) {

        $rootScope.showModalWindow("Usunięcie drużyny", function() {
            request.backend('deleteTeam', { id: id }, function() {
                getAllTeams();
                $scope.$apply(function() {
                    $scope.showPlayerNow = false;
                });
            }, 'Udało się usunąc drużynę wraz z zawartością');
        });

    }

    $scope.addTeam = function() {
        var name = $('#teamName').val();
        if (name.length < 3) {
            notify.localNotify('Walidacja', "Wpisz dłuższą nazwę");
            return;
        }
        var weight = Number.isInteger(parseInt($('#teamWeight').val())) ? parseInt($('#teamWeight').val()) : 999;
        request.backend('addTeam', { name: name, weight: weight }, function(data) {
            getAllTeams();
            request.backend('getTeams', {}, function(data) {
                if (data.length == 0) {
                    notify.localNotify('Uwaga', "Twoje konto będzie ograniczone dopóki nie zostaniesz przypisany do drużyny");
                } else {
                    $('#teamSelect').html('');
                    $('#teamSelect').append("<option value='' disabled> Wybierz drużynę </option>");
                    for (var i = 0; i < data.length; i++) {
                        $('#teamSelect').append("<option value='" + data[i].tmid + "'" + (i == 0 ? 'selected' : '') + ">" + data[i].name + "</option>");
                    }
                    if (data[0] != null && data[0].tmid != null) $rootScope.user.tmid = data[0].tmid;
                    setInterval(function() {
                        notify.getNew();
                    }, 2000);
                }
                $('select').formSelect();

            });
        }, "Dodano nową drużynę, możesz przydzielić teraz trenerów");
    }

    $scope.deleteMaster = function(id) {

        $rootScope.showModalWindow("Usunięcie trenera z drużyny", function() {
            request.backend('deleteMasterFromTeam', { mid: id, tmid: $scope.actualSelectedTeamId }, function(data) {
                $scope.showThisTeam($scope.actualSelectedTeamId);
                var actualTeamName = '';
                for (var index = 0; index < $scope.teams.length; index++) {
                    if ($scope.teams[index].id == $scope.actualSelectedTeamId) {
                        actualTeamName = $scope.teams[index].name
                    }
                }
                notify.addNew(new notify.Notification("Zostałeś usunięty z drużyny: " + actualTeamName, [id], ""));
            }, 'Udało się usunąc trenera z danej drużyny');
        });

    }

    $scope.addTeamMaster = function() {
        var mid = $('#mastersSelect').val();
        if (!mid || mid < 0) {
            notify.localNotify('Bład', 'Wybierz trenera do dodania');
            return;
        }

        request.backend('addMasterToTeam', { mid: mid, tmid: $scope.actualSelectedTeamId }, function(data) {
            $scope.showThisTeam($scope.actualSelectedTeamId);
            var actualTeamName = '';
            for (var index = 0; index < $scope.teams.length; index++) {
                if ($scope.teams[index].id == $scope.actualSelectedTeamId) {
                    actualTeamName = $scope.teams[index].name
                }
            }
            notify.addNew(new notify.Notification("Przypisano Cię do nowej drużyny: " + actualTeamName, [mid], ""));
        }, 'Dodano trenera do drużyny');

    }

    $(document).off("change", ".changeWeight");
    $(document).on("change", ".changeWeight", function() {
        var idTeam = $(this).attr('id').split("-")[1];
        var weight = parseInt($(this).val());
        if (Number.isInteger(weight) && weight <= 999 && weight >= 0) {
            request.backend('changeWeightTeam', { tmid: idTeam, weight: weight }, function(data) {
                getAllTeams();
            }, "Zmieniono pozycję pomyślnie");
        } else {
            notify.localNotify('Walidacja', "Wpisz liczbę całkowitą z przedzialu 0 - 999");
        }
    });

});