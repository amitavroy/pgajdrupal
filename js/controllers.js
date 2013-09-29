/*login controller*/
mi.controller('loginCtrl', function($scope, sharedUser, $location) {
  console.log('Login please');
  /*handling the click on login button*/
  $scope.doLogin = function(formData) {
    if (formData.username && formData.pass) {
      sharedUser.login(formData.username, formData.pass).then(function(data) {
        console.log(data);
        $location.path('/home');
      });
    }
    else {
      alert('Please enter your username and password');
    }
  };
});

mi.controller('homeCtrl', function($scope, sharedUser, $cookieStore) {
  console.log('I come back home');
  console.log(sharedUser.getAuth());
});