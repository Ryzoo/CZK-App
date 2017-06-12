app.controller('compositionController', function($scope, auth, $rootScope, request) {
    $scope.lawka = [];
    $scope.bramka = [];
    $scope.obrona = [];
    $scope.pomoc = [];
    $scope.atak = [];
    $scope.getTeam = function() {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getUserFromTeam';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: false,
            success: function(msg) {
                if (msg.success) {
                    $scope.lawka = msg.data;
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
                        text: 'Niestety coś poszło źle',
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