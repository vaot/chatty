const app = angular.module('chatty');

app.controller('RoomsCtrl', [
  '$scope',
  ($scope) => {
    console.log($scope, "controller");
  }
])
