var app = angular.module("CZKApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/opcja1", {
            templateUrl: "template/templatka1.html",
            controller: "kontrolerTemplatki1"
        })
        .when("/opcja2", {
            templateUrl: "template/templatka2.html",
            controller: "kontrolerTemplatki2"
        })
        .when("/opcja3", {
            templateUrl: "template/templatka3.html",
            controller: "kontrolerTemplatki3"
        })
});