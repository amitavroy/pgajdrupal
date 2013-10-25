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
      var title = scope.object.title;

      scope.node.title = title;
      scope.node.name = scope.object.name;
      bodyString = scope.object.body.und[0].value;
      try {
        bodyString = $(bodyString).text();
      }
      catch (e){
        /*do nothing*/
      }
      scope.node.body = trim_view(bodyString, 200);
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
        console.log(node);
        
        $scope.nodetitle = node.title;
        
        /* if body copy is not present */
        if (node.body.und) {
          $scope.body = node.body.und[0].safe_value;
        }

        /* comment count */
        $scope.commentFlag = (node.comment == 2) ? true : false;
        $scope.commentText = "Comments";
        if (node.comment_count == 0) {
          $scope.commentText = "Be the first to comment";
        }

        $scope.commentcount = (node.comment_count > 1) ? node.comment_count + " Comments" : node.comment_count + " Comment";

        if ($scope.commentFlag) {
          $comments = node.all_comments;
          $scope.comments = $comments;
        };
      });
    }
  };
});

mi.directive('termselection', function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'includes/directives/term_selection.html',
    controller: function($scope, $element, $attrs, TaxonomyFactory) {
      TaxonomyFactory.getTerms($scope.globalToken, $scope.globalUid).then(function(data) {
        var terms = [];

        angular.forEach(data.data, function(value, key) {
          terms.push({
            'id': value.tid,
            'value': value.name,
            'status': false
          });
        });

        $scope.terms = terms;

        $scope.changed = function(terms) {
          TaxonomyFactory.updateSelected(terms);
        }
      });
    }
  }
});

/*directive for the modal pop up*/
mi.directive('modalpopup', function() {
  return {
    restrict: 'E',
    templateUrl: 'includes/directives/modal.html',
    scope: {
      popuptitle: '@',
      bodymessage: '@',
      savebutton: '='
    },
    link: function (scope, element, attrs) {}
  };
});

/*directive for the comment form*/
mi.directive('commentsfull', function() {
  return {
    restrict: 'E',
    templateUrl: 'includes/directives/commentsfull.html',
    scope: {
      comment: '='
    },
    link: function (scope, element, attrs) {
      console.log(scope.comment);
    }
  };
});

/*directive for the comment form*/
mi.directive('commentform', function() {
  return {
    restrict: 'E',
    templateUrl: 'includes/directives/commentform.html',
    scope: {
      popuptitle: '@',
      bodymessage: '@',
      savebutton: '='
    },
    link: function (scope, element, attrs) {
      console.log(scope);
    }
  };
});