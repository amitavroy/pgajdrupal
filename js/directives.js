/* This is the teaser directive */
mi.directive('teaser', function() {
  return {
    restrict: 'E',
    templateUrl: 'includes/directives/node_teaser.html',
    scope: {
      number: '=',
      object: '='
    },
    link: function (scope, element, attrs) {
      scope.node = [];
      // console.log(scope.object.title);
      var title = scope.object.title;

      scope.node.title = title;
      scope.node.name = scope.object.name;
    }
  };
});

/* This is the full node directive */
mi.directive('node', function() {
  return {
    restrict: 'E',
    templateUrl: 'includes/directives/node_full.html',
    scope: {
      number: '='
    },
    controller: function($scope, $element, $attrs, NodeFactory, localStorageService) {
      $scope.auth = localStorageService.get('auth');
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