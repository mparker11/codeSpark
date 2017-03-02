'use strict';

angular.module('codeSpark.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeController'
    });
}])

.controller('HomeController', [function() {

}]);