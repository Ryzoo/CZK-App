app.controller('loginController', function($scope, auth) {

    $scope.initLogin = function() {
        if (auth.checkIsLogged()) {
            document.location = "panel";
        }
    };
    $scope.login = function(email, password) {
        if (email == null || password == null) $(".error").html("<p> Podaj poprawnie dane </p>");
        else {
            var req = auth.logIn(email, password);
            if (req.success) {
                document.location = "panel";
            } else {
                $(".error").html("<p>" + req.error + "</p>");
            }
        }
    };
});