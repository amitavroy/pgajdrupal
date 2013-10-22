mi.controller('globalCtrl', function($scope, localStorageService, sharedUser) {
  $scope.globalNavigationURL = "includes/nav.html";
  $scope.globalUserData = sharedUser.getAuthData();
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

  /*var temp = sharedUser.getAuthData();
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
  }*/
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
mi.controller('createCtrl', function($scope, NodeFactory, TaxonomyFactory) {
  var node = [];

  NodeFactory.getNode($scope.globalToken, 90).then(function(data) {
    console.log(data.data);
  });

  $scope.$on('handleTermSelectBroadcast', function() {
    $scope.termsSelected = TaxonomyFactory.giveTerms();
  })

  $scope.saveNode = function(node) {
    var nodeSave = {};

    /*saving the node object*/
    nodeSave.title = node.title;
    nodeSave.body = node.body;
    nodeSave.termsSelected = $scope.termsSelected;

    NodeFactory.saveNode($scope.globalToken, $scope.globalUid, nodeSave).then(function(data) {
      console.log(data.data);
    });
  }
});