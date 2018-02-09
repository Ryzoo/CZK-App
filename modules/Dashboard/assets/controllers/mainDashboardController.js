app.controller('mainDashboardController', function($scope, auth, $rootScope, request, notify) {
    $scope.nowEvents = [];
    $scope.nextEvents = [];
    $scope.lastPost = [];
    $scope.showContent = true;
    $scope.isLoadedPost = false;
    $scope.todayInt = (new Date()).getDay();
    $scope.licenseDate = [];


    $scope.getAllEvents = function() {
        if ($rootScope.user.tmid && $rootScope.user.tmid != "") {
            $scope.getNextEvents();
            $scope.getNowStartEvents();
            $scope.getLastPost();
        }
    }

    $scope.getNextEvents = function() {
        if($rootScope.user.tmid && $rootScope.user.tmid != '')
        request.backend('getNextEvents', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.nextEvents = data;
            });
        });
    }

    $scope.getLicenseDate = function() {
        if($rootScope.user.tmid && $rootScope.user.tmid != '')
        request.backend('getCountOfLicenseData', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.licenseDate = data;
            });
        });
    }

    $scope.getNowStartEvents = function() {
        if($rootScope.user.tmid && $rootScope.user.tmid != '')
        request.backend('getNowEvents', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.nowEvents = data;
            });
        });
    }

    $scope.getLastPost = function() {
        if($rootScope.user.tmid && $rootScope.user.tmid != '')
        request.backend('getLastPost', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.lastPost = data;
                if (data.length > 0)
                    $scope.isLoadedPost = true;


            });
        });
    }

    function colorpickerTest() {
        var colorInput;
        colorInput = $('<input type="color" value="!" />')[0];
        return colorInput.type === 'color' && colorInput.value !== '!';
    };

    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var monthName;

    switch (month) {
        case 1:
            monthName = 'Stycznia';
            break;
        case 2:
            monthName = 'Lutego';
            break;
        case 3:
            monthName = 'Marca';
            break;
        case 4:
            monthName = 'Kwietnia';
            break;
        case 5:
            monthName = 'Maja';
            break;
        case 6:
            monthName = 'Czerwca';
            break;
        case 7:
            monthName = 'Lipca';
            break;
        case 8:
            monthName = 'Sierpnia';
            break;
        case 9:
            monthName = 'Wrzesnia';
            break;
        case 10:
            monthName = 'Października';
            break;
        case 11:
            monthName = 'Listopada';
            break;
        case 12:
            monthName = 'Grudnia';
            break;
        default:
            "Błędny miesiąc";
    }
    $(".today-date").html(day + " " + monthName);
});