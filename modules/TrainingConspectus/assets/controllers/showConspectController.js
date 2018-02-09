app.controller('showConspectController', function($scope, auth, $rootScope, notify, request, $location, $compile) {
    $scope.showContent = false;
    $scope.conspect = null;

    $scope.initConspect = function() {
        if ($rootScope.consepectShowId && $rootScope.consepectShowId != null && $rootScope.consepectShowId >= 0) {
            $scope.loadConspect($rootScope.consepectShowId);
            $rootScope.consepectShowId = null;
        }
    }

    $scope.loadConspect = function(id) {
        request.backend('getFullConspectById', { id: id }, function(data) {
            $scope.$apply(function() {
                $scope.conspect = data;
                $scope.conspect.tags = $scope.conspect.tags.replace('  ', ' ');
                $scope.conspect.tags = $scope.conspect.tags.split(' ');
                $scope.showContent = true;
            });

            setTimeout(function() {
                $('.collapsible').collapsible();
                $('.gifplayer').each(function() {
                    if (!$(this).hasClass('isGifed')) {
                        $(this).addClass('isGifed');
                        $(this).gifplayer();
                    }
                }); 
            }, 500);
        });
    }

});