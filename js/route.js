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
        }).otherwise({
            templateUrl: "templates/badPerm.html"
        });
});