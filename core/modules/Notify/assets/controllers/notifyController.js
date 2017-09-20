app.controller('notifyController', function($scope, auth, $rootScope, notify, request) {
    $scope.allNotify = [];
    
    request.backend('getAllNotify', { usid: $rootScope.user.id, tmid:$rootScope.user.tmid }, function(data) {
        $scope.$apply(function() {
            $scope.allNotify = data;
            setTimeout(function(){
                $(".prettydate").prettydate();
                $.fn.prettydate.setDefaults();
            },500);
        });
    });

});