app.controller('mettingListController', function($scope, auth, $rootScope, notify, request, validator) {
    $scope.showContent = false;
    $scope.meetingList = [];
    $scope.searchText = '';
    $rootScope.settingsMeet = [];
    $scope.stats = [];
    $scope.showAnimCreator = false;
    $scope.showMeetStats = true;
    let meetingSelectIndex = -1;
    $scope.changeTextColor = function(color){
        $rootScope.settingsMeet.color = color;
    };
    $scope.isSaved = {
        status: false,
        id: -1
    };
    $scope.meetViewSelected ={
        date: null,
        compositionData: null,
        description: '',
        enemyName: '',
        teamScore: null,
        enemyScore: null,
        status: ''
    };
    $scope.meetModel = {
        id_team: $rootScope.user.tmid,
        date: moment().add(2, 'd').format('YYYY-MM-DD HH:mm'),
        description: '',
        enemyName: '',
        teamScore: null,
        enemyScore: null,
        status: 'Oczekiwanie'
    };
    $scope.showScoreInAddModal = false;

    $scope.endFromFull = function(){
        $scope.showAnimCreator = false;
    };

    $scope.$watch('meetModel.date', function (newValue, oldValue, scope) {
        $scope.showScoreInAddModal = moment(newValue).isSameOrBefore(moment());
        $scope.meetModel.teamScore = $scope.meetModel.enemyScore = null;
        $scope.meetModel.status = (!$scope.showScoreInAddModal) ? "Oczekiwanie" : "Zakończone";
        M.updateTextFields();
    });

    $scope.$watch('meetModel.teamScore', function (newValue, oldValue, scope) {
        if($scope.meetModel.teamScore && $scope.meetModel.enemyScore){
            $scope.meetModel.status = ($scope.meetModel.teamScore > $scope.meetModel.enemyScore) ? "Zwycięstwo" : (($scope.meetModel.teamScore < $scope.meetModel.enemyScore) ? "Porażka" : "Remis")
        }
        M.updateTextFields();
    });

    $scope.$watch('meetModel.enemyScore', function (newValue, oldValue, scope) {
        if($scope.meetModel.teamScore && $scope.meetModel.enemyScore){
            $scope.meetModel.status = ($scope.meetModel.teamScore > $scope.meetModel.enemyScore) ? "Zwycięstwo" : (($scope.meetModel.teamScore < $scope.meetModel.enemyScore) ? "Porażka" : "Remis")
        }
        M.updateTextFields();
    });

    $scope.deleteTermin = function(id){
        request.backend('deleteMettingList', { id: id}, function(data) {
            request.backend('getMettingList', { tmid: $rootScope.user.tmid, settings: $rootScope.settingsMeet }, function(data) {
                $scope.$apply(function() {
                    $scope.meetingList = data;
                    $scope.showContent = true;
                    loadStats();
                    M.updateTextFields();
                    setTimeout(function() {
                        M.updateTextFields();
                        $('select').formSelect();
                    }, 500);
                });
            });
        },"Usunięto!");
    };

    $scope.initMeetingList = function() {
        request.backend('getMettingListSettings', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $rootScope.settingsMeet = data;
                $rootScope.settingsMeet.listMinYear = parseInt($rootScope.settingsMeet.listMinYear);
                $rootScope.settingsMeet.listMaxYear = parseInt($rootScope.settingsMeet.listMaxYear);
                $rootScope.settingsMeet.maxPlayers = parseInt($rootScope.settingsMeet.maxPlayers);
                $rootScope.settingsMeet.eventInCalendar = $rootScope.settingsMeet.eventInCalendar == '1';
                $scope.$watch('settingsMeet', function (newValue, oldValue, scope) {
                    if($scope.showContent && $rootScope.settingsMeet ){
                        request.backend('updateMettingListSettings', { tmid: $rootScope.user.tmid, settings: $rootScope.settingsMeet }, function(data) {
                        },'Ustawienia zapisane');
                    }
                },true);
            });

            request.backend('getMettingList', { tmid: $rootScope.user.tmid, settings: $rootScope.settingsMeet }, function(data) {
                $scope.$apply(function() {
                    $scope.meetingList = data;
                    $scope.showContent = true;
                    loadStats();
                    M.updateTextFields();
                    setTimeout(function() {
                        M.updateTextFields();
                        $('select').formSelect();
                        $('.modal').modal();
                    }, 500);
                });
            });
        });
    };

    function loadStats(){
        request.backend('getMeetStats', { tmid: $rootScope.user.tmid, settings: $rootScope.settingsMeet }, function(data) {
            $scope.$apply(function() {
                $scope.stats = [];
                data.forEach(function(element){
                    $scope.stats[element.status] = parseInt(element.count);
                });
                $scope.stats["Oczekiwanie"] = $scope.stats["Oczekiwanie"] ? parseInt($scope.stats["Oczekiwanie"]) : 0;
                $scope.stats["Porażka"] = $scope.stats["Porażka"] ? parseInt($scope.stats["Porażka"]) : 0;
                $scope.stats["Remis"] = $scope.stats["Remis"] ? parseInt($scope.stats["Remis"]) : 0;
                $scope.stats["Zwycięstwo"] = $scope.stats["Zwycięstwo"] ? parseInt($scope.stats["Zwycięstwo"]) : 0;
                $scope.stats["Zakończone"] = $scope.stats["Zakończone"] ? parseInt($scope.stats["Zakończone"]) : 0;
                $scope.stats["Rozegrane"] = $scope.stats["Zakończone"] + $scope.stats["Zwycięstwo"] + $scope.stats["Remis"] + $scope.stats["Porażka"];
                $scope.showMeetStats = !($scope.stats["Zwycięstwo"] == 0 && $scope.stats["Remis"] == 0 && $scope.stats["Porażka"] == 0);
                new Chart($('#meetStats'), {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [$scope.stats["Zwycięstwo"],$scope.stats["Remis"], $scope.stats["Porażka"]],
                            backgroundColor: [
                                '#a7ec50',
                                '#4e4e4e',
                                '#ec1800'
                            ]
                        }],
                        labels: [
                            'Zwycięstwa',
                            'Remis',
                            'Porażki'
                        ]
                    }
                });
            });
        });
    }

    $scope.initModalAddMeeting = function () {
        $scope.isSaved.status = false;
        $scope.meetModel = {
            id_team: $rootScope.user.tmid,
            date: moment().add(2, 'd').format('YYYY-MM-DD HH:mm'),
            description: '',
            enemyName: '',
            teamScore: null,
            enemyScore: null,
            status: 'Oczekiwanie'
        };
        $('#addMeetingListElementModal').modal('open');
        setTimeout(function() {
            M.updateTextFields();
            $('select').formSelect();
        }, 500);
    };



    $scope.addNewMeeting = function () {
        let toValidate = [
            {
                value: $scope.meetModel.enemyName,
                name: "Nazwa drużyny przeciwnej",
                filter:{
                    lengthMin: 2,
                    lengthMax: 50
                }
            },{
                value: $scope.meetModel.description,
                name: "Dodatkowy opis spotkania",
                filter:{
                    lengthMin: 0,
                    lengthMax: 255
                }
            },{
                value: $scope.meetModel.date,
                name: "Data spotkania",
                filter:{
                    isDate: true
                }
            }
        ];

        if($scope.showScoreInAddModal){
            toValidate.push({
                value: $scope.meetModel.teamScore,
                name: "Wynik zespołu",
                filter:{
                    isNumeric: true,
                    min: -200,
                    max: 200
                }
            });
            toValidate.push({
                value: $scope.meetModel.enemyScore,
                name: "Wynik drużyny przeciwnej",
                filter:{
                    isNumeric: true,
                    min: -200,
                    max: 200
                }
            });
        }

        $rootScope.saveMeetComposition(function(compositionData){
            if( validator.valid(toValidate) ){
                $('#addMeetingListElementModal').modal('close');
                request.backend('addNewMeet', { id: $scope.isSaved.status ? $scope.isSaved.id : null,  settings: $rootScope.settingsMeet, meetModel: $scope.meetModel, compositionData: compositionData }, function(data) {
                    $scope.$apply(function() {
                        $scope.isSaved.status = false;
                        $scope.meetingList = data;
                        $scope.meetModel = {
                            id_team: $rootScope.user.tmid,
                            date: moment().add(2, 'd').format('YYYY-MM-DD HH:mm'),
                            description: '',
                            enemyName: '',
                            teamScore: null,
                            enemyScore: null,
                            status: 'Oczekiwanie',
                        };
                        $scope.showScoreInAddModal = false;
                        loadStats();
                    });
                },'Nowe spotkanie dodane');
            }
        });
    };

    $scope.closeMeetView = function(){
        $('#meetView').modal('close');
    };

    $scope.showMeetView = function(index){
        $scope.isSaved.status = false;
        let meet = $scope.meetingList[index];
        $scope.meetViewSelected = {
            date: meet.date,
            compositionData: $.parseJSON(meet.compositionData),
            description: meet.description,
            enemyName: meet.enemyName,
            teamScore: meet.teamScore,
            enemyScore: meet.enemyScore,
            status: meet.status,
        };
        $('#meetView').modal('open');
    };

    $scope.loadModalAddMeeting = function (index,id) {
        let meet = $scope.meetingList[index];
        meetingSelectIndex = index;
        $scope.meetModel = {
            id_team: $rootScope.user.tmid,
            date: moment(meet.date).format('YYYY-MM-DD HH:mm'),
            description: meet.description,
            enemyName: meet.enemyName,
            teamScore: meet.teamScore,
            enemyScore: meet.enemyScore,
            status: meet.status
        };
        $scope.isSaved = {
            status: true,
            id: id
        };
        $('#addMeetingListElementModal').modal('open');
        setTimeout(function() {
            M.updateTextFields();
            $('select').formSelect();
        }, 500);
    };

    $scope.initPlayerComposition = function(){
        $scope.showAnimCreator = true;
        if($scope.isSaved.status){
            let meet = $scope.meetingList[meetingSelectIndex];
            $rootScope.loadMeetingComposition($.parseJSON(meet.compositionData),function(){});
        }else{
            $rootScope.reinitMeetingComposition();
        }
    };

    $scope.getDateFromDateTime = function(dateTime){
        return moment(dateTime).format('YYYY-MM-DD');
    };

    $scope.getTimeFromDateTime = function(dateTime){
        return moment(dateTime).format('HH:mm');
    };

    $scope.putStatus = function(status){
        let textIn = status;
        let color = "#828280";
        switch(textIn){
            case "Oczekiwanie":
                color = "#c6874e";
                break;
            case "Zakończone":
                color = "#40403e";
                break;
            case "Zwycięstwo":
                color = "#7cbc2c";
                break;
            case "Porażka":
                color = "#f45c30";
                break;
            case "Remis":
                color = "#e3c634";
                break;
        }
        return "<span style='color:"+color+"'>"+status+"</span>";
    }

});