/*defining the urls*/
var server = "http://staging.focalworks.in/fl360/";
var loginUrl = server + "rest/user/authenticate";
var tokenUrl = server + "rest/token/get";
var latestNodesUrl = server + "rest/node/latest";
var singleNodeUrl = server + "rest/getnode/";

/*defining the module*/
var mi = angular.module('mi', ['LocalStorageModule']);

/*defining the routes*/
mi.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when("/login", {templateUrl: "pages/login.html", controller: mi.loginCtrl});
  $routeProvider.when("/home", {templateUrl: "pages/home.html", controller: mi.homeCtrl});
  $routeProvider.when("/node/:nid", {templateUrl: "pages/fullnode.html", controller: mi.fullNodeCtrl});
  $routeProvider.otherwise({redirectTo: "/login"});
}]);

/*Removing the X-Requested header, need to check the actual required.*/
mi.config(['$httpProvider', function($httpProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"]
}]);

/*user object*/
mi.factory('sharedUser', ['$http', 'localStorageService', '$rootScope', '$location', function($http, localStorageService, $rootScope, $location) {
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
        localStorageService.add('auth', auth);
      }).error(function(data, status, headers, config) {
        alert('The username and/or password is wrong.');
      });
  };

  user.getToken = function(uid) {
    /* if no user id is present or user id is null, then authentication is not correct. */
    if (!uid) {
      $location.path('#/login');
      alert('No user id');
    }
    
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
        var cookieData = localStorageService.get('auth');
        cookieData.token = tokenData;
        localStorageService.get('auth', cookieData);
      });
  };

  return user;
}]);

/*This is the node factory which will handle all node related actions.*/
mi.factory('NodeFactory', ['$http', function($http) {
  var Node = {};

  Node.getNodeMultiple = function() {

  };

  Node.getNode = function(token, nid) {
    return $http({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRF-Token': token
      },
      method: "POST",
      url: singleNodeUrl + nid,
      data: ""
    });
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
      });
  };

  return Node;
}]);