app.controller('tabController', function($scope, auth, $rootScope) {
    $scope.lastId = 0;
    $scope.posts = [];
    $scope.field = {};

    $scope.getLastPost = function() {
        var dataToSend = { token: Cookies.get('tq'), last: $scope.lastId };
        var urlToPost = 'backend/getPost';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: false,
            success: function(msg) {
                if (msg.success) {
                    for (var i = 0; i < msg.data.length; i++) {
                        $scope.posts.push(msg.data[i]);
                    }
                    if (msg.data[0] != null && msg.data[0].psid != null) $scope.lastId = msg.data[0].psid;
                } else console.log(msg);
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
            },
        });
    }


    $scope.addPost = function() {
        $('#errorNewPost').html("").hide();
        var message = $("#newPostInput").val();
        if (message.length < 5 || message.length > 500) {
            $('#errorNewPost').html("Wiadomosc musi być dłuższa niż 5 znaków oraz krótsza niż 500").show();
            return;
        }
        var dataToSend = { token: Cookies.get('tq'), msg: message };
        var urlToPost = 'backend/addPost';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: false,
            success: function(msg) {
                if (msg.success) $scope.getLastPost();
                else console.log(msg.error);
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
            },
        });
    }

    $scope.addComment = function($psid) {
        console.log($scope.actual.msg);
        return;
        $('#errorNewPost').html("").hide();
        var message = $("#newPostInput").val();
        if (message.length < 5 || message.length > 500) {
            return;
        }
        var dataToSend = { token: Cookies.get('tq'), msg: message };
        var urlToPost = 'backend/addPost';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: false,
            success: function(msg) {
                if (msg.success) $scope.getLastPost();
                else console.log(msg.error);
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
            },
        });
    }

});