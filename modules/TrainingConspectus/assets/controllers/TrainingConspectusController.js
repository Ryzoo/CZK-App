app.controller('TrainingConspectusController', function($scope, auth, $rootScope, notify, request, $location) {
    $scope.showContent = false;
    $scope.animArray = [];

    $scope.initConsectusCreate = function() {
        $scope.showContent = true;
    }

    $scope.initConsAnimList = function() {
        request.backend('getListOfAnimConspect', {}, function(data) {
            $scope.animArray = data;
            $scope.showContent = true;
            $rootScope.idFromAnimConspectToEdit = null;

        });
    }

    $scope.editAnimCon = function(id) {
        $rootScope.idFromAnimConspectToEdit = id;
        $location.url("/conspectusAnim");
    }

    $scope.deleteAnimCon = function(id) {
        request.backend('deleteAnimConspect', { id: id }, function(data) {
            $scope.initConsAnimList();
        }, "Pomyślnie usunięto");
    }

});