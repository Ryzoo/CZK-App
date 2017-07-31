app.controller('masterMenagerController', function($scope, auth, $rootScope, notify) {
    $scope.showContent = false;

    $scope.getAllMaster = function() {
        $scope.showContent = true;
    }

    $scope.openCard = function(name) {
        $('#' + name).toggle('blind', null, 'fast');
    }
});