mi.controller('globalCtrl', function($scope, localStorageService) {
  $scope.globalNavigationURL = "includes/nav.html";
  $scope.globalAuth = localStorageService.get('auth');
  $scope.globalToken = $scope.globalAuth.token;
});

/*This is the controller for login page.*/
mi.controller('loginCtrl', function($scope, sharedUser, $location) {
  $scope.doLogin = function(username, password) {
    if (username && password) {
      sharedUser.login(username, password).then(function(data) {
        $location.path('/home');
      });
    }
    else {
      alert("Please fill in username and password");
    }
  };
});

/*This is the home page controller.*/
mi.controller('homeCtrl', function($scope, sharedUser, NodeFactory, localStorageService, $location) {
  $scope.auth = localStorageService.get('auth');
  $scope.token = $scope.auth.token;
  $scope.nodes = {};

  $scope.$on('handleTokenBroadcast', function(event, token) {
    $scope.token = token;
  });

  sharedUser.getToken($scope.auth.uid).then(function(data) {
    NodeFactory.getLatest($scope.token, $scope.auth.uid).then(function(nodes) {
        var count = nodes.data.length;
        var keys = [];
        angular.forEach(nodes.data, function(value, key) {
          $scope.nodes[key] = value;
          keys.push(key);
        });
        
        var keyMax = Math.max.apply(null, keys);
        var keyMin = Math.min.apply(null, keys);
        
        var finalNodes =[];
        for (var i = keyMax; i >= keyMin; i--) {
          if ($scope.nodes[i]) {
            finalNodes.push($scope.nodes[i]);
          }
        }
        
        $scope.finalNodes = finalNodes;
    });
  });
  
  $scope.showNode = function(nid) {
    $location.path("node/" + nid);
  }
});

mi.controller('fullNodeCtrl', function($scope, sharedUser, NodeFactory, localStorageService, $location, $routeParams) {
  $scope.auth = localStorageService.get('auth');
  $scope.token = $scope.auth.token;
  $scope.node = "";

  $scope.$on('handleTokenBroadcast', function(event, token) {
    $scope.token = token;
  });

  $scope.nid = $routeParams.nid;
  console.log($scope.nid);
});

/* The create node controller is here */
mi.controller('createCtrl', function($scope, NodeFactory) {
  var node = [];
  node.title = "";
  node.body = "";

  NodeFactory.getNode($scope.globalToken, 107).then(function(data) {
    console.log(data.data);
  })
});