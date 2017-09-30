app.controller('TrainingConspectusController', function($scope, auth, $rootScope, notify, request, $location) {
    $scope.showContent = false;
    $scope.animArray = [];
    $scope.searchText = '';

    $scope.initConsectusCreate = function() {
        $scope.showContent = true;
    }

    $scope.changeSearch = function(name) {
        $scope.searchText = name;
        console.log($scope.searchText);
    }

    $scope.initConsAnimList = function() {
        request.backend('getListOfAnimConspect', {}, function(data) {
            $scope.animArray = data;
            for (var i = 0; i < $scope.animArray.length; i++) {
                var tags = $scope.animArray[i].tags.split(" ");
                $scope.animArray[i].tags = [];
                for (var x = 0; x < tags.length; x++) {
                    $scope.animArray[i].tags.push(tags[x]);
                }
            }
            $scope.showContent = true;
            $rootScope.idFromAnimConspectToEdit = null;
        });
    }

    $scope.editAnimCon = function(id) {
        $rootScope.idFromAnimConspectToEdit = id;
        $location.url("/conspectusAnim");
    }

    $scope.deleteAnimCon = function(id) {
        request.backend('deleteAnimConspect', { id: id }, function(data) {
            $scope.initConsAnimList();
        }, "Pomyślnie usunięto");
    }

});