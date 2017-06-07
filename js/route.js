var app = angular.module("CZKApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/templates/mainDashboard.html"
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
        .otherwise({
            templateUrl: "templates/badPerm.html"
        });
});