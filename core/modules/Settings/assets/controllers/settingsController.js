app.controller('settingsController', function($scope, auth, $rootScope, request, notify) {
    $scope.showContent = false;
    $scope.installedModules = [];
    $scope.notInstalledModules = [];
    $scope.actualTheme = "";
    $scope.allThemes = [];

    $scope.initSettings = function() {
        getInstalledModules();
        getAvilableModules();
    }

    $scope.initThemes = function() {
        getActualThemes();
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

    function getActualThemes() {
        request.backend('getCurrentThemes', {}, function(data) {
            $scope.$apply(function() {
                $scope.actualTheme = data;
            });
            request.backend('getAvailableThemes', {}, function(data) {
                $scope.$apply(function() {
                    $scope.allThemes = data;
                    $scope.showContent = true;
                    $('#selectThemes').html('');
                    $('#selectThemes').append("<option value='' disabled >Szablony</option>");
                    for (var i = 0; i < $scope.allThemes.length; i++) {
                        if ($scope.allThemes == $scope.actualTheme)
                            $('#selectThemes').append("<option value='" + $scope.allThemes[i] + "' selected>" + $scope.allThemes[i] + "</option>");
                        else
                            $('#selectThemes').append("<option value='" + $scope.allThemes[i] + "'>" + $scope.allThemes[i] + "</option>");
                    }
                    $('select').material_select();
                });
            });
        });
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

    $(document).on("change", "#selectThemes", function() {
        request.backend('setCurrentTheme', { name: $(this).val() }, null, "Pomyślnie zmieniono szablon. Odśwież stronę, aby zobaczyć zmiany. (ctrl+f5)");
    });
});