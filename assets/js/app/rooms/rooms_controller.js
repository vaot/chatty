const app = angular.module('chatty');

app.controller('RoomsCtrl', [
  '$scope',
  ($scope) => {
    console.log('RoomsCtrl', "controller");
  }
])
