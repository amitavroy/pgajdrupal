/*This is the controller for login page.*/
mi.controller('loginCtrl', function($scope, sharedUser, $location, $rootScope) {
  $scope.doLogin = function(username, password) {
//    var username = form.username;
//    var password = form.pass;
    sharedUser.login("admin", "m1nda").then(function(data) {
      $location.path('/home');
    });
  };
});

/*This is the home page controller.*/
mi.controller('homeCtrl', function($scope, sharedUser, NodeFactory, $cookieStore, $location) {
  $scope.auth = $cookieStore.get('auth');
  $scope.token = $scope.auth.token;
  $scope.nodes = {};

  $scope.$on('handleTokenBroadcast', function(event, token) {
    $scope.token = token;
  });

  sharedUser.getToken($scope.auth.uid).then(function(data) {
    NodeFactory.getLatest($scope.token, $scope.auth.uid).then(function(nodes) {
      // console.log(nodes);
      angular.forEach(nodes.data, function(value, key) {
        $scope.nodes[key] = value;
      });
      console.log($scope.nodes);
    });
  });
});