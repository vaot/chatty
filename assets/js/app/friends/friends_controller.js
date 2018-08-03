const app = angular.module('chatty')

app.controller('FriendsController', [
  '$scope',
  'friends',
  ($scope, friends) => {
    $scope.friends = friends
  }
])
