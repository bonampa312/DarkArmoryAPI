angular.module("DarkArmoryAPI", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "home.html",
                controller: "HomeController"
            })
    })
    .controller("HomeController", function($scope) {
    });