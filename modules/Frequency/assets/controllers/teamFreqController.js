app.controller('teamFreqController', function($scope, auth, $rootScope, request, notify) {
    $scope.showContent = false;
    $scope.isSelectedCorrectDate = true;
    $scope.inDaysFreq = [];
    $scope.loadedData = false;
    var currentTime = new Date();

    $scope.initFreq = function() {
        $scope.showContent = true;
        $("#yearDate").val(currentTime.getFullYear());
        $("#yearDate").attr("max", currentTime.getFullYear());
        $("#monthDate").val(currentTime.getMonth() + 1);
        $("#dayDate").val(currentTime.getDate());
        loadFrequencyData($("#yearDate").val(), $("#monthDate").val(), $("#dayDate").val());
        resetDayInMonthMax();
        Materialize.updateTextFields();
    }

    function loadFrequencyData(year, month, day) {
        $scope.loadedData = false;
        $scope.inDaysFreq = [];
        request.backend('getFrequency', { tmid: $rootScope.user.tmid, year: year, month: month, day: day }, function(data) {
            $scope.$apply(function() {
                $scope.inDaysFreq = data;
                $scope.loadedData = true;
            });
        });
    }

    $(document).on("change", "#yearDate", function() {
        var count = parseInt($("#yearDate").val());
        if (count < 2017 || count > currentTime.getFullYear()) {
            notify.localNotify('Walidacja', "Rok musi być w przedzial 2017-aktualny");
            $scope.isSelectedCorrectDate = false;
            return;
        }
        $scope.isSelectedCorrectDate = true;
        resetDayInMonthMax();
        $("#dayDate").val("1");
        loadFrequencyData($("#yearDate").val(), $("#monthDate").val(), $("#dayDate").val());
    });

    $(document).on("change", "#monthDate", function() {
        var count = parseInt($("#monthDate").val());
        if (count < 1 || count > 12) {
            notify.localNotify('Walidacja', "Wpisany nieistniejący miesiąc");
            $scope.isSelectedCorrectDate = false;
            return;
        }
        $scope.isSelectedCorrectDate = true;
        resetDayInMonthMax();
        $("#dayDate").val("1");
        loadFrequencyData($("#yearDate").val(), $("#monthDate").val(), $("#dayDate").val());
    });

    $(document).on("change", "#dayDate", function() {
        var count = parseInt($("#dayDate").val());
        if (count < 1 || count > $("#dayDate").attr("max")) {
            notify.localNotify('Walidacja', "Podany dzień nie istnieje w danym miesiącu");
            $scope.isSelectedCorrectDate = false;
            return;
        }
        $scope.isSelectedCorrectDate = true;
        loadFrequencyData($("#yearDate").val(), $("#monthDate").val(), $("#dayDate").val());
    });

    $(document).on("change", ".onTrainingChecbox", function() {
        var usid = $(this).attr('id').split("-")[1];
        var year = $("#yearDate").val();
        var month = $("#monthDate").val();
        var day = $("#dayDate").val();
        var isChecked = $(this).is(':checked');
        if (isChecked) {
            request.backend('setOnTraining', { tmid: $rootScope.user.tmid, year: year, month: month, day: day, usid: usid });
        } else {
            request.backend('setOffTraining', { tmid: $rootScope.user.tmid, year: year, month: month, day: day, usid: usid });
        }
    });

    function resetDayInMonthMax() {
        var dayCount = new Date($("#yearDate").val(), $("#monthDate").val(), 0).getDate();
        $("#dayDate").attr("max", dayCount);

    }
});