app.controller('showPlayersController', function($scope, auth, $rootScope, notify) {
    $scope.players;
    $scope.actualSelectedUserData;
    $scope.actualSelectedUserStats;
    $scope.actualSelectedUserRaports;
    $scope.showPlayerNow = false;
    $scope.showPreLoad = false;
    $scope.personShow = false;

    $scope.openCard = function(name) {
        $('#' + name).toggle('blind', null, 'fast');
        $scope.personShow = !$scope.personShow;
    }

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
                    $scope.$apply(function() {
                        $scope.players = msg.data ? msg.data : [];
                    });
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.showContent = true;
                        });
                    }, 500);
                } else {
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Brak osób do wyświetlenia',
                        image: '',
                        sticky: true,
                        time: 3,
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
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                });
            },
        });
    }

    $scope.showThisPlayer = function(usidN) {
        $scope.showPreLoad = true;
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
                        $scope.actualSelectedUserData = msg.data;
                        $scope.actualSelectedUserData.id = usidN;
                    });
                    getUserRaports(usidN);
                } else {
                    if (msg.error) {
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: 3,
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
                        time: 3,
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
                        time: 3,
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
                            time: 3,
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
                        time: 3,
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
                time: 3,
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
                time: 3,
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
                        time: 3,
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
                            time: 3,
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
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                });
            },
        });
    }

    function getUserStats() {

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
                console.log(msg);
                if (msg.success) {
                    $scope.$apply(function() {
                        $scope.actualSelectedUserRaports = msg.data;
                        $scope.showPlayerNow = true;
                        $scope.showPreLoad = false;
                    });
                } else {
                    if (msg.error) {
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: 3,
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
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                });
            },
        });
    }

    $scope.addRaport = function() {
        $name = $("#raportName").val();
        if ($name.length <= 3) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Wpisz nazwę raportu',
                image: '',
                sticky: true,
                time: '',
                class_name: 'my-sticky-class'
            });
            return;
        }

        var dataToSend = new FormData($("#raportForm")[0]);
        var urlToPost = 'backend/addRaport';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                console.log(msg);
                if (msg.success) {
                    $.gritter.add({
                        title: 'Przesyłanie pliku',
                        text: 'Twoj plik został przesłany pomyślnie.',
                        image: '',
                        sticky: true,
                        time: '',
                        class_name: 'my-sticky-class'
                    });
                    notify.addNew(new notify.Notification("Uzyskałeś raport: " + $name, [$scope.actualSelectedUserData.id], "#!/myRaports"));
                    getUserRaports($scope.actualSelectedUserData.id);
                } else {
                    if (msg.error)
                        $.gritter.add({
                            title: 'Błąd',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '',
                            class_name: 'my-sticky-class'
                        });
                }
            },
            error: function(jqXHR, textStatus) {
                $.gritter.add({
                    title: 'Błąd',
                    text: 'Bład z połączeniem : ' + textStatus,
                    image: '',
                    sticky: true,
                    time: '',
                    class_name: 'my-sticky-class'
                });
            },
            cache: false,
            contentType: false,
            processData: false
        });
    };

    $scope.deleteRaport = function(rpid) {
        var dataToSend = { token: Cookies.get('tq'), id: rpid };
        var urlToPost = 'backend/deleteRaport';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Usuwanie pliku',
                        text: 'Plik zostal usuniety',
                        image: '',
                        sticky: true,
                        time: '',
                        class_name: 'my-sticky-class'
                    });
                    getUserRaports($scope.actualSelectedUserData.id);
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
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

});