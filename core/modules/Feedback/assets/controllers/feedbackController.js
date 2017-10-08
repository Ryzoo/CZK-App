app.controller('feedbackController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.raportsList = [];

    $scope.initFeedback = function() {
        $scope.showContent = true;
    }

    $scope.sendFeedback = function() {
        var content  = $('#contentFeed').val();
        var type = $rootScope.feedType;
        if(!content || content.length <= 5 ){
            notify.localNotify("Walidacja","Prosimy o wpisanie dłuższej wiadomości.");
            return;
        }
        request.backend('sendFeedback', { 
            firstname: $rootScope.user.firstname,
            lastname: $rootScope.user.lastname,
            tmid: $rootScope.user.tmid,
            content: content,
            type: type
         }, function(data) {
            $('#contentFeed').val('');
         },"Dziękujemy za udział w poprawie standardów naszej platformy :)");
    }
});