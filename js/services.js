app.service('request', function($http, $rootScope) {
    this.sync = function(sendType, urlToPost, dataToSend) {
        return $.ajax({
            async: false,
            type: sendType,
            url: urlToPost,
            data: dataToSend
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
                console.log(reqData);
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
    this.logout = function(token) {
        // wyloguje kolesia, zmieni jego token w bazie
    }
    this.checkPermission = function(permission) {
        // true lub false jesli dana osoba moze wejsc na ta strone lub nie 
    }

});