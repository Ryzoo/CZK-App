app.controller('todoController', function($scope, auth, $rootScope) {
    $scope.todoList;
    var basicColor = '#f44336';

    $scope.initToDo = function() {
        getMyTodo();
    }

    $scope.addTodo = function() {
        var titlea = $('#todoText').val();
        var colora = $('#todoColor') ? $('#todoColor').val() : basicColor;

        if (titlea.length <= 3) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Wpisz dłuższy tekst',
                image: '',
                sticky: true,
                time: 5,
                class_name: 'my-sticky-class'
            });
            return;
        }

        if (titlea.length > 100) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Wpisz mniej tekstu',
                image: '',
                sticky: true,
                time: 5,
                class_name: 'my-sticky-class'
            });
            return;
        }

        var dataToSend = { token: Cookies.get('tq'), usid: $rootScope.user.id, title: titlea, color: colora };
        var urlToPost = 'backend/addTodo';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Twoje zadanie zostało dodane',
                        image: '',
                        sticky: true,
                        time: 5,
                        class_name: 'my-sticky-class'
                    });
                    $('#todoText').val('');
                    $('#todoColor').val('#f44336');
                    getMyTodo();
                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Nie udało się dodać zadania',
                        image: '',
                        sticky: true,
                        time: 5,
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać Twoich todo',
                    image: '',
                    sticky: true,
                    time: 5,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.endTodo = function(todoId) {
        var dataToSend = { token: Cookies.get('tq'), tid: todoId };
        var urlToPost = 'backend/endTodo';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Twoje zadanie pomyślnie zakończone',
                        image: '',
                        sticky: true,
                        time: 5,
                        class_name: 'my-sticky-class'
                    });
                    var last = $scope.todoList;
                    var newTodo = [];

                    for (var i = 0; i < last.length; i++) {
                        if (last[i].id != todoId)
                            newTodo.push(last[i]);
                    }
                    $scope.$apply(function() {
                        $scope.todoList = newTodo;
                    });

                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Brak todo do wyświetlenia',
                        image: '',
                        sticky: true,
                        time: 5,
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać Twoich todo',
                    image: '',
                    sticky: true,
                    time: 5,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    function getMyTodo() {
        var dataToSend = { token: Cookies.get('tq') };
        var urlToPost = 'backend/getTodo';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.$apply(function() {
                        $scope.todoList = msg.data;
                    });
                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Brak todo do wyświetlenia',
                        sticky: true,
                        time: 5,
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać Twoich todo',
                    sticky: true,
                    time: 5,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }
});