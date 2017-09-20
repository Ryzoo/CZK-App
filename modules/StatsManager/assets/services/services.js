app.service('statistic', function($http, $rootScope, request) {

    this.getStats = function(userId, functionSuccess, async = true) {
        var urlToPost = "backend/getStats";
        var dataToSend = {
            token: $rootScope.user.token,
            usid: userId
        };
        var toReturn = [];
        request.sync('POST', urlToPost, dataToSend,
            function(reqData) {
                if (reqData.success) {
                    $rootScope.$apply(function() {
                        $rootScope.actualStats = reqData.data;
                        console.log($rootScope.actualStats);
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

    this.getActualUserForm = function(userId) {
        var returnedData = this.getStats(userId, function() {}, false);
        return (returnedData[returnedData.length - 1].summaryScore / returnedData[returnedData.length - 1].maxSummaryScore) * 100;
    }

    this.getTeamForm = function(usersId = [], isMatchTeamForm = false) {
        var maxScore = 0;
        var teamScore = 0;
        for (var index = 0; index < usersId.length; index++) {
            var returnedData = this.getStats(usersId[index], function() {}, false);
            if (returnedData) {
                teamScore += returnedData[returnedData.length - 1].summaryScore;
                if (isMatchTeamForm)
                    maxScore = returnedData[returnedData.length - 1].maxSummaryScore;
                else
                    maxScore += returnedData[returnedData.length - 1].maxSummaryScore;
            }
        }
        if (isMatchTeamForm)
            maxScore *= 11;
        return teamScore > 0 ? ((teamScore / maxScore) * 100) : 0;
    }

    this.getTeamStats = function(usersId = [], functionAfter) {
        var usIds = [];
        for (var index = 0; index < usersId.length; index++) {
            usIds.push(usersId[index].usid);
        }
        var toReturn = [];
        var tests = [];
        for (var i = 0; i < usIds.length; i++) {
            var returned = this.getStats(usIds[i], function() {}, false);
            if (returned) {
                for (var x = 0; x < returned.length - 1; x++) {
                    if (!tests[x]) tests.push({ name: returned[x].name, users: [] });
                    tests[x].users.push({ name: usersId[i].userName, score: (returned[x].tests[returned[x].tests.length - 1].actual / returned[x].tests[returned[x].tests.length - 1].max) * 100 });
                }
            }
        }
        $rootScope.actualStats = tests;
        functionAfter();
        return tests;
    }

});