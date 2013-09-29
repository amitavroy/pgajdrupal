/*defining the urls*/
var server = "http://localhost/personal/drupal_money/";
var loginUrl = server + "rest/user/authenticate";
var tokenUrl = server + "rest/token/get";
var latestNodesUrl = server + "rest/node/latest";

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
  var user = {};

  user.login = function(username, password) {
    return $http({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      url: loginUrl,
      data: $.param({
        username: username, 
        password: password
      })
    }).success(function(userData) {
        var auth = {
          token: userData.token,
          uid: userData.uid,
          name: userData.name
        };
        $cookieStore.put('auth', auth);
        console.log(auth);
      });
  };

  user.getToken = function(uid) {
    return $http({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      url: tokenUrl,
      data: $.param({
        uid: uid
      })
    }).success(function(tokenData) {
        // updating the token with broadcast
        $rootScope.$broadcast('handleTokenBroadcast', tokenData);

        // updating the cookie token
        var cookieData = $cookieStore.get('auth');
        cookieData.token = tokenData;
        $cookieStore.put('auth', cookieData);
      });
  };

  return user;
}]);

mi.factory('NodeFactory', ['$http', function($http) {
  var Node = {};

  Node.getNodeMultiple = function() {

  };

  Node.getNode = function() {

  };

  Node.getLatest = function(token, uid) {
    return $http({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRF-Token': token
      },
      method: "POST",
      url: latestNodesUrl,
      data: $.param({
        uid: uid
      })
    }).success(function(data) {
        console.log(data);
      });
  };

  return Node;
}]);