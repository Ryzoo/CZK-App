app.service('auth', function($http, $rootScope, request) {

    this.logIn = function(login, password) {
        var dataToSend = { email: login, pass: password };
        var urlToPost = "backend/login";
        var toReturn;
        request.sync('POST', urlToPost, dataToSend, function(reqData) {
            console.log(reqData);
            if (reqData.success) {
                Cookies.remove('tq');
                Cookies.set('tq', reqData.token, { expires: 1 });
            }
            toReturn = reqData;
        }, function(jqXHR, textStatus) {
            console.log("Bład podczas komunikacji z serverem: " + textStatus);
            toReturn = false;
        });

        return toReturn;
    }

    this.logout = function() {
        Cookies.remove('tq');
        document.location = "login";
    }

    this.checkIsLogged = function() {
        var token = Cookies.get('tq');
        if (token != null && token.length > 5) {
            var dataToSend = { token: token };
            var urlToPost = "backend/checkIsLoged";
            request.sync('POST', urlToPost, dataToSend,
                function(reqData) {
                    if (reqData.success) toReturn = true;
                    else toReturn = false;
                },
                function(jqXHR, textStatus) {
                    console.log("Bład podczas komunikacji z serverem: " + textStatus);
                    toReturn = false;
                });
        } else toReturn = false;

        return toReturn;
    }

    this.getUserData = function() {
        var tq = Cookies.get('tq');
        var toReturn = false;
        if (tq != null && tq.length > 5) {
            var dataToSend = { token: tq };
            var urlToPost = "backend/getUserData";
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

    this.checkPerm = function(permission) {
        if ($rootScope.user != null && $rootScope.user.role != null) {
            for (var i = 0; i < permission.length; i++) {
                if (permission[i] === $rootScope.user.role) return true;
            }
        } else return false;
    }

});