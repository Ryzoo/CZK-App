var app = angular.module("CZKApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/templates/mainDashboard.html",
            controller: "mainDashboardController"
        })
        .when("/templatkazprzyciskiem", {
            templateUrl: "templates/templatkazprzyciskiem.html"
        })
        .when("/badPerm", {
            templateUrl: "templates/badPerm.html"
        })
        .when("/myProfile", {
            templateUrl: "templates/myProfile.html",
            controller: "accountController"
        })
        .when("/tab", {
            templateUrl: "templates/tab.html",
            controller: "tabController"
        })
        .when("/teamComposition", {
            templateUrl: "templates/actualTeamComposition.html",
            controller: "compositionController"
        })
        .when("/staff", {
            templateUrl: "templates/staff.html",
            controller: "staffController"
        })
        .when("/calendar", {
            templateUrl: "templates/calendar.html",
            controller: "calendarController"
        })
        .when("/showPlayers", {
            templateUrl: "templates/showPlayers.html",
            controller: "showPlayersController"
        })
        .when("/myStats", {
            templateUrl: "templates/myStats.html",
            controller: "myStatsController"
        })
        .when("/testMenager", {
            templateUrl: "templates/testMenager.html",
            controller: "testMenagerController"
        })
        .when("/newScore", {
            templateUrl: "templates/newScore.html",
            controller: "newScoreController"
        })
        .when("/myRaports", {
            templateUrl: "templates/myRaports.html",
            controller: "myRaportsController"
        })
        .when("/usersStatistic", {
            templateUrl: "templates/usersStatistic.html",
            controller: "usersStatisticController"
        })
        .when("/teamStatistic", {
            templateUrl: "templates/teamStatistic.html",
            controller: "teamStatisticController"
        })
        .otherwise({
            templateUrl: "templates/badPerm.html"
        });


});