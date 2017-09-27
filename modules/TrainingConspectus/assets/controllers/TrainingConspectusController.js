app.controller('TrainingConspectusController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.initConsectusCreate = function() {
        $scope.showContent = true;
    }
});