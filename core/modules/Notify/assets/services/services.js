app.service('notify', function($http, $rootScope, request) {
    this.Notification = function(_title, _to, _url = '', _toAll = false) {
        this.title = _title;
        this.to = _to;
        this.toAll = _toAll;
        this.url = _url
    }

    this.localNotify = locaNotifyFun;

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
        request.sync('POST', urlToPost, dataToSend, function(e) {}, function(jqXHR, textStatus) {
            console.log("Bład podczas komunikacji z serverem: " + textStatus);
        }, true);

    }

    this.getNew = function() {
        var urlToPost = "backend/getNewNotify";
        var dataToSend = {
            token: $rootScope.user.token,
            usid: $rootScope.user.id,
            tmid: $rootScope.user.tmid,
        };
        local = this.localNotify;
        request.sync('POST', urlToPost, dataToSend,
            function(reqData) {
                if (reqData.success) {
                    $rootScope.$apply(function() {
                        if (reqData.data) {
                            if (reqData.data[0]) {

                                if (reqData.data[0].id === $rootScope.lastNotId) return;

                                $rootScope.newNotify = reqData.data;
                                $rootScope.notifyCount = reqData.data.length;

                                var count = 0;
                                for (var i = 0; i < $rootScope.notifyCount; i++) {
                                    if (reqData.data[i].is_new === "1") {
                                        count++;
                                    }
                                }
                                $rootScope.notifyCount = count;
                            }

                        } else {
                            $rootScope.notifyCount = 0;
                        }
                        var powAdded = false;
                        for (var i = 0; i < $rootScope.notifyCount; i++) {
                            if (reqData.data[i].id > $rootScope.lastNotId) {
                                local('Otrzymano powiadomienie', reqData.data[i].title);
                                $rootScope.lastNotId = reqData.data[i].id;
                                if (window.Notification && Notification.permission !== "denied" && i - 1 == $rootScope.notifyCount) {
                                    powAdded = true;
                                    Notification.requestPermission(function(status) {
                                        if (status === "granted") {
                                            var notification = new Notification(reqData.data[i].title);
                                        }
                                    });
                                }
                            }
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