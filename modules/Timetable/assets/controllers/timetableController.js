app.controller('timetableController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
  
    $scope.initTimetable =function(){
        $scope.showContent = true;
    }
});