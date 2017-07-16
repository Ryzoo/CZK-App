app.controller('compositionController', function($scope, auth, $rootScope, request, notify) {
    $scope.positions = [];



    $scope.getAllPostion = function() {
        $rootScope.showContent = false;
        var dataToSend = { token: Cookies.get('tq') };
        var urlToPost = 'backend/getAllPosition';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: false,
            success: function(msg) {
                if (msg.success) {
                    $scope.positions = msg.data;
                    for (var i = 0; i < $scope.positions.length; i++) {
                        $scope.positions[i].users = [];
                    }
                    $('select').material_select();
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

    $scope.getTeam = function() {
        $scope.getAllPostion();
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getUserFromTeam';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success && msg.data) {
                    var changeProgress = 100 / msg.data.length;
                    for (var i = 0; i < msg.data.length; i++) {
                        $scope.$apply(function() {
                            $scope.positions[msg.data[i].id_position].users.push(msg.data[i]);
                        });
                        $('select').material_select();
                    }
                } else {
                    console.log(msg.error);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety coś poszło źle lub brak wyników',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                }
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.showContent = true;
                    });
                }, 500);
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety coś poszło źle',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $(document).on("change", ".changeNumber", function() {
        var teamMembersId = ($(this).attr('id').split("-"))[1];
        var positionId = ($(this).attr('id').split("-"))[2];
        var changedNumber = $(this).val();
        for (var i = 0; i < $scope.positions[positionId].users.length; i++) {
            if ($scope.positions[positionId].users[i].tmmid == teamMembersId) {
                $scope.$apply(function() {
                    $scope.positions[positionId].users[i].nr_on_tshirt = changedNumber;
                    saveComposition('nr_on_tshirt', teamMembersId, changedNumber);
                });
                break;
            }
        }
    })
    $(document).on("change", ".selectPosition", function() {
        var teamMembersId = ($(this).attr('id').split("-"))[1];
        var positionId = ($(this).attr('id').split("-"))[2];
        var changedNumber = $(this).val();
        for (var i = 0; i < $scope.positions[positionId].users.length; i++) {
            if ($scope.positions[positionId].users[i].tmmid == teamMembersId) {
                $scope.positions[positionId].users[i].id_position = changedNumber;
                $scope.$apply(function() {
                    $scope.positions[changedNumber].users.push($scope.positions[positionId].users[i]);
                    $scope.positions[positionId].users.splice(i, 1);
                    saveComposition('id_position', teamMembersId, changedNumber);
                });
                break;
            }
        }
    })

    function saveComposition(typeOfChange, tmid, value) {
        var dataToSend = { token: Cookies.get('tq'), tmmid: tmid, val: value, type: typeOfChange };
        var urlToPost = 'backend/changeCollection';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Zapis',
                        text: 'Zmiana zapisana',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    $('select').material_select();
                    if (typeOfChange == 'id_position') {
                        notify.addNew(new notify.Notification("Twoja pozycja na boisku została zmieniona na: " + value, null, "#!/teamComposition", true));
                    } else {
                        notify.addNew(new notify.Notification("Twój numer na boisku został zmieniony na: " + value, null, "#!/teamComposition", true));
                    }
                } else {
                    console.log(msg.error);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety coś poszło źle',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety coś poszło źle',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

});