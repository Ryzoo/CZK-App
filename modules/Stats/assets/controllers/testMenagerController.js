app.controller('testMenagerController', function($scope, auth, $rootScope, notify) {
    $rootScope.showContent = false;
    $scope.categories = [];
    $scope.tests = [];
    $scope.showTest = false;
    $scope.selectedCategoryId = -1;

    $scope.initTestMenager = function() {
        getAllCategoryWitchTest();
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
                    $scope.$apply(function() {
                        $scope.showContent = true;
                        $scope.categories = msg.data;
                        for (var i = 0; i < $scope.categories.length; i++) {
                            $scope.categories[i].testCount = $scope.categories[i].tests ? $scope.categories[i].tests.length : 0;
                        }
                        if ($scope.selectedCategoryId && $scope.selectedCategoryId != -1) {
                            getActualTest();
                        }
                    });
                } else {
                    if (msg.error)
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
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
                    text: 'Niestety nie udało się pobrać danych',
                    image: '',
                    sticky: true,
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.deleteCategory = function(id) {
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
                        time: 3,
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
                            time: 3,
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
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.deleteTest = function(id) {
        var dataToSend = { token: Cookies.get('tq'), id: id };
        var urlToPost = 'backend/deleteTestFromCat';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Pomyślnie usunięto test',
                        image: '',
                        sticky: true,
                        time: 3,
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
                            time: 3,
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
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.addCategory = function() {
        var categoryName = $('#categoryName').val();
        if (categoryName.length < 2) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Wpisz dłuższą nazwę kategorii',
                image: '',
                sticky: true,
                time: 3,
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
                        time: 3,
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
                            time: 3,
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
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.addTest = function() {
        var best = $('#maxScore').val();
        var worst = $('#minScore').val();
        var name = $('#testName').val();
        if (!best || !worst || !$.isNumeric(best) || !$.isNumeric(worst)) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Pola najlepszego i najgorszego wyniku muszą być liczbą',
                image: '',
                sticky: true,
                time: 3,
                class_name: 'my-sticky-class'
            });
            return;
        }
        if (!name || name.length < 3) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Wpisz poprawnie nazwe testu. Minimum 3 znaki',
                image: '',
                sticky: true,
                time: 3,
                class_name: 'my-sticky-class'
            });
            return;
        }
        if (!$scope.selectedCategoryId || $scope.selectedCategoryId == -1) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Coś poszło nie tak. Wybierz ponownie kategorie z tabeli',
                image: '',
                sticky: true,
                time: 3,
                class_name: 'my-sticky-class'
            });
            $scope.selectedCategoryId = -1;
            $scope.showTest = false;
            return;
        }
        var dataToSend = { token: Cookies.get('tq'), best: best, worst: worst, caid: $scope.selectedCategoryId, name: name };
        var urlToPost = 'backend/addTestToCategory';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: "Pomyślnie dodano nowy test do kategorii",
                        image: '',
                        sticky: true,
                        time: 3,
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
                            time: 3,
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
                    time: 3,
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

    function getActualTest() {
        $('.category-item').each(function() {
            $(this).css('background', '');
        });
        $('#category-' + $scope.selectedCategoryId).css('background', '#13202f');
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].id == $scope.selectedCategoryId) {
                $scope.tests = $scope.categories[i].tests;
                break;
            }
        }
    }

    $(document).on('change', '.changeBest', function() {
        var newBest = $(this).val();
        if (!$.isNumeric(newBest)) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Najwiekszy możliwy wynik musi być liczbą',
                image: '',
                sticky: true,
                time: 3,
                class_name: 'my-sticky-class'
            });
            return;
        }
        var id = ($(this).attr('id').split("-"))[1];
        changeTest(id, newBest, 'best');
    });
    $(document).on('change', '.changeWorst', function() {
        var newWorst = $(this).val();
        if (!$.isNumeric(newWorst)) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Najgorszy możliwy wynik musi być liczbą',
                image: '',
                sticky: true,
                time: 3,
                class_name: 'my-sticky-class'
            });
            return;
        }
        var id = ($(this).attr('id').split("-"))[1];
        changeTest(id, newWorst, 'worst');
    });

    function changeTest(id, value, changeType) {
        var dataToSend = { token: Cookies.get('tq'), id: id, value: value, changeType: changeType };
        var urlToPost = 'backend/changeTest';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: "Pomyślnie edytowano test",
                        image: '',
                        sticky: true,
                        time: 3,
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
                            time: 3,
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
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

});
