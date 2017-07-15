app.controller('mainDashboardController', function($scope, auth, $rootScope, request) {
    $scope.nowEvents = [];
    $scope.nextEvents = [];
    $scope.lastPost = [];

    $scope.getAllEvents = function() {
        $rootScope.showContent = false;
        $scope.getNextEvents();
        $scope.getNowStartEvents();
        $scope.getLastPost();

    }

    $scope.getNextEvents = function() {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getNextEvents';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.$apply(function() {
                        $scope.nextEvents = msg.data;
                    });
                } else {
                    console.log(msg);
                    $(document).ready(function() {
                        var unique_id = $.gritter.add({
                            title: 'Bład',
                            text: 'Nie można pobrać wydarzeń',
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
                        text: 'Niestety nie udało się pobrać wydarzeń',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                });
            },
        });
    }

    $scope.getNowStartEvents = function() {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getNowEvents';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.$apply(function() {
                        $scope.nowEvents = msg.data;
                    });

                } else {
                    console.log(msg);
                    $(document).ready(function() {
                        var unique_id = $.gritter.add({
                            title: 'Bład',
                            text: 'Nie można pobrać wydarzeń',
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
                        text: 'Niestety nie udało się pobrać wydarzeń',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                });
            },
        });
    }

    $scope.getLastPost = function() {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getLastPost';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.$apply(function() {
                        $scope.lastPost = msg.data;
                        setTimeout(function() {
                            $scope.$apply(function() {
                                $scope.showContent = true;
                            });
                        }, 500);
                    });
                } else {
                    console.log(msg);
                    $(document).ready(function() {
                        var unique_id = $.gritter.add({
                            title: 'Bład',
                            text: 'Nie można pobrać ostatniego postu',
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
                        text: 'Niestety nie udało się pobrać ostatniego postu',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                });
            },
        });
    }

    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var monthName;

    switch (month) {
        case 1:
            monthName = 'Stycznia';
            break;
        case 2:
            monthName = 'Lutego';
            break;
        case 3:
            monthName = 'Marca';
            break;
        case 4:
            monthName = 'Kwietnia';
            break;
        case 5:
            monthName = 'Maja';
            break;
        case 6:
            monthName = 'Czerwca';
            break;
        case 7:
            monthName = 'Lipca';
            break;
        case 8:
            monthName = 'Sierpnia';
            break;
        case 9:
            monthName = 'Wrzesnia';
            break;
        case 10:
            monthName = 'Października';
            break;
        case 11:
            monthName = 'Listopada';
            break;
        case 12:
            monthName = 'Grudnia';
            break;
        default:
            "Błędny miesiąc";
    }
    $(".today-date").html(day + " " + monthName);
});