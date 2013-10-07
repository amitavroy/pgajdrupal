mi.directive('node', function() {
  return {
    restrict: 'E',
    templateUrl: 'includes/directives/node.html',
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
        var node = thisNode.data;
        
        $scope.nodetitle = node.title;
        
        // if body copy is not present.
        if (node.body.und) {
          $scope.body = node.body.und[0].safe_value;
        }
      });
    }
  };
});