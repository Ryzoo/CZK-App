app.controller('compositionController', function($scope, auth, $rootScope, request, notify, statistic) {
    $scope.showContent = false;
    $scope.meetViewSelected = [];

    $scope.initComposition = function() {
        request.backend('getNextMatchComposition', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.meetViewSelected = data;
                if(data != null && data != [] && data.length > 0){
                    $scope.meetViewSelected.date = moment($scope.meetViewSelected.date).format('YYYY-MM-DD HH:mm');
                    $scope.meetViewSelected.compositionData = $scope.meetViewSelected.compositionData && $scope.meetViewSelected.compositionData.length > 10 ? $.parseJSON($scope.meetViewSelected.compositionData) : null;
                }
                 $scope.showContent = true;
            });
        });
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