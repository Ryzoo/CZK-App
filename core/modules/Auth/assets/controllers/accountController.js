app.controller('accountController', function($scope, auth, $rootScope, request, notify) {
    $scope.logout = auth.logout;
    

    $scope.initAccount = function() {
        if (!auth.checkIsLogged()) {
            auth.logout();
            return;
        }
        $('#mainProfileImg').attr("src", $rootScope.user.imgPath);
    };

    $scope.$on('$viewContentLoaded', function() {
        if (!auth.checkPerm($rootScope.viewPerm)) {
            if (!auth.checkIsLogged()) {
                auth.logout();
                return;
            }
            document.location = "#!badPerm";
        }
    });

    $scope.setPerm = function(perm) {
        $rootScope.viewPerm = perm;
    }

    $scope.updateUserDate = function(isPass=false) {
        var id = isPass ? "#userUpdateDataFormPassImg" : "#userUpdateDataForm";
        request.backend('updateUserData', new FormData($(id)[0]), function(data) {
            $rootScope.$apply(function() {
                auth.getUserData();
            });
        },'Twoje dane zostały pomyślnie zaktualizowane. Niektóre zmiany mogą być widoczne dopiero po odświeżeniu strony.',true);
    }

    $(document).off("change", "#userImgFile");
    $(document).on("change", "#userImgFile", function(event) {
        var tmppath = URL.createObjectURL(event.target.files[0]);
        $("#imgPrev").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));
    });

});