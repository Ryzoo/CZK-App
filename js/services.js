app.service('request', function($http, $rootScope) {
    this.sync = function(sendType, urlToPost, dataToSend, fsuccess, ffailed, asyncIs = false) {
        return $.ajax({
            async: asyncIs,
            type: sendType,
            url: urlToPost,
            data: dataToSend,
            success: fsuccess,
            error: ffailed,
        });
    }
});


app.service('statistic', function($http, $rootScope, request) {

    this.getStats = function(userId, functionSuccess) {
        var urlToPost = "backend/getStats";
        var dataToSend = {
            token: $rootScope.user.token,
            usid: userId,
            tmid: $rootScope.user.tmid
        };
        request.sync('POST', urlToPost, dataToSend,
            function(reqData) {
                console.log(reqData);
                if (reqData.success) {
                    $rootScope.$apply(function() {
                        $rootScope.actualStats = reqData.data;
                        functionSuccess();
                    });
                } else {
                    console.log('blad');
                }
            },
            function(jqXHR, textStatus) {
                console.log("Bład podczas komunikacji z serverem: " + textStatus);
            }, true);
    }

});

app.service('notify', function($http, $rootScope, request) {
    this.Notification = function(_title, _to, _url = '', _toAll = false) {
        this.title = _title;
        this.to = _to;
        this.toAll = _toAll;
        this.url = _url
    }

    this.addNew = function(notifyObj) {
        var urlToPost = "backend/addNotify";
        var dataToSend = {
            token: $rootScope.user.token,
            usid: $rootScope.user.id,
            tmid: $rootScope.user.tmid,
            title: notifyObj.title,
            to: notifyObj.to,
            toAll: notifyObj.toAll,
            url: notifyObj.url
        };
        request.sync('POST', urlToPost, dataToSend, function(e) {
            console.log(e);
        }, function(jqXHR, textStatus) {
            console.log("Bład podczas komunikacji z serverem: " + textStatus);
        }, true);

    }

    this.getNew = function() {
        var urlToPost = "backend/getNewNotify";
        var dataToSend = {
            token: $rootScope.user.token,
            usid: $rootScope.user.id,
            tmid: $rootScope.user.tmid
        };
        request.sync('POST', urlToPost, dataToSend,
            function(reqData) {
                if (reqData.success) {
                    $rootScope.$apply(function() {
                        if (reqData.data) {
                            $rootScope.newNotify = reqData.data;
                            $rootScope.notifyCount = reqData.data.length;
                            console.log($rootScope.newNotify);
                        } else {
                            $rootScope.notifyCount = 0;
                        }
                    });
                }
            },
            function(jqXHR, textStatus) {
                console.log("Bład podczas komunikacji z serverem: " + textStatus);
            }, true);
    }

    this.getAll = function() {
        var urlToPost = "backend/getAllNotify";
        var dataToSend = {
            token: $rootScope.user.token,
            usid: $rootScope.user.id,
            tmid: $rootScope.user.tmid
        };
        request.sync('POST', urlToPost, dataToSend, function(reqData) {
            if (reqData.success) {
                $rootScope.$apply(function() {
                    $rootScope.allNotify = reqData.data;
                });
            }
        }, function(jqXHR, textStatus) {
            console.log("Bład podczas komunikacji z serverem: " + textStatus);
        }, true);
    }

    this.setNewOff = function() {
        if ($rootScope.notifyCount <= 0) return;
        var urlToPost = "backend/setNewNotifyOff";
        var notIds = [];
        for (var i = 0; i < $rootScope.newNotify.length; i++) {
            notIds.push($rootScope.newNotify[i].id);
        }

        var dataToSend = {
            token: $rootScope.user.token,
            usid: $rootScope.user.id,
            tmid: $rootScope.user.tmid,
            ntid: notIds
        };
        request.sync('POST', urlToPost, dataToSend, function(msg) {
            $rootScope.$apply(function() {
                $rootScope.notifyCount = 0;
            });
        }, function(jqXHR, textStatus) {
            console.log("Bład podczas komunikacji z serverem: " + textStatus);
        }, true);
    }

});

app.service('auth', function($http, $rootScope, request) {

    this.logIn = function(login, password) {
        var dataToSend = { email: login, pass: password };
        var urlToPost = "backend/login";
        var toReturn;
        request.sync('POST', urlToPost, dataToSend, function(reqData) {
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

    this.checkPerm = function(permission) {
        if ($rootScope.user != null && $rootScope.user.role != null) {
            for (var i = 0; i < permission.length; i++) {
                if (permission[i] === $rootScope.user.role) return true;
            }
        } else return false;
    }

});