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

    $scope.initMainSettings = function() {
        getMainSettings();
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
                        if ($scope.allThemes[i] == $scope.actualTheme)
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

    function getMainSettings() {
        request.backend('getMainPageSettings', {}, function(data) {
            $rootScope.$apply(function() {
                $rootScope.mainSettings = data;
                $(document).ready(function() {
                    Materialize.updateTextFields();
                });
            });
            $scope.showContent = true;
        });
    }

    $(document).on("change", "#selectThemes", function() {
        request.backend('setCurrentTheme', { name: $(this).val() }, null, "Pomyślnie zmieniono szablon. Odśwież stronę, aby zobaczyć zmiany. (ctrl+f5)");
    });

    $(document).on("change", "#logoFile", function() {
        if ($('#logoFile').get(0).files.length === 0) {
            notify.localNotify('Walidacja', "Dodaj poprawnie plik loga");
            return;
        }
        var data = new FormData($('#addLogoForm')[0]);
        request.backend('changePageLogo', data, function() {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#prevLogo').attr('src', e.target.result);
            }
            reader.readAsDataURL($('#logoFile').get(0).files[0]);
        }, "Logo zmienione pomyślnie", true);
    });

    $(document).on("change", "#backFile", function() {
        if ($('#backFile').get(0).files.length === 0) {
            notify.localNotify('Walidacja', "Dodaj poprawnie plik tła");
            return;
        }
        var data = new FormData($('#addBackgroundForm')[0]);
        request.backend('changePageBackground', data, function() {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#prevBack').attr('src', e.target.result);
            }
            reader.readAsDataURL($('#backFile').get(0).files[0]);
        }, "Tło strony logowania zmienione pomyślnie", true);
    });

    $(document).on("change", "#icoFile", function() {
        if ($('#icoFile').get(0).files.length === 0) {
            notify.localNotify('Walidacja', "Dodaj poprawnie plik tła");
            return;
        }
        var data = new FormData($('#addIconForm')[0]);
        request.backend('changePageIcon', data, function() {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#prevIconPage').attr('src', e.target.result);
            }
            reader.readAsDataURL($('#icoFile').get(0).files[0]);
        }, "Ikona strony zmieniona pomyślnie", true);
    });

    $(document).on("change", "#appName", function() {
        if ($('#appName').val().length < 3) {
            notify.localNotify('Walidacja', "Wpisz dłuższą nazwę aplikacji");
            return;
        }
        request.backend('changeAppMainSettings', { appName: $('#appName').val() }, function() {
            getMainSettings();
        }, "Pomyślnie zapisano");
    });




});