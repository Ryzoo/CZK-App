app.controller('testMenagerController', function($scope, auth, $rootScope, notify, request) {
    $rootScope.showContent = false;
    $scope.categories = [];
    $scope.tests = [];
    $scope.showTest = false;
    $scope.selectedCategoryId = -1;

    $scope.initTestMenager = function() {
        getAllCategoryWitchTest();
    }

    function getAllCategoryWitchTest() {
        request.backend('getCategoryWitchTest', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.showContent = true;
                $scope.categories = data;
                for (var i = 0; i < $scope.categories.length; i++) {
                    $scope.categories[i].testCount = $scope.categories[i].tests ? $scope.categories[i].tests.length : 0;
                }
                if ($scope.selectedCategoryId && $scope.selectedCategoryId != -1) {
                    getActualTest();
                }
            });
        });
    }

    $scope.deleteCategory = function(id) {
        $scope.showTest = false;
        $scope.selectedCategoryId = -1;
        request.backend('deleteCategoryTest', { id: id }, function(data) {
            $scope.$apply(function() {
                getAllCategoryWitchTest();
            });
        }, 'Pomyślnie usunięto kategorie');
    }

    $scope.deleteTest = function(id) {
        request.backend('deleteTestFromCat', { id: id }, function(data) {
            $scope.$apply(function() {
                getAllCategoryWitchTest();
            });
        }, 'Pomyślnie usunięto test');
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

        request.backend('addCategoryTest', { name: categoryName }, function(data) {
            $scope.$apply(function() {
                getAllCategoryWitchTest();
            });
        }, 'Pomyślnie dodano nową kategorie');
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

        request.backend('addTestToCategory', { best: best, worst: worst, caid: $scope.selectedCategoryId, name: name, tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                getAllCategoryWitchTest();
            });
        }, 'Pomyślnie dodano nowy test do kategorii');

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
        $('#category-' + $scope.selectedCategoryId).css('background', 'rgba(255, 255, 255, 0.1)');
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].id == $scope.selectedCategoryId) {
                $scope.tests = $scope.categories[i].tests;
                break;
            }
        }
    }

    $(document).off('change', '.changeBest');
    $(document).on('change', '.changeBest', function() {
        var newBest = $(this).val();
        if (!$.isNumeric(newBest)) {
            notify.localNotify('Walidacja', 'Najwiekszy możliwy wynik musi być liczbą');
            return;
        }
        var id = ($(this).attr('id').split("-"))[1];
        changeTest(id, newBest, 'best');
    });

    $(document).off('change', '.changeWorst');
    $(document).on('change', '.changeWorst', function() {
        var newWorst = $(this).val();
        if (!$.isNumeric(newWorst)) {
            notify.localNotify('Walidacja', 'Najgorszy możliwy wynik musi być liczbą');
            return;
        }
        var id = ($(this).attr('id').split("-"))[1];
        changeTest(id, newWorst, 'worst');
    });

    function changeTest(id, value, changeType) {

        request.backend('changeTest', { id: id, value: value, changeType: changeType }, function(data) {
            $scope.$apply(function() {
                getAllCategoryWitchTest();
            });
        }, 'Pomyślnie edytowano test');

    }

});