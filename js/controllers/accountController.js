app.controller('accountController', function($scope, auth) {

    $scope.initAccount = function() {
        if (!auth.checkIsLogged()) {
            document.location = "login";
        }
    };

    $scope.logout = function() {
        Cookies.remove('tq');
        document.location = "login";
    };

});