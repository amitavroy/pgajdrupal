/*defining the urls*/

//var server = "http://staging.focalworks.in/fl360/";
// var server = "http://192.168.3.47/RND/fl360/";
var server = "http://localhost/office/fl360/";

var loginUrl = server + "rest/user/authenticate";
var tokenUrl = server + "rest/token/get";
var latestNodesUrl = server + "rest/node/latest";
var singleNodeUrl = server + "rest/getnode/";
var vocabLoadUrl = server + "rest/getterms/";
var nodeSave = server + "rest/savenode/";
var commentSave = server + "rest/savecomment/";

/*defining the module*/
var mi = angular.module('mi', ['LocalStorageModule', 'ui.tinymce']);

/*defining the routes*/
mi.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when("/login", {templateUrl: "pages/login.html", controller: mi.loginCtrl});
  $routeProvider.when("/home", {templateUrl: "pages/home.html", controller: mi.homeCtrl});
  $routeProvider.when("/node/:nid", {templateUrl: "pages/fullnode.html", controller: mi.fullNodeCtrl});
  $routeProvider.when("/create", {templateUrl: "pages/create.html", controller: mi.createCtrl});
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
        /* adding the fetched data into local storage for future use*/
        var auth = {
          token: userData.token,
          uid: userData.uid,
          name: userData.name
        };
        localStorageService.add('auth', auth);
        $rootScope.$broadcast('handleTokenBroadcast', userData.token);
      }).error(function(data, status, headers, config) {
        alert('The username and/or password is wrong.');
      });
  };

  /* all calls to fetch auth data would come here */
  user.getAuthData = function() {
    if (localStorageService.get('auth')) {
      return localStorageService.get('auth');
    }
    else {
      $location.path('#/login');
    }
  };

  return user;
}]);

/*This is the node factory which will handle all node related actions.*/
mi.factory('NodeFactory', ['$http', function($http) {
  var Node = {};

  /*Node.getNodeMultiple = function() {};*/

  /* to fetch a single node */
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

  /* this is to fetch a list of latest node based on the view in drupal */
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
    }).success(function(data) {});
  };

  /* save node taking the data from the form and passing it as post data */
  Node.saveNode = function(token, uid, NodeData) {
    return $http({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRF-Token': token
      },
      method: "POST",
      url: nodeSave,
      data: $.param({
        title: NodeData.title,
        body: NodeData.body,
        uid: uid,
        terms: NodeData.termsSelected
      })
    }).success(function(data) {});
  }

  return Node;
}]);

/* this factory method is controlling the taxonomy */
mi.factory('TaxonomyFactory', ['$http', '$rootScope', function($http, $rootScope) {
  var Terms = {};
  this.selectedTerms = {};

  Terms.getTerms = function(token, uid) {
    return $http({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRF-Token': token
      },
      method: "POST",
      url: vocabLoadUrl + '2',
      data: $.param({
        uid: uid
      })
    }).success(function(data) {
      });
  }

  Terms.updateSelected = function(terms) {
    this.selectedTerms = terms;
    $rootScope.$broadcast('handleTermSelectBroadcast', terms);
  }

  Terms.giveTerms = function() {
    return this.selectedTerms;
  }

  return Terms;
}]);