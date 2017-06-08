app.controller('tabController', function($scope, auth, $rootScope) {
    $scope.lastId = 0;
    $scope.posts = [];

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
                    $scope.posts = msg.data;
                    if (msg.data[0] != null && msg.data[0].psid) $scope.lastId = msg.data[0].psid;
                } else console.log(msg);
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
            },
        });
    }

    $scope.getComments = function() {

    }

    $scope.addPost = function() {
        //newPostInput
    }

    $scope.addComment = function($psid) {
        console.log($psid);
    }

});