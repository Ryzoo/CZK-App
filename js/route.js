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
        .otherwise({
            templateUrl: "templates/badPerm.html"
        });
});