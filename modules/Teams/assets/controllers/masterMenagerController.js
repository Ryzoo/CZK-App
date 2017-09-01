app.controller('masterMenagerController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.masters = [];

    $scope.getAllMasters = function() {
        getAllMaster();
    }

    function getAllMaster() {
        request.backend('getAllMaster', {}, function(data) {
            $scope.$apply(function() {
                $scope.masters = data;
                $scope.showContent = true;
            });
        });
    }

    $scope.deleteUser = function(usidN) {
        request.backend('deleteUser', {usid: usidN}, function() {
            $scope.$apply(function() {
                $scope.getAllMasters();
            });
        },'Osoba usunięta wraz z powiązaniami');
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
        request.backend('addPerson', {fname: firstname, lname: lastname, mail: email, isAdmin: true, tmid: -1, isPersonel: false},function() {
            $('#addedFirstname').val('');
            $('#addedLastname').val('');
            $('#addedEmail').val('');
            $scope.$apply(function() {
                $scope.getAllMasters();
            });
        },'Osoba została dodana. Na jej adres email zostało wysłane hasło.');
    }

});