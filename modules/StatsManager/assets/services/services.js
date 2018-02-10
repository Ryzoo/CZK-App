app.service('statistic', function($http, $rootScope, request) {

    this.getStats = function(userId, functionSuccess, async = true, last = false) {
        var urlToPost = "backend/getStats";
        var dataToSend = {
            token: $rootScope.user.token,
            usid: userId,
            tmid: $rootScope.user.tmid,
            last: last
        };
        var toReturn = [];
        request.sync('POST', urlToPost, dataToSend,
            function(reqData) {
                if (reqData.success) {
                    $rootScope.$apply(function() {
                        $rootScope.actualStats = reqData.data;
                        toReturn = reqData.data;
                        functionSuccess();
                    });
                } else {
                    console.log('blad');
                }
            },
            function(jqXHR, textStatus) {
                console.log("Bład podczas komunikacji z serverem: " + textStatus);
            }, async);
        return toReturn;
    }

    this.getTeamForm = function(usersId = [], isMatchTeamForm = false) {
        var maxScore = 0;
        var teamScore = 0;
        if (!usersId || usersId.length == 0) {
            return 0;
        }
        var returnedData = this.getStats(usersId, function() {}, false, true);
        return parseFloat(100 * (isMatchTeamForm ? (returnedData.teamForm / (returnedData.maxPlayer*100)) : (returnedData.teamForm / (usersId.length * 100)))).toFixed(2);
    }

    this.getTeamStats = function(usersId = [], functionAfter) {
        $rootScope.actualStats = this.getStats(usersId, function() {}, false);
        $rootScope.actualStats = $rootScope.actualStats.users;
        functionAfter();
    }

});