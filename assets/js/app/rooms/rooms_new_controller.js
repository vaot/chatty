const app = angular.module('chatty');

app.controller('RoomsNewCtrl', [
  '$scope',
  '$state',
  'RoomsResource',
  ($scope, $state, RoomsResource) => {

    $scope.createRoom = (channelName) => {
      
      let Room = new RoomsResource({channelName: channelName})

      Room.$save().then((result)=> {
        $state.go('rooms.chat', { roomId: result.roomId, channelName: channelName });
        console.log(result);
      })
    }
  }
])
