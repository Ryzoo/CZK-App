app.controller('mainController', function($scope, auth, $rootScope, $route, notify) {
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
        address: "",
        bodyType: ""
    }
    $scope.contentLoaded = false;
    $rootScope.newNotify = [];
    $rootScope.allNotify = [];
    $rootScope.lastNotifyId = 0;
    $rootScope.notifyCount = 0;
    $scope.showAllNewsNotify = false;

    $scope.showNotifications = function(isMainClik = true) {
        if (isMainClik) {
            if ($scope.showAllNewsNotify == false) {
                $scope.showAllNewsNotify = true;
                notify.setNewOff();
            } else $scope.showAllNewsNotify = false;
        } else {
            $scope.showAllNewsNotify = false;
        }
    }

    $scope.mainInit = function() {
        $rootScope.viewPerm = ["TRENER", "ZAWODNIK", "KOORD", "STAFF"];
        if (!auth.checkIsLogged()) {
            auth.logout();
            return;
        } else {
            var data = auth.getUserData();
            if (data.success) {
                $rootScope.user.email = data.data.email;
                $rootScope.user.token = Cookies.get('tq');
                $rootScope.user.role = data.data.name;
                $rootScope.user.id = data.data.user_id;
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
                $rootScope.user.bodyType = data.data.body_type;
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
                            if (msg.data) {
                                $('#teamSelect').html('');
                                $('#teamSelect').append("<option value='' disabled> Wybierz drużynę </option>");
                                for (var i = 0; i < msg.data.length; i++) {
                                    $('#teamSelect').append("<option value='" + msg.data[i].tmid + "'" + (i == 0 ? 'selected' : '') + ">" + msg.data[i].name + "</option>");
                                }
                                if (msg.data[0] != null && msg.data[0].tmid != null) $rootScope.user.tmid = msg.data[0].tmid;
                                setInterval(function() {
                                    notify.getNew();
                                }, 2000);
                            } else {
                                $.gritter.add({
                                    title: 'Powiadomienie',
                                    text: "Twoje konto będzie ograniczone dopóki nie zostaniesz przypisany do drużyny",
                                    image: '',
                                    sticky: true,
                                    time: 3,
                                    class_name: 'my-sticky-class'
                                });
                            }
                            setTimeout(function() {
                                $('#showRun').show('fade');
                            }, 200);
                            setTimeout(function() {
                                $('#loadingContent').hide('fade', 'slow');
                            }, 2000);
                            $('select').material_select();
                        } else {
                            if (msg.error)
                                $.gritter.add({
                                    title: 'Bład',
                                    text: msg.error,
                                    image: '',
                                    sticky: true,
                                    time: 3,
                                    class_name: 'my-sticky-class'
                                });
                        }
                    },
                    error: function(jqXHR, textStatus) {
                        $.gritter.add({
                            title: 'Bład',
                            text: "Blad podczas laczenia z serverem: " + textStatus,
                            image: '',
                            sticky: true,
                            time: 3,
                            class_name: 'my-sticky-class'
                        });
                    },
                });

            } else {
                document.location = "login";
                return;
            }
        }
    };

    $(document).on('change', '#teamSelect', function() {
        $rootScope.user.tmid = $("#teamSelect").val();
        $route.reload();
    });
});