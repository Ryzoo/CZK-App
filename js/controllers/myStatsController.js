app.controller('myStatsController', function($scope, auth, $rootScope, notify) {
    $rootScope.showContent = false;

    $scope.initMyStats = function() {
        $rootScope.showContent = true;
    }

});