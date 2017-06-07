app.controller('accountController', function($scope, auth, $rootScope, request) {
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

    $scope.updateUserDate = function() {

        var dataToSend = new FormData($("#userUpdateDataForm")[0]);
        var urlToPost = 'backend/updateUserData';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: false,
            success: function(msg) {
                console.log(msg);

                if (msg.success) {
                    $rootScope.user.firstname = msg.data.post.firstname;
                    $rootScope.user.lastname = msg.data.post.lastname;
                    $rootScope.user.birthdate = msg.data.post.birthdate;
                    $rootScope.user.token = Cookies.get('tq');
                    if (msg.data.url.length > 2)
                        $rootScope.user.imgPath = msg.data.url;
                    $(document).ready(function() {
                        var unique_id = $.gritter.add({
                            // (string | mandatory) the heading of the notification
                            title: 'Aktualizacja danych',
                            // (string | mandatory) the text inside the notification
                            text: 'Twoje dane zostały pomyślnie zaktualizowane. Niektóre zmiany mogą być widoczne dopiero po odświeżeniu strony.',
                            // (string | optional) the image to display on the left
                            image: '',
                            // (bool | optional) if you want it to fade out on its own or just sit there
                            sticky: true,
                            // (int | optional) the time you want it to be alive for before fading out
                            time: '',
                            // (string | optional) the class name you want to apply to that specific message
                            class_name: 'my-sticky-class'
                        });

                        return false;
                    });
                } else {
                    console.log(data.error);
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