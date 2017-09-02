app.controller('todoController', function($scope, auth, $rootScope, request, notify) {
    $scope.todoList;
    $scope.selectedColor = '#ff0000';
    $scope.selectedKey = 1;

    $scope.initToDo = function() {
        getMyTodo();
        setInputColor();
    }

    $scope.addTodo = function() {
        var titlea = $('#todoText').val();
        var colora = $scope.selectedColor;

        if (titlea.length <= 3) {
            notify.localNotify('Walidacja', "Wpisz dłuższy tekst");
            return;
        }

        if (titlea.length > 50) {
            notify.localNotify('Walidacja', "Wpisz mniej tekstu");
            return;
        }
        
        var dataToSend = { usid: $rootScope.user.id, title: titlea, color: colora };
        request.backend('addTodo', dataToSend, function() {
            $('#todoText').val('');
            $('#todoColor').val('#f44336');
            getMyTodo();
        }, "Twoje zadanie zostało dodane");
    }

    $scope.endTodo = function(todoId) {
        request.backend('endTodo', { tid: todoId }, function() {
            var last = $scope.todoList;
            var newTodo = [];
            for (var i = 0; i < last.length; i++) {
                if (last[i].id != todoId)
                    newTodo.push(last[i]);
            }
            $scope.$apply(function() {
                $scope.todoList = newTodo;
            });
        }, "Twoje zadanie pomyślnie zakończone");
    }

    $scope.selectColor = function(key, value) {
        $scope.selectedColor = value;
        $scope.selectedKey = key;
        setInputColor();
    }

    function getMyTodo() {
        request.backend('getTodo', {}, function(data) {
            $scope.$apply(function() {
                $scope.todoList = data;
            });
        });
    }

    function setInputColor() {
        $("#todoText").css("border-color", $scope.selectedColor);
        $("#todoButton").css("border-color", $scope.selectedColor);
    }

    $(document).on("click", "", function() {

    });
});