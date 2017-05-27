app.controller('mainController', function($scope, auth) {
    $scope.mainInit = function() {
        if (!auth.checkIsLogged()) {
            document.location = "login";
        }
    };
});