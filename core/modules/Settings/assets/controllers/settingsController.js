app.controller('settingsController', function($scope, auth, $rootScope, request, notify) {
    $scope.showContent = false;
    $scope.installedModules = [];
    $scope.notInstalledModules = [];
    $scope.toUpdateModule = [];
    $scope.actualTheme = "";
    $scope.allThemes = [];

    $scope.initSettings = function() {
        getInstalledModules();
        getAvilableModules();
    };

    $scope.initThemes = function() {
        getActualThemes();
    };

    $(document).off('change','#appPredispositionSelect');
    $(document).on('change','#appPredispositionSelect',function(){
        $rootScope.mainSettings.appPredisposition = $('#appPredispositionSelect').val();
        updateAppPredisposition();
    });

    $scope.initMainSettings = function() {
        getMainSettings();
        $('#appPredispositionSelect option[value="'+$rootScope.mainSettings.appPredisposition+'"]').prop('selected', true);
        $('select').formSelect();


    };

    function updateAppPredisposition() {
        request.backend('updateAppPredisposition', {appPred: $rootScope.mainSettings.appPredisposition}, function(data) {},'Zmieniono predyspozycję aplikacji');
    }

    $scope.installModule = function(moduleName) {
        request.backend('installModule', { name: moduleName }, function(data) {
            getInstalledModules();
            getAvilableModules();
        }, "Moduł zainstalowany. Odświerz stronę, aby zobaczyć zmiany");
    };

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

    $scope.checkAppUpdate = function() {
        notify.localNotify("Update", "Posiadasz aktualną wersję aplikacji");
    }

    $scope.checkUpdateModule = function() {
        request.backend('checkModuleUpdate', {}, function(data) {
            $scope.$apply(function() {
                $scope.toUpdateModule = data;
            });
        });
    }

    $scope.updateModule = function(moduleName) {
        request.backend('installUpdateToModule', { moduleName: moduleName }, function(data) {

        }, "Moduł zaktualizowany pomyślnie. Odświerz stronę, aby zobaczyć zmiany.");
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
                    $('select').formSelect();

                });
            });
        });
    }

    function getInstalledModules() {
        request.backend('getInstalledModules', {}, function(data) {
            $scope.$apply(function() {
                for (var i = 0; i < data.length; i++) {
                    var req = "";
                    for (var j = 0; j < data[i].require.length; j++) {
                        req += " " + data[i].require[j];
                    }
                    data[i].require = req;
                }
                $scope.installedModules = data;
            });
        });
    }

    function getAvilableModules() {
        request.backend('getAvailableModules', {}, function(data) {
            $scope.$apply(function() {
                for (var i = 0; i < data.length; i++) {
                    var req = "";
                    for (var j = 0; j < data[i].require.length; j++) {
                        req += " " + data[i].require[j];
                    }
                    data[i].require = req;
                }
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
                    M.updateTextFields();
                });

            });
            $scope.$apply(function() {
                $scope.showContent = true;
            });
        });
    }

    $(document).off("change", "#selectThemes");
    $(document).on("change", "#selectThemes", function() {
        request.backend('setCurrentTheme', { name: $(this).val() }, null, "Pomyślnie zmieniono szablon. Odśwież stronę, aby zobaczyć zmiany. (ctrl+f5)");
    });

    $(document).off("change", "#logoFile");
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

    $(document).off("change", "#moduleFile");
    $(document).on("change", "#moduleFile", function() {
        $scope.addModule();
    });

    $(document).off("change", "#backFile");
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

    $(document).off("change", "#icoFile");
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

    $(document).off("change", "#appName");
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