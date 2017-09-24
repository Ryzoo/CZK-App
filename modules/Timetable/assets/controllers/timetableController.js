app.controller('timetableController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.events = [];
    $scope.selectedColor = '#de5c8a';

    $scope.initTimetable = function() {
        request.backend('getTimetableEvent', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.events = data;
                $scope.showContent = true;
            });
        });
    }

    $scope.selectColor = function(color) {
        $('.borderSelectedColor').css("border-color", color);
        $scope.selectedColor = color;
    }

    $scope.iniTimetableSettings = function() {
        request.backend('getTimetableEventFull', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.events = data;
                $scope.showContent = true;
            });
        });
    }

    $scope.deleteTimetableEvent = function(id) {
        request.backend('deleteTimetableEvent', { id: id }, function(data) {
            $scope.iniTimetableSettings();
        }, "Usunięto z grafiku");
    }

    $scope.addTimetableEvent = function() {

        var title = $('#addTitleNews').val();
        var day = $('#dayName').val();
        var time = $('#timeEVENT').val();

        if (!day || !time || !title) {
            notify.localNotify("Walidacja", "Wpisz wszystkie dane");
            return;
        }

        if (!title || title.length <= 3) {
            notify.localNotify("Walidacja", "Wpisz dłuższy tytuł");
            return;
        }
        var regexp = /([01][0-9]|[02][0-3]):[0-5][0-9]/;
        var correct = (time.search(regexp) >= 0) ? true : false;
        if (!correct) {
            notify.localNotify("Walidacja", "Błędny format czasu (hh:mm)");
            return;
        }

        request.backend('addTimetableEvent', { title: title, day: day, time: time, color: $scope.selectedColor, tmid: $rootScope.user.tmid }, function(data) {
            $scope.iniTimetableSettings();
        }, "Dodano pomyślnie");
    }

});