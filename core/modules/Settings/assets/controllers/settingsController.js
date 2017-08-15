app.controller('settingsController', function($scope, auth, $rootScope, request, notify) {
    $scope.showContent = false;
    $scope.installedModules = [];
    $scope.notInstalledModules = [];

    $scope.initSettings = function() {
        getInstalledModules();
        getAvilableModules();
    }

    $scope.installModule = function(moduleName) {
        var dataToSend = { token: Cookies.get('tq'), name: moduleName };
        var urlToPost = 'backend/installModule';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Moduł zainstalowany. Odświerz stronę, aby zobaczyć zmiany',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                    getInstalledModules();
                    getAvilableModules();
                } else {
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Nie można pobrać listy modułów',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać wydarzeń',
                    image: '',
                    sticky: true,
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.uninstallModule = function(moduleName) {
        var dataToSend = { token: Cookies.get('tq'), name: moduleName };
        var urlToPost = 'backend/uninstallModule';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Moduł odinstalowany. Odświerz stronę, aby zobaczyć zmiany',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                    getInstalledModules();
                    getAvilableModules();
                } else {
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Nie można pobrać listy modułów',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać wydarzeń',
                    image: '',
                    sticky: true,
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    function getInstalledModules() {
        var dataToSend = { token: Cookies.get('tq') };
        var urlToPost = 'backend/getInstalledModules';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    if (msg.data) {
                        $scope.$apply(function() {
                            $scope.installedModules = msg.data;
                        });
                    }
                } else {
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Nie można pobrać listy modułów',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać wydarzeń',
                    image: '',
                    sticky: true,
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    function getAvilableModules() {
        var dataToSend = { token: Cookies.get('tq') };
        var urlToPost = 'backend/getAvailableModules';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    if (msg.data) {
                        $scope.$apply(function() {
                            $scope.notInstalledModules = msg.data;
                            $scope.showContent = true;
                        });
                    }
                } else {
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Nie można pobrać listy modułów',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać wydarzeń',
                    image: '',
                    sticky: true,
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }
});