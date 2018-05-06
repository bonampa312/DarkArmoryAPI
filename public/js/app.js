angular.module("DarkArmoryAPI", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "home.html",
                controller: "HomeController"
            })
            .when("/ds2/weapons", {
                redirectTo: "/ds2/weapons"
            })
            /*
            .otherwise({
                redirectTo: "/"
            }) */
    })
    .controller("HomeController", function($scope) {
        $scope.goToDS1Weapons = function () {
            $location.path("/ds1/weapons")
        }
    });