app.controller('showPlayersController', function($scope, auth, $rootScope, notify,request) {
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
        request.backend('getAllPlayers', {tmid: $rootScope.user.tmid}, function(data) {
            $scope.$apply(function() {
                $scope.players = data;
                $scope.showContent = true;
            });
        });
    }

    $scope.showThisPlayer = function(usidN) {
        $scope.showPreLoad = true;
        request.backend('getAllUserData', {usid: usidN}, function(data) {
            $scope.$apply(function() {
                $scope.actualSelectedUserData = data;
                $scope.actualSelectedUserData.id = usidN;
            });
            getUserRaports(usidN);
        });
    }

    $scope.deleteUser = function(usidN) {
        request.backend('deleteUser', {usid: usidN}, function() {
            $scope.getAllPlayers();
        },'Osoba usunięta wraz z powiązaniami');
    }

    $scope.addPerson = function() {
        var firstname = $('#addedFirstname').val();
        var lastname = $('#addedLastname').val();
        var email = $('#addedEmail').val();
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            notify.localNotify('Bład','Popraw wpisany adres email');
            return;
        }
        if (firstname.length < 3 || lastname.length < 3) {
            notify.localNotify('Bład','Imię lub nazwisko jest zbyt krótkie');
            return;
        }
        request.backend('addPerson', { tmid: $rootScope.user.tmid, fname: firstname, lname: lastname, mail: email, isPersonel: ($("#addedIsPersonel").is(':checked')), isAdmin: 'false'}, function() {
            $('#addedFirstname').val('');
            $('#addedLastname').val('');
            $('#addedEmail').val('');
            $scope.getAllPlayers();
        },'Osoba została dodana. Na jej adres email zostało wysłane hasło. Wiadomość może trafić do folderu spam');
    }

    function getUserRaports($userId) {
        request.backend('getRaport', { usid: $userId, tmid: $rootScope.user.tmid}, function(data) {
            $scope.$apply(function() {
                $scope.actualSelectedUserRaports = data;
                $scope.showPlayerNow = true;
                $scope.showPreLoad = false;
            });
        });
    }

    $scope.addRaport = function() {
        $name = $("#raportName").val();
        if ($name.length <= 3) {
            notify.localNotify('Walidacja','Wpisz nazwę raportu');
            return;
        }
        request.backend('addRaport', new FormData($("#raportForm")[0]), function(data) {
            notify.addNew(new notify.Notification("Uzyskałeś raport: " + $name, [$scope.actualSelectedUserData.id], "#!/myRaports"));
            getUserRaports($scope.actualSelectedUserData.id);
        },'Twoj plik został przesłany pomyślnie.',true);
    };

    $scope.deleteRaport = function(rpid) {
        request.backend('deleteRaport', {id: rpid}, function() {
            getUserRaports($scope.actualSelectedUserData.id);
        },'Plik zostal usuniety');
    }
});