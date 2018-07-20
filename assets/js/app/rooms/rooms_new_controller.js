const app = angular.module('chatty');

app.controller('RoomsNewCtrl', [
  '$scope',
  '$state',
  ($scope, $state) => {

    let _generateRandomId = () => {
      return (Math.random().toString(36).substring(2,10) + Math.random().toString(36).substring(2,10));
    }

    $scope.createRoom = (channelName) => {
      console.log(channelName);
      const roomId = _generateRandomId();
      console.log(roomId);
      $state.go('rooms.chat', { roomId: roomId, channelName: channelName });
    }
  }
])
