const app = angular.module('chatty');

app.controller('FriendsController', [
  '$scope',
  ($scope) => {
    console.log('FriendsController', "controller");
  }
])
