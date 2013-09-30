mi.directive('node', function() {
  return {
    restrict: 'E',
    templateUrl: 'includes/node.html',
    scope: {
      number: '='
    },
    controller: function($scope, $element, $attrs, NodeFactory, $cookieStore) {
      $scope.auth = $cookieStore.get('auth');
      $scope.token = $scope.auth.token;
      
      $scope.$on('handleTokenBroadcast', function(event, token) {
        $scope.token = token;
      });
      
      $scope.nid = $scope.number;
      
      NodeFactory.getNode($scope.token, $scope.nid).then(function(thisNode) {
        console.log(thisNode.data);
        var node = thisNode.data;
        $scope.nodetitle = node.title;
      });
    }
  };
});