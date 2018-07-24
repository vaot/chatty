const app = angular.module('chatty');

app.controller('RoomsNewCtrl', [
  '$scope',
  '$state',
  'RoomsResource',
  ($scope, $state, RoomsResource) => {
    $scope.createRoom = (room) => {
      let Room = new RoomsResource(room)

      Room.$save().then((result)=> {
        $state.go('rooms.chat', { roomId: result.roomId });
        console.log(result);
      })
    }
  }
])
