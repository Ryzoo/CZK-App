app.controller('newScoreController', function($scope, auth, $rootScope, notify) {
    $rootScope.showContent = false;
    $scope.categories = [];
    $scope.isSelectedCategory = false;
    $scope.users = [];
    var selectedCategoryId = -1;
    var selectedTestId = -1;
    var selectedUserId = -1;
    var selectedCategoryKey = -1;
    $scope.isSelectedTest = false;
    $scope.isSelectedUser = false;
    $scope.scores = [];

    $scope.initScores = function() {
        getAllCategoryWitchTest();
        getAllPlayers();
    }

    function getAllCategoryWitchTest() {
        var dataToSend = { token: Cookies.get('tq') };
        var urlToPost = 'backend/getCategoryWitchTest';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.showContent = true;
                    $scope.categories = msg.data;
                    for (key in $scope.categories) {
                        $('#catSelect').append('<option value="' + key + '">' + $scope.categories[key].name + '</option>');
                    }
                    Materialize.updateTextFields();
                    $('select').material_select();
                } else {
                    if (msg.error)
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    function checkChange() {
        if ($scope.isSelectedUser && $scope.isSelectedTest && $scope.isSelectedCategory) {
            getUserScore();
        }
    }

    function getUserScore() {
        $scope.scores = [];
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid, tsid: selectedTestId, usid: $rootScope.user.id };
        var urlToPost = 'backend/getScoreFromTestId';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.scores = msg.data
                } else {
                    if (msg.error)
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    function getAllPlayers() {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getAllPlayers';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.users = msg.data;
                    for (key in msg.data) {
                        if (msg.data[key].roleName) {
                            $('#userSelect').append('<option value="' + key + '">' + msg.data[key].firstname + ' ' + msg.data[key].lastname + '</option>');

                        }
                    }
                    Materialize.updateTextFields();
                    $('select').material_select();
                } else {
                    if (msg.error)
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    function getTest() {
        $('#testSelect').html('');
        $('#testSelect').append('<option value="" disabled selected>Test</option>');
        $scope.isSelectedTest = false;
        selectedTestId = -1
        if ($scope.categories[selectedCategoryKey].tests) {
            for (key in $scope.categories[selectedCategoryKey].tests) {
                $('#testSelect').append('<option value="' + key + '">' + $scope.categories[selectedCategoryKey].tests[key].name + '</option>');
            }
        }
        Materialize.updateTextFields();
        $('select').material_select();
    }

    $scope.addScore = function() {
        if ($.isNumeric($('#scoreInput').val())) {
            var score = parseFloat($('#scoreInput').val());
            var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid, usid: selectedUserId, tsid: selectedTestId, score: score };
            var urlToPost = 'backend/addScore';
            $.ajax({
                url: urlToPost,
                type: "POST",
                data: dataToSend,
                async: true,
                success: function(msg) {
                    if (msg.success) {
                        $.gritter.add({
                            title: 'Sukces',
                            text: 'Pomyślnie dodano nowy wynik testu',
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                        getUserScore();
                    } else {
                        if (msg.error)
                            $.gritter.add({
                                title: 'Bład',
                                text: msg.error,
                                image: '',
                                sticky: true,
                                time: '5',
                                class_name: 'my-sticky-class'
                            });
                    }
                },
                error: function(jqXHR, textStatus) {
                    console.log("Blad podczas laczenia z serverem: " + textStatus);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety nie udało się pobrać danych',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                },
            });
        } else {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Wpisz najpierw wynik. Musi być on liczbą.',
                image: '',
                sticky: true,
                time: '5',
                class_name: 'my-sticky-class'
            });
        }
    }

    $scope.deleteScore = function(id) {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid, tsid: id };
        var urlToPost = 'backend/deleteScore';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Pomyślnie usunięto wynik testu',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    $scope.$apply(function() {
                        for (key in $scope.scores) {
                            if ($scope.scores[key].id == id) {
                                $scope.scores.splice(key, 1);
                                return;
                            }
                        }
                    });
                } else {
                    if (msg.error)
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $(document).on('change', '#catSelect', function() {
        $scope.isSelectedCategory = true;
        selectedCategoryId = $scope.categories[$(this).val()].id;
        selectedCategoryKey = $(this).val();
        getTest();
    });

    $(document).on('change', '#testSelect', function() {
        $scope.isSelectedTest = true;
        selectedTestId = $scope.categories[selectedCategoryKey].tests[$(this).val()].id;
        checkChange();
    });

    $(document).on('change', '#userSelect', function() {
        $scope.isSelectedUser = true;
        selectedUserId = $scope.users[$(this).val()].usid;
        checkChange();
    });

    $scope.deleteUserScore = function(id) {
        $scope.showTest = false;
        $scope.selectedCategoryId = -1;
        var dataToSend = { token: Cookies.get('tq'), id: id };
        var urlToPost = 'backend/deleteCategoryTest';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Pomyślnie usunięto kategorie',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    getAllCategoryWitchTest();
                } else {
                    if (msg.error)
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.addUserScore = function() {
        var categoryName = $('#categoryName').val();
        if (categoryName.length < 2) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Wpisz dłuższą nazwę kategorii',
                image: '',
                sticky: true,
                time: '5',
                class_name: 'my-sticky-class'
            });
            return;
        }
        var dataToSend = { token: Cookies.get('tq'), name: categoryName };
        var urlToPost = 'backend/addCategoryTest';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: "Pomyślnie dodano nową kategorie",
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    getAllCategoryWitchTest();

                } else {
                    if (msg.error)
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.selectCategory = function(id) {
        $scope.selectedCategoryId = id;
        $scope.showTest = true;
        getActualTest();
    }

});