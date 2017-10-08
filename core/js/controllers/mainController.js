app.controller('mainController', function($scope, auth, $rootScope, $route, notify, request, $compile,$location) {
    $rootScope.viewPerm = ["TRENER", "ZAWODNIK", "KOORD", "STAFF"];
    $scope.contentLoaded = false;
    $rootScope.newNotify = [];
    $rootScope.allNotify = [];
    $rootScope.lastNotId = 0;
    $rootScope.notifyCount = 0;
    $rootScope.mainSettings = [];
    $scope.showAllNewsNotify = false;
    $rootScope.editConspectWithId = null;
    $rootScope.consepectShowId = null;
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
    $rootScope.feedType = 'opinia';

    $scope.goFeed = function(type){
        $rootScope.feedType = type;
        $location.url("/feedback");
    }

    $scope.showNotifications = function(isMainClik = true) {
        if (isMainClik) {
            if ($scope.showAllNewsNotify == false) {
                $scope.showAllNewsNotify = true;
            } else {
                $scope.showAllNewsNotify = false;
            }
            notify.setNewOff();
        } else {
            $scope.showAllNewsNotify = false;
        }
    }

    $scope.mainInit = function() {

        if (!auth.checkIsLogged()) {
            auth.logout();
            return;
        } else {
            var data = auth.getUserData();
            if (data.success) {
                request.backend('getMainPageSettings', {}, function(data) {
                    $rootScope.$apply(function() {
                        $rootScope.mainSettings = data;
                    });
                });

                request.backend('getTeams', {}, function(data) {
                    if (data.length == 0) {
                        notify.localNotify('Uwaga', "Twoje konto będzie ograniczone dopóki nie zostaniesz przypisany do sekcji");
                    } else {
                        $('#teamSelect').html('');
                        $('#teamSelect').append("<option value='' disabled> Wybierz sekcję </option>");
                        for (var i = 0; i < data.length; i++) {
                            $('#teamSelect').append("<option value='" + data[i].tmid + "'" + (i == 0 ? 'selected' : '') + ">" + data[i].name + "</option>");
                        }
                        if (data[0] != null && data[0].tmid != null) $rootScope.user.tmid = data[0].tmid;
                        setInterval(function() {
                            notify.getNew();
                        }, 5000);
                    }
                    setTimeout(function() {
                        $('#loadingContent').hide('slide', {}, 500);
                        document.location.href = "/panel#!/";
                        $route.reload();
                    }, 500);
                    $('select').material_select();
                });

            } else {
                document.location = "login";
                return;
            }
        }
    };

    $(document).on('click', '#printButton', function() {
        window.print();
    });

    $(document).on('change', '#teamSelect', function() {
        $rootScope.user.tmid = $("#teamSelect").val();
        document.location.href = "/panel#!/";
        $route.reload();
    });

    $rootScope.toggleCardOptions = function(id) {
        $('.cardOptions').each(function() {
            var tId = $(this).attr('id');
            if (!tId || (tId && tId != id))
                $(this).stop().hide('slide', { direction: 'up' });
        });

        if ($("#" + id)) {
            $("#" + id).first().stop().toggle('slide', { direction: 'up' });
        }
    }

});