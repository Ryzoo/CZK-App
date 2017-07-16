app.controller('staffController', function($scope, auth, $rootScope, notify) {
    $scope.lastId = 0;
    $scope.staffMembers = [];
    $scope.personelMembers = [];

    $scope.getStaffMembers = function() {
        $rootScope.showContent = false;
        getAllPersonel();
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getTeamStaff';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.staffMembers = msg.data;
                    $('#prBar').attr('aria-valuenow', 100);
                    $('#prBar').css('width', '100%');
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.showContent = true;
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
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.addStaff = function() {
        var addUserId = $('#addStaffMembersSelect').val();
        var addName = $('#typeStaff').val();
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid, name: addName, usid: addUserId };
        var urlToPost = 'backend/addStaff';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.getStaffMembers();
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Personel dodany pomyślnie',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    notify.addNew(new notify.Notification("Dodano nowy personel: " + addName, null, "#!/staff", true));
                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Błąd podczas dodawania',
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
                    text: 'Błąd podczas dodawania',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.deleteStaff = function(staffId) {
        var dataToSend = { token: Cookies.get('tq'), stid: staffId };
        var urlToPost = 'backend/deleteStaff';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.getStaffMembers();
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Personel usunięty pomyślnie',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Błąd podczas usuwania',
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
                    text: 'Błąd podczas usuwania',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    function getAllPersonel() {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getFullPersonel';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.personelMembers = msg.data;
                    $('#prBar').attr('aria-valuenow', 50);
                    $('#prBar').css('width', '50%');
                    $('#addStaffMembersSelect').html("");
                    for (var i = 0; i < msg.data.length; i++) {
                        $('#addStaffMembersSelect').append("<option value='" + msg.data[i].usid + "'>" + msg.data[i].firstname + " " + msg.data[i].lastname + " [ " + msg.data[i].rlname + " ] </option>");
                    }
                    $('select').material_select();
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
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

});