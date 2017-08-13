app.controller('masterMenagerController', function($scope, auth, $rootScope, notify) {
    $scope.showContent = false;
    $scope.masters = [];

    $scope.getAllMasters = function() {
        getAllMaster();
    }

    function getAllMaster() {
        var dataToSend = { token: Cookies.get('tq') };
        var urlToPost = 'backend/getAllMaster';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.masters = msg.data ? msg.data : null;
                    $scope.$apply(function() {
                        $scope.showContent = true;
                    });
                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety nie udało się pobrać wydarzeń do kalendarza',
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
                    text: 'Niestety nie udało się pobrać wydarzeń do kalendarza',
                    image: '',
                    sticky: true,
                    time: 3,
                    class_name: 'my-sticky-class'
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
                    $scope.getAllMasters();
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
        var dataToSend = { token: Cookies.get('tq'), fname: firstname, lname: lastname, mail: email, isAdmin: true, tmid: -1, isPersonel: false };
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
                    $scope.getAllMasters();
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