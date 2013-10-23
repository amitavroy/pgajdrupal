mi.controller('globalCtrl', function($scope, localStorageService, sharedUser) {
  $scope.globalNavigationURL = "includes/nav.html";
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
  try {
    /*common code*/
    var authData = sharedUser.getAuthData();
    $scope.uid = authData.uid;
    $scope.token = authData.token;

    $scope.nodes = {};

    NodeFactory.getLatest($scope.token, $scope.uid).then(function(nodes) {
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
  }
  catch (err) {
    alert("There was an error on the page \n " + err);
  }

  $scope.showNode = function(nid) {
    $location.path("node/" + nid);
  }

});

mi.controller('fullNodeCtrl', function($scope, sharedUser, NodeFactory, localStorageService, $location, $routeParams) {
  /*common code*/
  var authData = sharedUser.getAuthData();
  $scope.uid = authData.uid;
  $scope.token = authData.token;

  $scope.node = "";

  $scope.nid = $routeParams.nid;
});

/* The create node controller is here */
mi.controller('createCtrl', function($scope, NodeFactory, TaxonomyFactory, sharedUser) {
  /*common code*/
  var authData = sharedUser.getAuthData();
  $scope.uid = authData.uid;
  $scope.token = authData.token;
  var node = [];

  NodeFactory.getNode($scope.token, 90).then(function(data) {
//    console.log(data.data);
  });

  $scope.$on('handleTermSelectBroadcast', function() {
    $scope.termsSelected = TaxonomyFactory.giveTerms();
//    console.log($scope.termsSelected);
  })

  $scope.saveNode = function(node) {
    var nodeSave = {};

    /*saving the node object*/
    nodeSave.title = node.title;
    nodeSave.body = node.body;
    nodeSave.termsSelected = [];

    angular.forEach($scope.termsSelected, function(value, key) {
      /*pushing the ids which are selected*/
      if (value.status == true) {
        nodeSave.termsSelected.push(value.id);
      }
    });

    NodeFactory.saveNode($scope.token, $scope.uid, nodeSave).then(function(data) {
//      console.log(data.data);
    });
  }
});