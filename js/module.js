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

  user.login = function(username, password) {
    var token = this.getToken();
    return $http({
      headers: {'X-CSRF-Token' : token, 'Content-Type': 'application/json'},
      url: loginUrl,
      method: "POST",
      data: {username: username, password: password}
    }).success(function(data) {
        var cookieData = {
          sessionId: data.sessid,
          session_name: data.session_name,
          token: this.token
        };
        $cookieStore.put('auth',JSON.stringify(cookieData));
      });
  };

  user.getToken = function() {
    return this.token === "" ? this.setToken() : this.token;
  }

  user.setToken = function() {
    this.token = $http({
      headers: {'Content-Type': 'application/json'},
      url: tokenUrl,
      method: "POST",
      data: ""
    }).success(function(data) {
        this.token = data;
        console.log(this.token);
        $rootScope.$broadcast('handleToken',this.token);
      });
  }

  return user;
}]);

mi.controller('loginCtrl', function($scope, sharedUser, $location, $rootScope) {
  $scope.token = "";
  $scope.doLogin = function(formData) {
    var username = formData.username;
    var password = formData.pass;

    sharedUser.login(username, password).then(function(data) {
      $scope.user = data;
      $rootScope.$broadcast('handleUserBroadcast',$scope.user);
    })
  };

  $scope.$on('handleToken', function(event, projects) {
    $scope.token = projects;
    $location.path('/home');
  });
});

mi.controller('homeCtrl', function($scope, sharedUser) {

  $scope.$on('handleUserBroadcast', function(event, user) {
    $scope.user = user;
  });
});