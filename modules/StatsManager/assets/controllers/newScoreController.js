app.controller('newScoreController', function($scope, auth, $rootScope, notify, request) {
    $rootScope.showContent = false;
    $scope.categories = [];
    $scope.isSelectedCategory = false;
    $scope.users = [];
    var selectedCategoryId = -1;
    var selectedTestId = -1;
    var selectedUserId = -1;
    var selectedCategoryKey = -1;
    var selectedTestKey = -1;
    $scope.isSelectedTest = false;
    $scope.isSelectedUser = false;
    $scope.scores = [];

    $scope.initScores = function() {
        getAllCategoryWitchTest();
        getAllPlayers();
    }

    function getAllCategoryWitchTest() {
        request.backend('getCategoryWitchTest', {}, function(data) {
            $scope.$apply(function() {
                $scope.categories = data;
                for (key in $scope.categories) {
                    $('#catSelect').append('<option value="' + key + '">' + $scope.categories[key].name + '</option>');
                }
                Materialize.updateTextFields();
                $('select').material_select();
            });
        });
    }

    function checkChange() {
        if ($scope.isSelectedUser && $scope.isSelectedTest && $scope.isSelectedCategory) {
            getUserScore();
        }
    }

    function getUserScore() {
        $scope.scores = [];
        request.backend('getScoreFromTestId', {tmid: $rootScope.user.tmid, tsid: selectedTestId, usid: selectedUserId}, function(data) {
            $scope.$apply(function() {
                $scope.scores = data
            });
        });
    }

    function getAllPlayers() {
        request.backend('getAllPlayers', {tmid: $rootScope.user.tmid}, function(data) {
            $scope.$apply(function() {
                $scope.users = data;
                for (key in data) {
                    if (data[key].roleName == 'ZAWODNIK') {
                        $('#userSelect').append('<option value="' + key + '">' + data[key].firstname + ' ' + data[key].lastname + '</option>');
                    }
                }
                Materialize.updateTextFields();
                $('select').material_select();
                $scope.showContent = true;
            });
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
        if ($.isNumeric($('#scoreInput').val().replace(',', '.'))) {
            var score = parseFloat($('#scoreInput').val().replace(',', '.'));
            request.backend('addScore', {tmid: $rootScope.user.tmid, usid: selectedUserId, tsid: selectedTestId, score: score}, function(data) {
                getUserScore();
                $('#scoreInput').val('');
                notify.addNew(new notify.Notification("Otrzymałeś nowy wynik z kategorii : " + $scope.categories[selectedCategoryKey].name + " -- " + $scope.categories[selectedCategoryKey].tests[selectedTestKey].name, [selectedUserId], "#!/myStats"));
            },'Pomyślnie dodano nowy wynik testu');
        } else {
            notify.localNotify('Walidacja','Wpisz najpierw wynik. Musi być on liczbą.');
        }
    }

    $scope.deleteScore = function(id) {
        request.backend('deleteScore', {tmid: $rootScope.user.tmid, tsid: id}, function(data) {
            $scope.$apply(function() {
                for (key in $scope.scores) {
                    if ($scope.scores[key].id == id) {
                        $scope.scores.splice(key, 1);
                        return;
                    }
                }
            });
        },'Pomyślnie usunięto wynik testu');
    }

    $(document).off('change', '#catSelect');
    $(document).on('change', '#catSelect', function() {
        if($scope.categories.length != 0){
            $scope.isSelectedCategory = true;
            selectedCategoryKey = $(this).val();
            console.log($scope.categories);
            selectedCategoryId = $scope.categories[selectedCategoryKey].id;
            getTest();
        }
    });

    $(document).off('change', '#testSelect');
    $(document).on('change', '#testSelect', function() {
        $scope.isSelectedTest = true;
        selectedTestId = $scope.categories[selectedCategoryKey].tests[$(this).val()].id;
        selectedTestKey = $(this).val();
        checkChange();
    });

    $(document).off('change', '#userSelect');
    $(document).on('change', '#userSelect', function() {
        $scope.isSelectedUser = true;
        selectedUserId = $scope.users[$(this).val()].usid;
        checkChange();
    });

    $scope.deleteUserScore = function(id) {
        $scope.showTest = false;
        $scope.selectedCategoryId = -1;
        request.backend('deleteCategoryTest', {id: id}, function(data) {
            getAllCategoryWitchTest();
        },'Pomyślnie usunięto kategorie');
    }

    $scope.addUserScore = function() {
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

        request.backend('addCategoryTest', {name: categoryName}, function(data) {
            getAllCategoryWitchTest();
        }, "Pomyślnie dodano nową kategorie");
    }

    $scope.selectCategory = function(id) {
        $scope.selectedCategoryId = id;
        $scope.showTest = true;
        getActualTest();
    }

});