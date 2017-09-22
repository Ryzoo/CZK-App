app.controller('timetableController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.events = [];

    $scope.initTimetable = function() {
        $scope.showContent = true;
        request.backend('getTimetableEvent', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.events = data;
            });
        });
    }

});