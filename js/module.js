/*defining the urls*/
var server = "http://192.168.1.3/www/mobile";
var loginUrl = server + "mobileapp/user/login.json";
var tokenUrl = server + "services/session/token";

/*defining the module*/
var mi = angular.module('mi', ['ngCookies']);

/*defining the routes*/
mi.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when("/login", {templateUrl: "pages/login.html", controller: mi.loginCtrl});
  $routeProvider.when("/home", {templateUrl: "pages/home.html", controller: mi.homeCtrl});
  $routeProvider.otherwise({redirectTo: "/login"});
}]);

mi.config(['$httpProvider', function($httpProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"]
}]);

/*user object*/
mi.factory('sharedUser', ['$http', '$cookieStore', '$rootScope', function($http, $cookieStore, $rootScope) {


  return user;
}]);

mi.controller('loginCtrl', function($scope, sharedUser, $location, $rootScope) {

});

mi.controller('homeCtrl', function($scope, sharedUser, $cookieStore, $location, $http) {
  var auth = $cookieStore.get('auth');
  if (auth != 1) {
    // $location.path('/')
  }

  
});