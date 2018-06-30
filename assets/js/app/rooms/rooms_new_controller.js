const app = angular.module('chatty');

app.controller('RoomsNewCtrl', [
  '$scope',
  '$state',
  ($scope, $state) => {

    let _generateRandomId = () => {
      return (Math.random().toString(36).substring(2,10) + Math.random().toString(36).substring(2,10));
    }

    $scope.createRoom = () => {
      const roomId = _generateRandomId();
      $state.go('rooms.chat', { roomId: roomId });
    }
  }
])
