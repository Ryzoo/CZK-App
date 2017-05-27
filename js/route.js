var app = angular.module("CZKApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/template/main.html",
        })
        .when("/templatkazprzyciskiem", {
            templateUrl: "template/templatkazprzyciskiem.html",
        });
});