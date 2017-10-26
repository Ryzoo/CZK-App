app.controller('sectionGetController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.isGetEnabled = false;
    $scope.sectionData = [];
    $scope.sectionApplayer = [];

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

    $scope.turnOffSectionGet = function() {
        request.backend('turnOffSectionGet', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.isGetEnabled = false;
            })
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

    $scope.deletePlayerApplay = function($usid) {

    }

    $scope.addPlayerToTeam = function($usid) {

    }

    function getSectionApplayer() {
        request.backend('getSectionApplayer', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.sectionApplayer = data;
            })
        });
    }

});