app.controller('TrainingListAdditionalController', function($scope, auth, $rootScope, notify, request, $location, $compile) {
    $scope.showContent = false;

    $scope.initConsAnimList = function() {
        request.backend('getListOfAnimConspect', { usid: $rootScope.user.id }, function(data) {
            $scope.$apply(function() {
                $scope.animArray = data;
                for (var i = 0; i < $scope.animArray.length; i++) {
                    var tags = $scope.animArray[i].tags.split(" ");
                    $scope.animArray[i].tags = [];
                    for (var x = 0; x < tags.length; x++) {
                        $scope.animArray[i].tags.push(tags[x]);
                    }
                }
                $scope.showContent = true;
                $rootScope.idFromAnimConspectToEdit = null;
                setInterval(function() {
                    $('.gifplayer').each(function() {
                        if (!$(this).hasClass('isGifed')) {
                            $(this).addClass('isGifed');
                            $(this).gifplayer();
                        }
                    });
                }, 500);
            });
        });
    }

    $scope.initConspectusList = function() {
        request.backend('getAllConspectList', { usid: $rootScope.user.id }, function(data) {
            $scope.conspectArray = data;
            for (var i = 0; i < $scope.conspectArray.length; i++) {
                var tags = $scope.conspectArray[i].tags.split(" ");
                $scope.conspectArray[i].tags = [];
                for (var x = 0; x < tags.length; x++) {
                    $scope.conspectArray[i].tags.push(tags[x]);
                }
            }
            $scope.showContent = true;
        });
    }

    $scope.editAnimCon = function(id) {
        $rootScope.idFromAnimConspectToEdit = id;
        $location.url("/conspectusAnim");
    }

    $scope.deleteAnimCon = function(id) {


        $rootScope.showModalWindow("Nieodwracalne usunięcie animacji", function() {
            request.backend('deleteAnimConspect', { id: id }, function(data) {
                $scope.initConsAnimList();
            }, "Pomyślnie usunięto");
        });

    }

    $scope.addSimpleFieldCo = function(placeId) {
        var thisId = $scope.allCoElement.length;
        $scope.allCoElement.push({
            id: thisId,
            type: 'simple',
            status: 'on',
            data: {
                content: '',
                timeMin: 1,
                timeMax: 2,
                wsk: '',
                place: placeId
            }
        });
        var el = "<div class='coElement' id='" + thisId + "-simpleField" + "'><div ng-click='deleteField(" + thisId + ");' style='position: absolute; top: 9px; right: 20px; color: white; font-size: 20px; cursor: pointer'><i class='fa fa-times' aria-hidden='true' ></i></div><div class='form-group'><div class='row'><div class='input-field col s12 m6'><input id='" + thisId + "-simpleContent" + "' type='text' placeholder='Treść' class='validate' ng-model='allCoElement[" + thisId + "].data.content' required><label for='" + thisId + "-simpleContent" + "'>Treść</label></div><div class='input-field col s12 m3'><input id='" + thisId + "-simpleMinTime" + "' type='text' ng-model='allCoElement[" + thisId + "].data.timeMin' placeholder='Czas min' class='validate' required><label for='" + thisId + "-simpleMinTime" + "'>Czas min</label></div><div class='input-field col s12 m3'><input id='" + thisId + "-simpleMaxTime" + "' type='text' ng-model='allCoElement[" + thisId + "].data.timeMax' placeholder='Czas max' class='validate' required><label for='" + thisId + "-simpleMaxTime" + "'>Czas max</label></div><div class='input-field col s12'><textarea id='" + thisId + "-simpleWsk" + "' placeholder='Wskazówki' ng-model='allCoElement[" + thisId + "].data.wsk' class='materialize-textarea' data-length='255'></textarea><label for='" + thisId + "-simpleWsk" + "'>Wskazówki</label></div></div></div></div>";
        var element = angular.element($('#' + placeId).find('.data').first());
        var generated = element.html(element.html() + el);
        $compile(generated.contents())($scope);
        Materialize.updateTextFields();
    }

    $scope.addCwCo = function(response) {
        var thisId = $scope.allCoElement.length;
        $scope.allCoElement.push({
            id: thisId,
            type: 'training',
            status: 'on',
            data: {
                id: response.id,
                name: response.name,
                place: response.place
            }
        });
        var el = "<div class='coElement' id='" + thisId + "-simpleField" + "'><div ng-click='deleteField(" + thisId + ");' style='position: absolute; top: 9px; right: 20px; color: white; font-size: 20px; cursor: pointer'><i class='fa fa-times' aria-hidden='true' ></i></div> <b>Ćwiczenie: </b>" + response.name + "  </div>";
        var element = angular.element($('#' + response.place).find('.data').first());
        var generated = element.html(element.html() + el);
        $compile(generated.contents())($scope);
        Materialize.updateTextFields();
    }

    $scope.deleteField = function(id) {
        $scope.allCoElement[id].status = 'off';
        $('#' + id + '-simpleField').hide(200);
    }

    $scope.saveConspect = function() {

        $scope.coName = $('#coName').val();
        $scope.coMaster = $('#coMaster').val();
        $scope.coDate = $('#coDate').val();
        $scope.coSezon = $('#coSezon').val();
        $scope.coTeam = $('#coTeam').val();
        $scope.coOp = $('#coOp').val();
        $scope.coTags = $('.chips-placeholder').material_chip('data');

        if (!$scope.coName || $scope.coName == '' || $scope.coName == ' ' || $scope.coName == null) {
            notify.localNotify("Walidacja", "Wpisz nazwę danego konspektu");
            return;
        }

        if (!$scope.coMaster || $scope.coMaster == '' || $scope.coMaster == ' ' || $scope.coMaster == null) {
            notify.localNotify("Walidacja", "Wpisz imie, nazwisko trenera");
            return;
        }

        if (!$scope.coDate || $scope.coDate == '' || $scope.coDate == ' ' || $scope.coDate == null) {
            notify.localNotify("Walidacja", "Wpisz date");
            return;
        }

        if (!$scope.coSezon || $scope.coSezon == '' || $scope.coSezon == ' ' || $scope.coSezon == null) {
            notify.localNotify("Walidacja", "Wpisz nazwę sezonu");
            return;
        }

        if (!$scope.coTeam || $scope.coTeam == '' || $scope.coTeam == ' ' || $scope.coTeam == null) {
            notify.localNotify("Walidacja", "Wpisz przedział wiekowy");
            return;
        }

        if (!$scope.coTags || $scope.coTags.length < 2) {
            notify.localNotify("Walidacja", "Wpisz przynajmniej dwie frazy, z którymi będzie kojarzony dany konspekt");
            return;
        }

        var dataToSend = [];
        var isError = false;

        for (var i = 0; i < $scope.allCoElement.length; i++) {
            if ($scope.allCoElement[i].status == 'on') {
                if ($scope.allCoElement[i].type == 'simple') {

                    if ($scope.allCoElement[i].data.content == '') {
                        notify.localNotify("Walidacja", "Wpisz treść wszystkich prostych pól w konspekcie");
                        isError = true;
                    }
                    var minT = parseInt($scope.allCoElement[i].data.timeMin);
                    if (minT == 0) {
                        notify.localNotify("Walidacja", "Wpisz poprawnie wszystkie minimalne wartosci czasu w prostych polach");
                        isError = true;
                    }
                    var maxT = parseInt($scope.allCoElement[i].data.timeMax);
                    if (maxT == 0 || maxT <= minT) {
                        notify.localNotify("Walidacja", "Wpisz poprawnie wszystkie maksymalne wartosci czasu w prostych polach");
                        isError = true;
                    }

                    if (isError) return;
                }
                dataToSend.push({
                    type: $scope.allCoElement[i].type,
                    data: $scope.allCoElement[i].data,
                    place: $scope.allCoElement[i].place
                });
            }
        }

        var allTagString = '';
        for (var x = 0; x < $scope.coTags.length; x++) {
            allTagString += " ";
            allTagString += $scope.coTags[x].tag;
        }

        var toSend = {
            id: $scope.coActualId,
            coName: $scope.coName,
            coMaster: $scope.coMaster,
            coDate: $scope.coDate,
            coSezon: $scope.coSezon,
            coTeam: $scope.coTeam,
            coOp: $scope.coOp,
            coTags: allTagString,
            data: JSON.stringify(dataToSend),
            usid: $rootScope.user.id
        }

        request.backend('saveConspect', toSend, function(data) {
            $location.url("/conspectusList");
        }, "Pomyślnie zapisano");
    }

    $scope.showThisContent = function(id) {
        $rootScope.consepectShowId = id;
        $location.url("/showConspect");
    }

    $scope.deleteCon = function(id) {
        $rootScope.showModalWindow("Nieodwracalne usunięcie konspektu", function() {
            request.backend('deleteConspect', { id: id }, function(data) {
                $scope.initConspectusList();
            }, "Pomyślnie usunięto");
        });
    }

});