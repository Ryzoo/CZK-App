app.controller('mainController', function($scope, auth, $rootScope, $route) {
    $rootScope.user = {
        email: "",
        token: "",
        role: "",
        firstname: "",
        lastname: "",
        birthdate: "",
        imgPath: "",
        id: "",
        tmid: "",
        height: "",
        tel: "",
        parentTel: "",
        weight: "",
        mainLeg: "",
        mainPosition: "",
        address: ""
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
                $rootScope.user.addAccountDate = data.data.create_account_date;
                $rootScope.user.height = data.data.height;
                $rootScope.user.tel = data.data.tel;
                $rootScope.user.parentTel = data.data.parent_tel;
                $rootScope.user.weight = data.data.weight;
                $rootScope.user.mainLeg = data.data.main_leg;
                $rootScope.user.mainPosition = data.data.main_position;
                $rootScope.user.address = data.data.address;
                var dataToSend = { token: Cookies.get('tq') };
                var urlToPost = 'backend/getTeams';
                $.ajax({
                    url: urlToPost,
                    type: "POST",
                    data: dataToSend,
                    async: false,
                    success: function(msg) {
                        if (msg.success) {
                            $('#teamSelect').html('');
                            for (var i = 0; i < msg.data.length; i++) {
                                $('#teamSelect').append("<option value='" + msg.data[i].tmid + "'>" + msg.data[i].name + "</option>");
                            }
                            if (msg.data[0] != null && msg.data[0].tmid != null) $rootScope.user.tmid = msg.data[0].tmid;

                        } else {
                            console.log(msg.error);
                            $(document).ready(function() {
                                var unique_id = $.gritter.add({
                                    title: 'Bład',
                                    text: 'Niestety coś poszło źle',
                                    image: '',
                                    sticky: true,
                                    time: '5',
                                    class_name: 'my-sticky-class'
                                });
                            });
                        }
                    },
                    error: function(jqXHR, textStatus) {
                        console.log("Blad podczas laczenia z serverem: " + textStatus);
                        $(document).ready(function() {
                            var unique_id = $.gritter.add({
                                title: 'Bład',
                                text: 'Niestety nie udało się wczytać Twoich drużyn',
                                image: '',
                                sticky: true,
                                time: '5',
                                class_name: 'my-sticky-class'
                            });
                        });
                    },
                });

            } else {
                document.location = "login";
                console.log(data.error);
            }
        }
    };

    $(document).on('change', '#teamSelect', function() {
        $rootScope.user.tmid = $("#teamSelect").val();
        $route.reload();
    });
});