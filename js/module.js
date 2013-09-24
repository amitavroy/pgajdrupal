/*defining the urls*/
var server = "http://money.amitavroy.com/?q=";
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

/*user object*/
mi.factory('sharedUser', ['$http', '$cookieStore', '$rootScope', function($http, $cookieStore, $rootScope) {
  var user = {};
  user.token = "";
  user.userObject = {};

  /*doing the user login*/
  user.login = function(username, password) {
    return $http({
      headers: {'Content-Type': 'application/json'},
      url: loginUrl,
      method: "POST",
      data: {username: username, password: password}
    }).success(function(data) {
        console.log(data.session_name);
        console.log(data.sessid);
        $cookieStore.put('auth', 1);
        $cookieStore.put(data.session_name, data.sessid);
      });
  };

  return user;
}]);

mi.controller('loginCtrl', function($scope, sharedUser, $location, $rootScope) {
  $scope.user = "";
  $scope.doLogin = function(form) {
    var username = form.username;
    var password = form.pass;

    sharedUser.login(username, password).then(function(data) {
      $location.path('/home');
    });
  };

});

mi.controller('homeCtrl', function($scope, sharedUser, $cookieStore, $location, $http) {
  var auth = $cookieStore.get('auth');
  if (auth != 1) {
    $location.path('/')
  }

  $scope.getNode = function() {
    $http({
      headers: {'Content-Type': 'application/json'},
      url: tokenUrl,
      method: "POST",
      data: ""
    }).success(function(data) {
        console.log(data);
        $http({
          headers: {'Content-Type': 'application/json', "session": "SESS3b000297a4f2b7dcb8c2da1e33f6982f=PvcGEwx-WKMpk2cKoKd-m2c2N9VcgP7NYFcYCNAhsl0", "token": data},
          url: "http://money.amitavroy.com/?q=mobileapp/node/1",
          method: "POST",
          data: ""
        }).success(function(nodeData) {
            console(nodeData);
          });
      });
  };
});