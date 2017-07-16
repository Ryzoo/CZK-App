app.controller('tabController', function($scope, auth, $rootScope, notify) {
    $scope.lastId = 0;
    $scope.posts = [];
    $scope.maxPost = 5;

    $scope.morePost = function() {
        $scope.maxPost += 5;
    }

    $scope.moreComment = function(id) {
        for (var i = 0; i < $scope.posts.length; i++) {
            if ($scope.posts[i].psid == id) {
                $scope.posts[i].maxComment += 5;
                return;
            }
        }
    }

    $scope.getLastPost = function() {
        $rootScope.showContent = false;
        var dataToSend = { token: Cookies.get('tq'), last: $scope.lastId, tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getPost';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    for (var i = 0; i < msg.data.length; i++) {
                        $scope.$apply(function() {
                            $scope.posts.push(msg.data[i]);
                            $scope.posts[i].maxComment = 1;
                        });
                    }
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.showContent = true;
                        });
                    }, 500);
                    if (msg.data[0] != null && msg.data[0].psid != null) $scope.lastId = msg.data[0].psid;

                } else {
                    console.log(msg);
                    $(document).ready(function() {
                        var unique_id = $.gritter.add({
                            title: 'Bład',
                            text: 'Brak postów do wyświetlenia',
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $(document).ready(function() {
                    var unique_id = $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety nie udało się pobrać postów',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                });
            },
        });
    }

    $scope.addPost = function() {
        $('#errorNewPost').html("").hide();
        var message = $("#newPostInput").val();
        if (message.length < 5 || message.length > 500) {
            $.gritter.add({
                title: 'Walidacja',
                text: 'Wiadomosc musi być dłuższa niż 5 znaków oraz krótsza niż 500',
                image: '',
                sticky: true,
                time: '5',
                class_name: 'my-sticky-class'
            });
            return;
        }
        var dataToSend = { token: Cookies.get('tq'), msg: message, tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/addPost';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.getLastPost();
                    $.gritter.add({
                        title: 'Dodawanie postu',
                        text: 'Twój post został pomyślnie dodany',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    notify.addNew(new notify.Notification($rootScope.user.firstname + " " + $rootScope.user.lastname + " dodał post", null, "#!/tab", true));
                } else {
                    console.log(msg.error);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety coś poszło źle',
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
                    text: 'Niestety coś poszło źle',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.addComment = function(psid) {
        var message = $("#tx_" + psid).val();
        if (message.length < 5 || message.length > 500) {
            $.gritter.add({
                title: 'Bład',
                text: 'Komentarz musi zawierać od 5 do 500 znaków',
                image: '',
                sticky: true,
                time: '5',
                class_name: 'my-sticky-class'
            });
            return;
        }
        var dataToSend = { token: Cookies.get('tq'), msg: message, post_id: psid };
        var urlToPost = 'backend/addComment';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.lastId = 0;
                    $scope.posts = [];
                    $scope.getLastPost();
                    $.gritter.add({
                        title: 'Dodanie komentarza',
                        text: 'Twój komentarz został pomyślnie dodany',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                } else {
                    console.log(msg.error);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety coś poszło źle',
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
                    text: 'Niestety coś poszło źle',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.deletePost = function(id) {

        var dataToSend = { token: Cookies.get('tq'), psid: id };
        var urlToPost = 'backend/deletePost';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.lastId = 0;
                    $scope.posts = [];
                    $scope.getLastPost();
                    $.gritter.add({
                        title: 'Usuwanie posta',
                        text: 'Post został usunięty pomyślnie',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                } else {
                    console.log(msg.error);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety coś poszło źle',
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
                    text: 'Niestety coś poszło źle',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.deleteComment = function(id) {
        var dataToSend = { token: Cookies.get('tq'), cmid: id };
        var urlToPost = 'backend/deleteComment';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.lastId = 0;
                    $scope.posts = [];
                    $scope.getLastPost();
                    $.gritter.add({
                        title: 'Usuwanie komentarza',
                        text: 'Komentarz został usunięty pomyślnie',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety coś poszło źle',
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
                    text: 'Niestety coś poszło źle',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'

                });
            },
        });
    }


});