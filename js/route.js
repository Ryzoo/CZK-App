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
        .otherwise({
            templateUrl: "templates/badPerm.html"
        });
});