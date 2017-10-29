app.controller('sectionGetController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.isGetEnabled = false;
    $scope.sectionData = [];
    $scope.sectionApplayer = [];
    $scope.availableSection = [];

    $scope.turnOnSectionGet = function() {
        var minY = parseInt($('#sectionYMin').val());
        var maxY = parseInt($('#sectionYMax').val());
        var description = $('#sectionDesc').val();
        if (minY >= maxY) {
            notify.localNotify("Walidacja", "Maksymalny wiek musi być większy od " + minY);
            return;
        }
        if (!description || description.length <= 10) {
            notify.localNotify("Walidacja", "Wpisz dłuższy opis sekcji ( min. 10 znaków )");
            return;
        }
        request.backend('turnOnSectionGet', { tmid: $rootScope.user.tmid, max: maxY, min: minY, desc: description }, function(data) {
            $scope.$apply(function() {
                $scope.isGetEnabled = true;
                getSectionApplayer();
            })
        });
    }

    $scope.addPersonToTeamApplicant = function(tmid) {
        request.backend('addPersonToTeamApplicant', { usid: $rootScope.user.id, tmid: tmid }, function(data) {}, "Twoja aplikacja została dodana, oczekuj na powiadomienia związane z decyzją");
    }

    $scope.getAvailableSection = function() {
        request.backend('getAvailableSection', { usid: $rootScope.user.id }, function(data) {
            $scope.$apply(function() {
                $scope.availableSection = data;
                $scope.showContent = true;
            });
        });
    }

    $scope.turnOffSectionGet = function() {
        request.backend('turnOffSectionGet', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.isGetEnabled = false;
            });
            var usArray = [];
            for (var index = 0; index < $scope.sectionApplayer.length; index++) {
                usArray.push($scope.sectionApplayer[index].usid);
            }
            notify.addNew(new notify.Notification("Nabór do sekcji " + $rootScope.teamNameStr + " został zakończony. Nie zostałeś przyjęty.", usArray, "#!/sectionGetForPlayer"));
        });
    }

    $scope.getSectionData = function() {
        request.backend('getSectionData', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.sectionData = data;
                $scope.isGetEnabled = $scope.sectionData.isGetEnabled == 1;
                if ($scope.isGetEnabled) {
                    getSectionApplayer();
                }
                $scope.showContent = true;
            });
        });
    }

    $scope.deletePlayerApplay = function(aplId, usid) {
        request.backend('deletePlayerAplay', { tmid: $rootScope.user.tmid, aplId: aplId, usid: usid }, function(data) {
            $scope.$apply(function() {
                $scope.sectionApplayer = data;
            });
            notify.addNew(new notify.Notification("Twoja prośba o dołączenie do sekcji: " + $rootScope.teamNameStr + " została odrzucona", [usid], "#!/sectionGetForPlayer"));
        }, "Pomyślnie usunięto prośbę. Zostanie ona odpowiednio powiadomiona.");
    }

    $scope.addPlayerToTeam = function(aplId, usid) {
        request.backend('applayPlayerToTeam', { tmid: $rootScope.user.tmid, aplId: aplId, usid: usid }, function(data) {
            $scope.$apply(function() {
                $scope.sectionApplayer = data;
            });
            notify.addNew(new notify.Notification("Prośba o dołączenie do sekcji: " + $rootScope.teamNameStr + " rozpatrzona pomyślnie. Zostałeś przypisany", [usid], "#!/sectionGetForPlayer"));
        }, "Pomyślnie dodano osobę do teamu. Zostanie ona odpowiednio powiadomiona.");
    }

    function getSectionApplayer() {
        request.backend('getSectionApplayer', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.sectionApplayer = data;
            })
        });
    }

});