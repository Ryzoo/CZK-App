app.controller('showAnalizeController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.fragmentList = [];

    $scope.loadAnalizeById = function() {
        request.backend('getAnalizeFragment', { id: $rootScope.analizeId }, function(data) {
            $scope.$apply(function() {
                for (let i = 0; i < data.length; i++) {
                    var isExist = false;

                    for (let x = 0; x < $scope.fragmentList.length; x++) {
                        if ($scope.fragmentList[x].name == data[i].name) {
                            $scope.fragmentList[x].list.push({
                                start_time: data[i].start_time,
                                end_time: data[i].end_time,
                                url: data[i].url
                            });
                            isExist = true;
                            break;
                        }
                    }

                    if (!isExist) {
                        $scope.fragmentList.push({
                            name: data[i].name,
                            list: [{
                                start_time: data[i].start_time,
                                end_time: data[i].end_time,
                                url: data[i].url
                            }]
                        });
                    }
                }
                $scope.showContent = true;
            });
        });
    }

    $scope.showInPlayer = function(url) {
        $('#videoPlayerContMain').show();
        $('#videoPlayerContMain video').first().attr("src", url);
        $('#videoPlayerContMain video')[0].load();
    }

});