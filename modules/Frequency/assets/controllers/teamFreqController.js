app.controller('teamFreqController', function($scope, auth, $rootScope, request, notify) {
    $scope.showContent = false;
    $scope.isSelectedCorrectDate = true;
    $scope.inDaysFreq = [];
    $scope.loadedData = false;
    $scope.status = "W tym dniu trening się nie odbył.";
    $scope.statusNumber = 0;
    $scope.currentDay = [];
    $scope.isFreqShow = false;

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
            });
        });
        request.backend('getDayStatusFreq', { tmid: $rootScope.user.tmid, data: moment(year+"-"+month+"-"+day).format("YYYY-MM-DD") }, function(data) {
            $scope.$apply(function() {
                $scope.currentDay = data;
                $scope.checkTeamStatusFreq();
            });
        });
    }

    $(document).off("change", "#yearDate");
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

    $(document).off("change", "#monthDate");
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

    $(document).off("change", "#dayDate");
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

    $(document).off("change", ".onTrainingChecbox");
    $(document).on("change", ".onTrainingChecbox", function() {
        var usid = $(this).attr('id').split("-")[1];
        var year = $("#yearDate").val();
        var month = $("#monthDate").val();
        var day = $("#dayDate").val();
        var isChecked = $(this).is(':checked');
        if ($rootScope.user.role != 'ZAWODNIK') {
            if (isChecked) {
                request.backend('setOnTraining', { tmid: $rootScope.user.tmid, year: year, month: month, day: day, usid: usid });
                $(this).prop('checked', true);
            } else {
                request.backend('setOffTraining', { tmid: $rootScope.user.tmid, year: year, month: month, day: day, usid: usid });
                $(this).prop('checked', false);
            }
        }
    });

    function resetDayInMonthMax() {
        var dayCount = new Date($("#yearDate").val(), $("#monthDate").val(), 0).getDate();
        $("#dayDate").attr("max", dayCount);

    }

    $scope.checkTeamStatusFreq = function(){
        if($scope.currentDay && $scope.currentDay != null && !$.isArray($scope.currentDay)){
            $scope.status = $scope.currentDay.status == 1 ? "W tym dniu odbył się trening." : "W tym dniu trening został odwołany.";
            $scope.statusNumber = $scope.currentDay.status;
            $scope.isFreqShow = $scope.currentDay.status == 1;
            $scope.reason = $scope.currentDay.reason;
        }else{
            $scope.status = "W tym dniu trening się nie odbył.";
            $scope.statusNumber = 0;
            $scope.isFreqShow = false;
            $scope.reason = "";
        }

    };

    $scope.initTeamStatus = function(){
        var year = $("#yearDate").val();
        var month = $("#monthDate").val();
        var day = $("#dayDate").val();
        request.backend('updateDayStatusFreq', { status: 1, tmid: $rootScope.user.tmid, data: moment(year+"-"+month+"-"+day).format("YYYY-MM-DD") }, function(data) {
            $scope.$apply(function() {
                $scope.status = "W tym dniu odbył się trening.";
                $scope.statusNumber = 1;
                $scope.isFreqShow = true;
                $scope.reason = "";
            });
        },"Status został zmieniony.");
    };

    $scope.initDefaultStatus = function(){
        var year = $("#yearDate").val();
        var month = $("#monthDate").val();
        var day = $("#dayDate").val();
        request.backend('deleteDayStatusFreq', { status: 1, tmid: $rootScope.user.tmid, data: moment(year+"-"+month+"-"+day).format("YYYY-MM-DD") }, function(data) {
            $scope.$apply(function() {
                $scope.status = "W tym dniu trening się nie odbył.";
                $scope.statusNumber = 0;
                $scope.isFreqShow = false;
                $scope.reason = "";
            });
        },"Status został zmieniony.");
    };

    $scope.initReasonModal = function () {
        $('#cancellationReason').modal('open');
    };

    $scope.cancelReasonModal = function () {
        $('#cancellationReason').modal('close');
    };

    $scope.initChangeStatus = function () {
        var year = $("#yearDate").val();
        var month = $("#monthDate").val();
        var day = $("#dayDate").val();
        request.backend('updateDayStatusFreq', { reason: $scope.reason ? $scope.reason : "" ,status: 2, tmid: $rootScope.user.tmid, data: moment(year+"-"+month+"-"+day).format("YYYY-MM-DD") }, function(data) {
            $scope.$apply(function() {
                $scope.isFreqShow = false;
                $scope.status = "W tym dniu trening został odwołany.";
                $scope.statusNumber = 2;
                $('#cancellationReason').modal('close');
            });
        },"Status został zmieniony.");
    };

});