app.controller('showPlayersController', function($scope, auth, $rootScope, notify) {
    $scope.players;
    $scope.actualSelectedUser;
    $scope.showPlayerNow = false;

    $scope.getAllPlayers = function() {
        $rootScope.showContent = false;
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getAllPlayers';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $('#prBar').attr('aria-valuenow', 100);
                    $('#prBar').css('width', '100%');
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.showContent = true;
                            $scope.players = msg.data;
                        });
                    }, 500);
                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Brak osób do wyświetlenia',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $(document).ready(function() {
                    var unique_id = $.gritter.add({
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

    $scope.showThisPlayer = function(usidN) {
        var dataToSend = { token: Cookies.get('tq'), usid: usidN };
        var urlToPost = 'backend/getAllUserData';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.$apply(function() {
                        $scope.actualSelectedUser = msg.data;
                        $scope.showPlayerNow = true;
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

    $scope.deleteUser = function(usidN) {
        var dataToSend = { token: Cookies.get('tq'), usid: usidN };
        var urlToPost = 'backend/deleteUser';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Osoba usunięta wraz z powiązaniami',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    $scope.getAllPlayers();
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

    $scope.addPerson = function() {
        var firstname = $('#addedFirstname').val();
        var lastname = $('#addedLastname').val();
        var email = $('#addedEmail').val();
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            $.gritter.add({
                title: 'Bład',
                text: 'Popraw wpisany adres email',
                image: '',
                sticky: true,
                time: '5',
                class_name: 'my-sticky-class'
            });
            return;
        }
        if (firstname.length < 3 || lastname.length < 3) {
            $.gritter.add({
                title: 'Bład',
                text: 'Imię lub nazwisko jest zbyt krótkie',
                image: '',
                sticky: true,
                time: '5',
                class_name: 'my-sticky-class'
            });
            return;
        }
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid, fname: firstname, lname: lastname, mail: email, isPersonel: ($("#addedIsPersonel").is(':checked')) };
        var urlToPost = 'backend/addPerson';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Osoba została dodana. Na jej adres email zostało wysłane hasło.',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    $('#addedFirstname').val('');
                    $('#addedLastname').val('');
                    $('#addedEmail').val('');
                    $scope.getAllPlayers();
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
                    var unique_id = $.gritter.add({
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