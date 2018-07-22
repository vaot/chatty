const app = angular.module('chatty');

app.controller('RoomsNewCtrl', [
  '$scope',
  '$state',
  'RoomsResource',
  ($scope, $state, RoomsResource) => {

    $scope.createRoom = (room) => {
      // TO DO: BIG SECURITY HOLE HERE
      // We need to authenticate the API request
      room.user_id = parseInt(window.Chatty.userId, 10)
      let Room = new RoomsResource(room)

      Room.$save().then((result)=> {
        $state.go('rooms.chat', { roomId: result.roomId });
        console.log(result);
      })
    }
  }
])
