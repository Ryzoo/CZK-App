app.controller('mainController', function($scope, auth, $rootScope) {
    $rootScope.user = {
        email: "",
        token: "",
        role: ""
    }
    $scope.mainInit = function() {
        $rootScope.viewPerm = ["USER", "ADMIN"];
        if (!auth.checkIsLogged()) {
            auth.logout();
        } else {
            var data = auth.getUserData();
            if (data.success) {
                $rootScope.user.email = data.data.email;
                $rootScope.user.token = Cookies.get('tq');
                $rootScope.user.role = data.data.name;
            } else {
                document.location = "login";
                console.log(data.error);
            }
        }
    };
});