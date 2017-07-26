app.controller('myRaportsController', function($scope, auth, $rootScope, notify, statistic) {
    $rootScope.showContent = false;
    $scope.raportsList = [];

    $scope.initRaports = function() {
        getUserRaports($rootScope.user.id);
    }

    function getUserRaports($userId) {
        var dataToSend = { token: Cookies.get('tq'), usid: $userId, tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getRaport';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.$apply(function() {
                        $scope.raportsList = msg.data;
                        $rootScope.showContent = true;
                    });
                } else {
                    if (msg.error) {
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                    }
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $(document).ready(function() {
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety nie udało się pobrać danych',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                });
            },
        });
    }
});