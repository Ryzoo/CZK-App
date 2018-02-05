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

    this.getNew = function(firstIs = false) {
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
                                $rootScope.lastNotId = reqData.data[0].id;
                                $rootScope.newNotify = reqData.data;
                                let count = 0;
                                let toShow = null;
                                for (var i = 0; i < $rootScope.newNotify.length; i++) {
                                    if (reqData.data[i].is_new === "1") {
                                        count++;
                                        toShow = reqData.data[i];
                                    }
                                }
                                if(toShow){
                                    if(!firstIs){
                                        local('Otrzymano powiadomienie', toShow.title);
                                        if (Notification) {
                                            if (Notification.permission === "granted") {
                                                var notification = new Notification(toShow.title);
                                            }
                                            else {
                                                Notification.requestPermission(function (permission) {
                                                    if (permission === "granted") {
                                                        var notification = new Notification(toShow.title);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                                $rootScope.notifyCount = count;
                            }else {
                                $rootScope.notifyCount = 0;
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