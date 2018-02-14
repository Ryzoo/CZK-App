app.controller('TrainingConspectusController', function($scope, auth, $rootScope, notify, request, $location, $compile) {
    $scope.showContent = false;
    $scope.animArray = [];
    $scope.showAnimCreator = false;
    $scope.allCoElement = [];
    $scope.conspectArray = [];
    $rootScope.lastPlaceInConspect = null;
    $rootScope.sharedAnimId = null;
    $rootScope.sharedConspId = null;

    $scope.coActualId = -1;
    $scope.coName = '';
    $scope.coMaster = '';
    $scope.coDate = '';
    $scope.coPlace = '';
    $scope.sezon = '';
    $scope.coTeam = '';
    $scope.coOp = '';
    $scope.coPower = '';
    $scope.coUserCount = '';
    $scope.coTags = '';

    if ($rootScope.widgetInterval) {
        clearInterval($rootScope.widgetInterval);
    }

    $rootScope.widgetInterval = setInterval(function() {
        if ($rootScope.widgetResponse && $rootScope.widgetResponse != null) {
            $scope.addCwCo({
                place: $rootScope.lastPlaceInConspect,
                name: $rootScope.widgetResponse.name,
                id: $rootScope.widgetResponse.id
            });
            $rootScope.widgetResponse = null;
        }
    }, 200);

    $scope.loadConspect = function(id) {
        request.backend('getConspectById', { id: id }, function(data) {
            $scope.$apply(function() {
                $scope.coActualId = id;
                $scope.coName = data.name;
                $scope.coMaster = data.master;
                $scope.coDate = data.date;
                $scope.coPlace = data.place;
                $scope.sezon = data.sezon;
                $scope.coTeam = data.team;
                $scope.coOp = data.about;
                $scope.coPower = data.powerCount;
                $scope.coUserCount = data.userCount;
                $scope.coTags = data.tags.split(' ');
            });

            var tagTo = {
                data: []
            };

            for (var ind = 0; ind < $scope.coTags.length; ind++) {
                tagTo.data.push({
                    tag: $scope.coTags[ind]
                });
            }

            $('.chips-placeholder').material_chip(tagTo);
            $('.collapsible').collapsible();

            var fullFieldData = JSON.parse(data.data);
            for (var i = 0; i < fullFieldData.length; i++) {
                if (fullFieldData[i].type == 'simple') {
                    $scope.addSimpleFieldCo(fullFieldData[i].data.place);
                    $scope.allCoElement[$scope.allCoElement.length - 1].data = {
                        content: fullFieldData[i].data.content,
                        timeMin: fullFieldData[i].data.timeMin,
                        timeMax: fullFieldData[i].data.timeMax,
                        wsk: fullFieldData[i].data.wsk,
                        place: fullFieldData[i].data.place
                    };
                } else {
                    var fieldData = {
                        id: fullFieldData[i].data.id,
                        name: fullFieldData[i].data.name,
                        place: fullFieldData[i].data.place
                    }
                    $scope.addCwCo(fieldData);
                }
            }
            $('.collapsible').collapsible();
        });
    }

    $scope.selectFromWidget = function(place) {
        $rootScope.lastPlaceInConspect = place;
        $rootScope.showWidget('selectTraining', 'TrainingConspectus');
        $('.collapsible').collapsible();
    };

    if ($rootScope.editConspectWithId && $rootScope.editConspectWithId != null && $rootScope.editConspectWithId >= 0) {
        $scope.loadConspect($rootScope.editConspectWithId);
        $rootScope.editConspectWithId = null;
    }

    $scope.goToEditConspect = function(id) {
        $rootScope.editConspectWithId = id;
        $location.url("/conspectusAdd");
    }

    $scope.initConsectusCreate = function() {
        $scope.showContent = true;
        $('.collapsible').collapsible();
    }

    $scope.initConsAnimList = function() {
        request.backend('getListOfAnimConspect', { usid: $rootScope.user.id }, function(data) {
            $scope.$apply(function() {
                $scope.animArray = data;
                for (var i = 0; i < $scope.animArray.length; i++) {
                    var tags = $scope.animArray[i].tags.replace("  ", " ").split(" ");
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
            $('.collapsible').collapsible();
        });
    }

    $scope.initConspectusAdd = function() {
        $scope.showContent = true;
        $('.collapsible').collapsible();
    }

    $scope.initConspectusList = function() {
        request.backend('getAllConspectList', { usid: $rootScope.user.id }, function(data) {
            $scope.conspectArray = data;
            for (var i = 0; i < $scope.conspectArray.length; i++) {
                var tags = $scope.conspectArray[i].tags.replace("  ", " ").split(" ");
                $scope.conspectArray[i].tags = [];
                for (var x = 0; x < tags.length; x++) {
                    $scope.conspectArray[i].tags.push(tags[x]);
                }
            }
            $('.collapsible').collapsible();
            $scope.showContent = true;
        });
    }

    $scope.editAnimCon = function(id) {
        $rootScope.idFromAnimConspectToEdit = id;
        $location.url("/conspectusAnim");
    }

    $scope.deleteAnimCon = function(id) {
        $rootScope.showModalWindow("Nieodwracalne usunięcie ćwiczenia", function() {
            request.backend('deleteAnimConspect', { id: id }, function(data) {
                $scope.initConsAnimList();
            }, "Pomyślnie usunięto");
        });
    }

    $scope.showShareWidget = function(aid, isConspect = false) {
        if (isConspect) {
            $rootScope.sharedConspId = aid;
            $rootScope.showWidget('shareListC', 'TrainingConspectus');
        } else {
            $rootScope.sharedAnimId = aid;
            $rootScope.showWidget('shareList', 'TrainingConspectus');
        }
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
        $scope.coDate = $('#coDate').val();
        $scope.coPlace = $('#coPlace').val();
        $scope.sezon = $('#sezon').val();
        $scope.coTeam = $('#coTeam').val();
        $scope.coOp = $('#coOp').val();
        $scope.coPower = $('#coPower').val();
        $scope.coUserCount = $('#coUserCount').val();
        $scope.coTags = $('.chips-placeholder').material_chip('data');

        if (!$scope.coName || $scope.coName == '' || $scope.coName == ' ' || $scope.coName == null) {
            notify.localNotify("Walidacja", "Wpisz nazwę danego konspektu");
            return;
        }

        if (!$scope.coDate || $scope.coDate == '' || $scope.coDate == ' ' || $scope.coDate == null) {
            notify.localNotify("Walidacja", "Wpisz date");
            return;
        }

        if (!$scope.coPlace || $scope.coPlace == '' || $scope.coPlace == ' ' || $scope.coPlace == null) {
            notify.localNotify("Walidacja", "Wpisz miejsce");
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
            id_user: $rootScope.user.id,
            coDate: $scope.coDate,
            coPlace: $scope.coPlace,
            sezon: $scope.sezon,
            coTeam: $scope.coTeam,
            coOp: $scope.coOp,
            powerCount: $scope.coPower,
            userCount: $scope.coUserCount,
            coTags: allTagString,
            data: JSON.stringify(dataToSend)
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
