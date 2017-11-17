app.controller('showAnalizeController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.fragmentList = [];

    $scope.loadAnalizeById = function() {
        request.backend('getAnalizeFragment', { id: $rootScope.analizeId }, function(data) {
            $scope.$apply(function() {
                for (let i = 0; i < data.length; i++) {
                    var isExist = false;
                    if ($scope.fragmentList[i].name == data[i].name) {
                        $scope.fragmentList[i].list.push({
                            start_time: data[i].start_time,
                            end_time: data[i].end_time
                        });
                        isExist = true;
                        break;
                    }
                    if (!finded) {
                        $scope.fragmentList.push({
                            name: data[i].name,
                            list: [{
                                start_time: data[i].start_time,
                                end_time: data[i].end_time
                            }]
                        });
                    }
                }
            });
        });
    }

});