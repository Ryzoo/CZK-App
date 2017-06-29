app.controller('accountController', function($scope, auth, $rootScope, request) {
    $scope.initAccount = function() {
        if (!auth.checkIsLogged()) auth.logout();
    };

    $scope.$on('$viewContentLoaded', function() {
        if (!auth.checkPerm($rootScope.viewPerm)) document.location = "#!badPerm";
    });

    $scope.setPerm = function(perm) {
        $rootScope.viewPerm = perm;
    }

    $scope.logout = auth.logout;

    $scope.updateUserDate = function() {

        var dataToSend = new FormData($("#userUpdateDataForm")[0]);
        var urlToPost = 'backend/updateUserData';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {

                    $scope.$apply(function() {
                        $rootScope.user.firstname = msg.data.post.firstname;
                        $rootScope.user.lastname = msg.data.post.lastname;
                        $rootScope.user.birthdate = msg.data.post.birthdate;
                        $rootScope.user.height = msg.data.post.height;
                        $rootScope.user.tel = msg.data.post.tel;
                        $rootScope.user.parentTel = msg.data.post.parentTel;
                        $rootScope.user.weight = msg.data.post.weight;
                        $rootScope.user.mainLeg = msg.data.post.mainLeg;
                        $rootScope.user.mainPosition = msg.data.post.mainPosition;
                        $rootScope.user.address = msg.data.post.address;
                        if (msg.data.url.length > 2)
                            $rootScope.user.imgPath = msg.data.url;
                    });

                    $(document).ready(function() {
                        var unique_id = $.gritter.add({
                            title: 'Aktualizacja danych',
                            text: 'Twoje dane zostały pomyślnie zaktualizowane. Niektóre zmiany mogą być widoczne dopiero po odświeżeniu strony.',
                            image: '',
                            sticky: true,
                            time: '',
                            class_name: 'my-sticky-class'
                        });
                        return false;
                    });
                } else {
                    console.log(msg);
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }

    $("#userImgFile").on("change", function(event) {
        var tmppath = URL.createObjectURL(event.target.files[0]);
        $("#imgPrev").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));
    });

});