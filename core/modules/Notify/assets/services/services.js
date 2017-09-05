
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
            tmid: $rootScope.user.tmid
        };
        local = this.localNotify ;
        request.sync('POST', urlToPost, dataToSend,
            function(reqData) {
                if (reqData.success) {
                    $rootScope.$apply(function() {
                        if (reqData.data) {
                            $rootScope.newNotify = reqData.data;
                            $rootScope.notifyCount = reqData.data.length;
                            
                        } else {
                            $rootScope.notifyCount = 0;
                        }
                        for(var i=0;i<$rootScope.notifyCount;i++){
                            if( reqData.data[i].id > $rootScope.lastNotifyId){
                                local('Otrzymano powiadomienie',reqData.data[i].title);
                                $rootScope.lastNotifyId = reqData.data[i].id;
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