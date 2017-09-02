app.controller('myRaportsController', function($scope, auth, $rootScope, notify, statistic,request) {
    $rootScope.showContent = false;
    $scope.raportsList = [];

    $scope.initRaports = function() {
        getUserRaports($rootScope.user.id);
    }

    function getUserRaports($userId) {
        request.backend('getRaport', {usid: $userId, tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.raportsList = data;
                $rootScope.showContent = true;
            });
        });
    }
});