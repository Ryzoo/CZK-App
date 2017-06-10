app.controller('mainController', function($scope, auth, $rootScope) {
    $rootScope.user = {
        email: "",
        token: "",
        role: "",
        firstname: "",
        lastname: "",
        birthdate: "",
        imgPath: "",
        id: ""
    }
    $scope.mainInit = function() {
        $rootScope.viewPerm = ["TRENER", "ZAWODNIK", "KOORD"];
        if (!auth.checkIsLogged()) {
            auth.logout();
        } else {
            var data = auth.getUserData();
            if (data.success) {
                $rootScope.user.email = data.data.email;
                $rootScope.user.token = Cookies.get('tq');
                $rootScope.user.role = data.data.name;
                $rootScope.user.id = data.data.id;
                $rootScope.user.firstname = data.data.firstname;
                $rootScope.user.lastname = data.data.lastname;
                $rootScope.user.birthdate = data.data.birthdate;
                $rootScope.user.imgPath = data.data.user_img_path;
                $rootScope.user.addAccountDate = data.data.create_account_date;
                console.log($rootScope.user);

            } else {
                document.location = "login";
                console.log(data.error);
            }
        }
    };
});