app.controller('loginController', function($scope, auth) {

    $scope.initLogin = function() {
        if (auth.checkIsLogged()) {
            var req = auth.getUserData();
            if (req.success) document.location = "panel";
        }
    };
    $scope.login = function(email, password) {
        if (email == null || password == null) console.log("Podaj poprawnie dane");
        else {
            var req = auth.logIn(email, password);
            if (req.success) {
                document.location = "panel";
            } else {
                console.log(req.error);
            }
        }
    };
});