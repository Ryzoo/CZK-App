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

    this.getStats = function(userId, functionSuccess, async = true) {
        var urlToPost = "backend/getStats";
        var dataToSend = {
            token: $rootScope.user.token,
            usid: userId,
            tmid: $rootScope.user.tmid
        };
        var toReturn = [];
        request.sync('POST', urlToPost, dataToSend,
            function(reqData) {
                if (reqData.success) {
                    $rootScope.$apply(function() {
                        toReturn = $rootScope.actualStats = reqData.data;
                        zestawienie = [];
                        zestawienie.name = 'Zestawienie';
                        zestawienie.testScore = [];

                        for (var i = 0; i < reqData.data.length; i++) {
                            if (!reqData.data[i].tests) reqData.data[i].tests = [];
                            podsumowanie = [];
                            podsumowanie.name = 'Podsumowanie';
                            podsumowanie.scores = [];

                            for (var j = 0; j < reqData.data[i].tests.length; j++) {
                                if (reqData.data[i].tests[j].scores) {
                                    var worst = parseFloat(reqData.data[i].tests[j].worst);
                                    var best = parseFloat(reqData.data[i].tests[j].best);
                                    var distance = Math.abs(best - worst);
                                    if (best > worst) {
                                        if (reqData.data[i].tests[j].scores.length >= 2) {
                                            var lastScore = ((parseFloat(reqData.data[i].tests[j].scores[reqData.data[i].tests[j].scores.length - 2].wynik) - worst) +
                                                (parseFloat(reqData.data[i].tests[j].scores[reqData.data[i].tests[j].scores.length - 1].wynik) - worst)) / 2.0;
                                        } else {
                                            var lastScore = parseFloat(reqData.data[i].tests[j].scores[reqData.data[i].tests[j].scores.length - 1].wynik) - worst;
                                        }
                                        if (lastScore > 0) {
                                            var percentScore = parseFloat(((lastScore / distance) * 100) > 100 ? 100 : ((lastScore / distance) * 100));
                                        } else {
                                            var percentScore = 0;
                                        }
                                        percentScore = percentScore < 0 ? 0 : percentScore;
                                        reqData.data[i].tests[j].percentLastScore = percentScore;
                                        score = [];
                                        score.wynik = reqData.data[i].tests[j].percentLastScore;
                                        podsumowanie.scores.push(score);
                                    } else {
                                        if (reqData.data[i].tests[j].scores.length >= 2) {
                                            var lastScore = ((parseFloat(reqData.data[i].tests[j].scores[reqData.data[i].tests[j].scores.length - 2].wynik) - best) +
                                                (parseFloat(reqData.data[i].tests[j].scores[reqData.data[i].tests[j].scores.length - 1].wynik) - best)) / 2.0;
                                        } else {
                                            var lastScore = parseFloat(reqData.data[i].tests[j].scores[reqData.data[i].tests[j].scores.length - 1].wynik) - best;

                                        }
                                        if (lastScore > 0) {
                                            var percentScore = parseFloat(((lastScore / distance) * 100) > 100 ? 100 : ((lastScore / distance) * 100));
                                        } else {
                                            var percentScore = 0;
                                        }
                                        percentScore = percentScore < 0 ? 0 : percentScore;
                                        reqData.data[i].tests[j].percentLastScore = 100.0 - percentScore;
                                        score = [];
                                        score.wynik = reqData.data[i].tests[j].percentLastScore;
                                        podsumowanie.scores.push(score);
                                    }
                                } else {
                                    reqData.data[i].tests[j].percentLastScore = 0;
                                    score = [];
                                    score.wynik = 0;
                                    podsumowanie.scores.push(score);
                                }
                            }

                            wynikKategorii = [];
                            wynikKategorii.name = reqData.data[i].name;
                            wynikKategorii.score = 0;
                            wynikKategorii.maxScore = podsumowanie.scores.length * 100;
                            for (var x = 0; x < podsumowanie.scores.length; x++) {
                                wynikKategorii.score += podsumowanie.scores[x].wynik;
                            }
                            zestawienie.testScore.push(wynikKategorii);

                            podsumowanie.actual = wynikKategorii.score;
                            podsumowanie.max = podsumowanie.scores.length * 100;
                            podsumowanie.scores = [];

                            reqData.data[i].tests.push(podsumowanie);
                        }
                        zestawienie.summaryScore = 0;
                        zestawienie.maxSummaryScore = 0;
                        for (var x = 0; x < zestawienie.testScore.length; x++) {
                            zestawienie.summaryScore += zestawienie.testScore[x].score;
                            zestawienie.maxSummaryScore += zestawienie.testScore[x].maxScore;
                        }
                        zestawienie.tests = [];
                        testIn = [];
                        testIn.name = 'Zestawienie';

                        zestawienie.tests.push(testIn);
                        reqData.data.push(zestawienie);
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

    this.getActualUserForm = function(userId) {
        var returnedData = this.getStats(userId, function() {}, false);
        return (returnedData[returnedData.length - 1].summaryScore / returnedData[returnedData.length - 1].maxSummaryScore) * 100;
    }

    this.getTeamForm = function(usersId = [], isMatchTeamForm = false) {
        var maxScore = 0;
        var teamScore = 0;
        for (var index = 0; index < usersId.length; index++) {
            var returnedData = this.getStats(usersId[index], function() {}, false);
            teamScore += returnedData[returnedData.length - 1].summaryScore;
            if (isMatchTeamForm)
                maxScore = returnedData[returnedData.length - 1].maxSummaryScore;
            else
                maxScore += returnedData[returnedData.length - 1].maxSummaryScore;

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
            for (var x = 0; x < returned.length - 1; x++) {
                if (!tests[x]) tests.push({ name: returned[x].name, users: [] });
                tests[x].users.push({ name: usersId[i].userName, score: returned[x].tests[returned[x].tests.length - 1].actual });
            }
        }
        functionAfter();
        $rootScope.actualStats = tests;
        return tests;
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