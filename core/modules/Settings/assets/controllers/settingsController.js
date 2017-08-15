app.controller('settingsController', function($scope, auth, $rootScope, request, notify) {
    $scope.showContent = false;
    $scope.installedModules = [];
    $scope.notInstalledModules = [];

    $scope.initSettings = function() {
        getInstalledModules();
        getAvilableModules();
    }

    $scope.installModule = function(moduleName) {
        request.backend('installModule', { name: moduleName }, function(data) {
            getInstalledModules();
            getAvilableModules();
        }, "Moduł zainstalowany. Odświerz stronę, aby zobaczyć zmiany");
    }

    $scope.uninstallModule = function(moduleName) {
        request.backend('uninstallModule', { name: moduleName }, function(data) {
            getInstalledModules();
            getAvilableModules();
        }, "Moduł odinstalowany. Odświerz stronę, aby zobaczyć zmiany");
    }

    $scope.addModule = function() {
        if ($('#moduleFile').get(0).files.length === 0) {
            notify.localNotify('Walidacja', "Dodaj najpierw plik modułu");
            return;
        }
        var data = new FormData($('#addModuleForm')[0]);
        request.backend('addModule', data, function() {
            getAvilableModules();
        }, "Moduł dodany pomyślnie", true);
    }

    function getInstalledModules() {
        request.backend('getInstalledModules', {}, function(data) {
            $scope.$apply(function() {
                $scope.installedModules = data;
            });
        });
    }

    function getAvilableModules() {
        request.backend('getAvailableModules', {}, function(data) {
            $scope.$apply(function() {
                $scope.notInstalledModules = data;
                $scope.showContent = true;
            });
        });
    }
});