app.service('request', function($http, $rootScope) {
    this.sync = function(sendType, urlToPost, dataToSend, successFunction, errorFunction) {
        return $.ajax({
            async: false,
            type: sendType,
            url: urlToPost,
            data: dataToSend,
            success: successFunction,
            error: errorFunction,
        });
    }
});

app.service('auth', function($http, $rootScope, request) {

    this.logIn = function(login, password) {
        var dataToSend = { email: login, pass: password };
        var urlToPost = "backend/login";
        var toReturn;
        request.sync('POST', urlToPost, dataToSend)
            .done(function(reqData) {
                if (reqData.success) {

                    Cookies.remove('tq');
                    Cookies.set('tq', reqData.token, { expires: 1 });
                }
                toReturn = reqData;
            })
            .fail(function(jqXHR, textStatus) {
                console.log("Bład podczas komunikacji z serverem: " + textStatus);
                toReturn = false;
            });
        return toReturn;
    }

    this.checkIsLogged = function() {
        var token = Cookies.get('tq');
        if (token != null && token.length > 5) return true;
        else return false;
    }

    this.getUserData = function() {
        var tq = Cookies.get('tq');
        var toReturn = false;
        if (tq != null && tq.length > 5) {
            var dataToSend = { token: tq };
            var urlToPost = "backend/userData";
            request.sync('POST', urlToPost, dataToSend,
                function(reqData) {
                    toReturn = reqData;
                },
                function(jqXHR, textStatus) {
                    console.log("Bład podczas komunikacji z serverem: " + textStatus);
                    toReturn = false;
                });
        }
        return toReturn;
    }

    this.logout = function() {
        Cookies.remove('tq');
        document.location = "login";
    }

    this.checkPerm = function(permission) {
        if ($rootScope.user != null && $rootScope.user.role != null) {
            for (var i = 0; i < permission.length; i++) {
                if (permission[i] === $rootScope.user.role) return true;
            }
        } else return false;
    }

});