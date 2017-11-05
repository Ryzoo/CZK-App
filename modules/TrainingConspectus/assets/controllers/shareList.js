app.controller('shareList', function($scope, auth, $rootScope, notify, request, $location, $compile) {
    $scope.showContent = false;
    $scope.shareList = [];

    $scope.loadSharedList = function(){
        request.backend('getSharedListForAnim', { aid: $rootScope.sharedAnimId  }, function(data) {
            $scope.$apply(function(){
                $scope.shareList = data;
                loadAvailableMasterList();
                $scope.showContent = true;
            });
        });
    }

    function loadAvailableMasterList(){
        request.backend('getAvailableSharedMasterForAnim', { aid: $rootScope.sharedAnimId  }, function(data) {
            $('#autocompleteMaster').autocomplete({
                data: data,
                limit: 20,
                minLength: 1,
                onAutocomplete: function(val) {
                    console.log(val);
                    $usid = val.split("-")[1];
                    addShareToAnim($usid);
                }
            });
        });
    }

    function addShareToAnim(usid){
        request.backend('addSharedForAnim', { aid: $rootScope.sharedAnimId, usid: usid  }, function(data) {
            $scope.loadSharedList();
        }, "Dodano pozwolenie na wgląd");
    }

    $scope.deleteFromShared = function(usid){
        request.backend('deleteSharedForAnim', { aid: $rootScope.sharedAnimId, usid: usid  }, function(data) {
            $scope.loadSharedList();
        }, "Usunięto pozwolenie na wgląd");
    }

});