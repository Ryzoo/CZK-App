app.controller('accountController', function($scope, auth, $rootScope) {
    $scope.initAccount = function() {
        if (!auth.checkIsLogged()) auth.logout();
    };

    $scope.$on('$viewContentLoaded', function() {
        console.log($rootScope.viewPerm);
        if (!auth.checkPerm($rootScope.viewPerm)) document.location = "#!badPerm";
    });

    $scope.setPerm = function(perm) {
        $rootScope.viewPerm = perm;
    }

    $scope.logout = auth.logout;

});