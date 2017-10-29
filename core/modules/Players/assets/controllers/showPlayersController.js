app.controller('showPlayersController', function($scope, auth, $rootScope, notify, request) {
    $scope.players;
    $scope.actualSelectedUserData;
    $scope.actualSelectedUserStats;
    $scope.actualSelectedUserRaports;
    $scope.showPlayerNow = false;
    $scope.showPreLoad = false;
    $scope.personShow = false;
    $scope.personAddShow = false;

    $scope.openCard = function(name) {
        $('#' + name).toggle('blind', null, 'fast');
        $scope.personShow = !$scope.personShow;
    }

    $scope.openCardFt = function(name) {
        $('#' + name).toggle('blind', null, 'fast');
        $scope.personAddShow = !$scope.personAddShow;
    }

    $scope.addPersonFromApp = function() {
        var selected = $('#selectPersonFromApp').val();
        if (selected && selected != null && selected != "") {
            request.backend('addPlayerToTeam', { tmid: $rootScope.user.tmid, usid: $scope.teamPlayer[selected].usid }, function(data) {
                $scope.getAllPlayers();
                notify.addNew(new notify.Notification("Zostałeś przypisany do nowej sekcji: ", [$scope.teamPlayer[selected].usid]));
            }, "Zawodnik dodany pomyslnie do tej sekcji");
        } else {
            notify.localNotify("Walidacja", "Wybierz najpierw zawodnika z listy dostępnych");
        }
    }

    $scope.getAllPlayers = function() {
        $rootScope.showContent = false;
        request.backend('getAllPlayers', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.players = data;
                $scope.showContent = true;
            });
        });
        request.backend('getAllPlayersFromApp', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.teamPlayer = data;
                $('#selectPersonFromApp').html('');
                $('#selectPersonFromApp').append("<option value='' disabled> Wybierz użytkownika </option>");
                for (var i = 0; i < data.length; i++) {
                    $('#selectPersonFromApp').append("<option value='" + i + "'>" + data[i].firstname + " " + data[i].lastname + "</option>");
                }
                $('select').material_select();
            });
        });
    }

    $scope.showThisPlayer = function(usidN) {
        $scope.showPreLoad = true;
        request.backend('getAllUserData', { usid: usidN }, function(data) {
            $scope.$apply(function() {
                $scope.actualSelectedUserData = data;
                $scope.actualSelectedUserData.id = usidN;
            });
            getUserRaports(usidN);
        });
    }

    $scope.deleteUser = function(usidN) {
        request.backend('deleteUser', { usid: usidN, tmid: $rootScope.user.tmid }, function() {
            $scope.getAllPlayers();
            notify.addNew(new notify.Notification("Zostałeś usunięty z sekcji: " + $rootScope.teamNameStr, [usidN], "#!/"));
        }, 'Osoba usunięta z sekcji');
    }

    $scope.addPerson = function() {
        var firstname = $('#addedFirstname').val();
        var lastname = $('#addedLastname').val();
        var email = $('#addedEmail').val();
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            notify.localNotify('Bład', 'Popraw wpisany adres email');
            return;
        }
        if (firstname.length < 3 || lastname.length < 3) {
            notify.localNotify('Bład', 'Imię lub nazwisko jest zbyt krótkie');
            return;
        }
        request.backend('addPerson', { tmid: $rootScope.user.tmid, fname: firstname, lname: lastname, mail: email, isPersonel: false, isAdmin: 'false' }, function() {
            $('#addedFirstname').val('');
            $('#addedLastname').val('');
            $('#addedEmail').val('');
            $scope.getAllPlayers();
        }, 'Osoba została dodana. Na jej adres email zostało wysłane hasło. Wiadomość może trafić do folderu spam');
    }

    $scope.resendPassword = function(id) {
        request.backend('recreatePassword', { usid: id }, function() {}, 'Pomyślnie zmieniono hasło i wysłano maila z hasłem');
    }

    function getUserRaports($userId) {
        request.backend('getRaport', { usid: $userId, tmid: $rootScope.user.tmid }, function(data) {
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
            notify.localNotify('Walidacja', 'Wpisz nazwę raportu');
            return;
        }
        request.backend('addRaport', new FormData($("#raportForm")[0]), function(data) {
            notify.addNew(new notify.Notification("Uzyskałeś raport: " + $name, [$scope.actualSelectedUserData.id], "#!/myRaports"));
            getUserRaports($scope.actualSelectedUserData.id);
        }, 'Twoj plik został przesłany pomyślnie.', true);
    };

    $scope.deleteRaport = function(rpid) {
        request.backend('deleteRaport', { id: rpid }, function() {
            getUserRaports($scope.actualSelectedUserData.id);
        }, 'Plik zostal usuniety');
    }
});