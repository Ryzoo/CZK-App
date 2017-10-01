app.controller('tabController', function($scope, auth, $rootScope, notify, request) {
    $scope.lastId = 0;
    $scope.posts = [];
    $scope.maxPost = 5;
    $scope.showContent = false;
    $scope.canGetMorePost = false;

    $scope.morePost = function() {
        $scope.maxPost += 5;
        if ($scope.posts.length > $scope.maxPost) {
            $scope.canGetMorePost = true;
        } else {
            $scope.canGetMorePost = false;
        }
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
        request.backend('getPost', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.showContent = true;
                $scope.posts = [];
            });
            if (data.length > 5) $scope.canGetMorePost = true;
            for (var i = 0; i < data.length; i++) {
                $scope.$apply(function() {
                    $scope.posts.push(data[i]);
                    $scope.posts[i].maxComment = 2;
                });
            }
            if (data[0] != null && data[0].psid != null) $scope.lastId = data[0].psid;
        });
    }

    $scope.addPost = function() {
        $('#errorNewPost').html("").hide();
        var message = $("#newPostInput").val();
        if (message.length < 5 || message.length > 500) {
            notify.localNotify('Walidacja', 'Wiadomosc musi być dłuższa niż 5 znaków oraz krótsza niż 500');
            return;
        }

        request.backend('addPost', { msg: message, tmid: $rootScope.user.tmid }, function(data) {
            $scope.getLastPost();
            notify.addNew(new notify.Notification($rootScope.user.firstname + " " + $rootScope.user.lastname + " dodał post", null, "#!/tab", true));
        }, 'Twój post został pomyślnie dodany');
    }

    $scope.addComment = function(psid) {
        var message = $("#tx_" + psid).val();
        if (message.length < 5 || message.length > 500) {
            notify.localNotify('Walidacja', 'Komentarz musi zawierać od 5 do 500 znaków');
            return;
        }

        request.backend('addComment', { msg: message, post_id: psid }, function(data) {
            $scope.getLastPost();
        }, 'Twój komentarz został pomyślnie dodany');
    }

    $(document).off('keydown', '.commentPostInput');
    $(document).on('keydown', '.commentPostInput', function(e) {
        if (e.which == 13) {
            var postId = $(this).attr('id').split("_")[1];
            $scope.addComment(postId);
        }
    });


    $scope.deletePost = function(id) {
        request.backend('deletePost', { psid: id }, function(data) {
            $scope.getLastPost();
        }, 'Post został usunięty pomyślnie');
    }

    $scope.deleteComment = function(id) {
        request.backend('deleteComment', { cmid: id }, function(data) {
            $scope.getLastPost();
        }, 'Komentarz został usunięty pomyślnie');
    }

});